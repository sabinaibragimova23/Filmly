"""Acceptance tests for Filmly (AC-1 .. AC-5, see docs/ACCEPTANCE_CRITERIA.md).

These tests describe behaviour that must stay true after every change.
They use an in-memory test database and never call external services.
"""
import os
import sys
from unittest import mock

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from .advisor import GroqMovieAdvisor, get_advisor
from .models import Favorite, Movie, Review


def make_movie(title='Inception', genre='Sci-Fi', year=2010):
    return Movie.objects.create(title=title, description='desc', genre=genre, year=year)


class AC1PublicCatalogTests(TestCase):
    """AC-1: anyone can browse and filter the catalog without logging in."""

    def setUp(self):
        make_movie('Inception', 'Sci-Fi', 2010)
        make_movie('Joker', 'Drama', 2019)
        self.client = APIClient()

    def test_anonymous_user_can_list_movies(self):
        response = self.client.get('/api/movies/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_search_and_genre_filters(self):
        by_title = self.client.get('/api/movies/', {'search': 'incep'})
        self.assertEqual([m['title'] for m in by_title.data], ['Inception'])
        by_genre = self.client.get('/api/movies/', {'genre': 'drama'})
        self.assertEqual([m['title'] for m in by_genre.data], ['Joker'])

    def test_anonymous_user_can_open_movie_detail(self):
        movie = Movie.objects.get(title='Joker')
        response = self.client.get(f'/api/movies/{movie.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Joker')


class AC2AuthTests(TestCase):
    """AC-2: register and login return a token; a wrong password is rejected."""

    def setUp(self):
        self.client = APIClient()

    def test_register_then_login(self):
        reg = self.client.post('/api/auth/register/', {
            'username': 'alice', 'email': 'alice@example.com',
            'password': 'secret123', 'password2': 'secret123',
        }, format='json')
        self.assertEqual(reg.status_code, 201)
        self.assertIn('token', reg.data)

        login = self.client.post('/api/auth/login/', {
            'username': 'alice', 'password': 'secret123'}, format='json')
        self.assertEqual(login.status_code, 200)
        self.assertEqual(login.data['token'], reg.data['token'])

    def test_wrong_password_is_rejected(self):
        User.objects.create_user('bob', 'bob@example.com', 'secret123')
        response = self.client.post('/api/auth/login/', {
            'username': 'bob', 'password': 'wrong-pass'}, format='json')
        self.assertEqual(response.status_code, 401)
        self.assertNotIn('token', response.data)


class AC3ReviewTests(TestCase):
    """AC-3: one review per user and movie, rating 1-5, average is updated."""

    def setUp(self):
        self.movie = make_movie()
        self.alice = User.objects.create_user('alice', 'a@example.com', 'secret123')
        self.bob = User.objects.create_user('bob', 'b@example.com', 'secret123')
        self.client = APIClient()

    def post_review(self, user, rating, text='Good film'):
        self.client.force_authenticate(user)
        return self.client.post(f'/api/movies/{self.movie.id}/reviews/',
                                {'text': text, 'rating': rating}, format='json')

    def test_create_review_and_average(self):
        self.assertEqual(self.post_review(self.alice, 5).status_code, 201)
        self.assertEqual(self.post_review(self.bob, 2).status_code, 201)
        movie = self.client.get(f'/api/movies/{self.movie.id}/').data
        self.assertEqual(movie['average_rating'], 3.5)

    def test_second_review_by_same_user_is_rejected(self):
        self.post_review(self.alice, 4)
        response = self.post_review(self.alice, 1)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Review.objects.filter(user=self.alice).count(), 1)

    def test_rating_outside_1_to_5_is_rejected(self):
        self.assertEqual(self.post_review(self.alice, 6).status_code, 400)
        self.assertEqual(self.post_review(self.alice, 0).status_code, 400)
        self.assertEqual(Review.objects.count(), 0)

    def test_anonymous_user_cannot_review(self):
        self.client.force_authenticate(None)
        response = self.client.post(f'/api/movies/{self.movie.id}/reviews/',
                                    {'text': 'x', 'rating': 3}, format='json')
        self.assertEqual(response.status_code, 401)


class AC4ReviewOwnershipTests(TestCase):
    """AC-4: a user can edit and delete only their own reviews."""

    def setUp(self):
        movie = make_movie()
        self.alice = User.objects.create_user('alice', 'a@example.com', 'secret123')
        self.bob = User.objects.create_user('bob', 'b@example.com', 'secret123')
        self.review = Review.objects.create(movie=movie, user=self.alice, text='Mine', rating=4)
        self.client = APIClient()

    def test_owner_can_edit(self):
        self.client.force_authenticate(self.alice)
        response = self.client.put(f'/api/reviews/{self.review.id}/', {'rating': 5}, format='json')
        self.assertEqual(response.status_code, 200)
        self.review.refresh_from_db()
        self.assertEqual(self.review.rating, 5)

    def test_other_user_cannot_edit_or_delete(self):
        self.client.force_authenticate(self.bob)
        put = self.client.put(f'/api/reviews/{self.review.id}/', {'rating': 1}, format='json')
        delete = self.client.delete(f'/api/reviews/{self.review.id}/')
        self.assertEqual(put.status_code, 404)
        self.assertEqual(delete.status_code, 404)
        self.review.refresh_from_db()
        self.assertEqual(self.review.rating, 4)


class AC5FavoriteTests(TestCase):
    """AC-5: favorites can be added once, listed and removed."""

    def setUp(self):
        self.movie = make_movie()
        self.user = User.objects.create_user('alice', 'a@example.com', 'secret123')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_add_list_remove(self):
        add = self.client.post('/api/favorites/', {'movie': self.movie.id}, format='json')
        self.assertEqual(add.status_code, 201)
        listed = self.client.get('/api/favorites/')
        self.assertEqual([f['movie'] for f in listed.data], [self.movie.id])
        remove = self.client.delete(f'/api/favorites/{self.movie.id}/')
        self.assertEqual(remove.status_code, 204)
        self.assertFalse(Favorite.objects.exists())

    def test_duplicate_favorite_is_rejected(self):
        self.client.post('/api/favorites/', {'movie': self.movie.id}, format='json')
        again = self.client.post('/api/favorites/', {'movie': self.movie.id}, format='json')
        self.assertEqual(again.status_code, 400)
        self.assertEqual(Favorite.objects.count(), 1)


class FakeAdvisor:
    """Test double for the MovieAdvisor interface (no network)."""

    def __init__(self, reply='Alien (1979) — classic sci-fi horror.'):
        self.reply = reply
        self.messages = []

    def suggest(self, user_message):
        self.messages.append(user_message)
        return self.reply


class AdvisorAdapterTests(TestCase):
    """Task 3: the view talks to the advisor only through the adapter."""

    def setUp(self):
        self.user = User.objects.create_user('alice', 'a@example.com', 'secret123')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_view_uses_injected_advisor(self):
        fake = FakeAdvisor()
        with mock.patch('api.views.get_advisor', return_value=fake):
            response = self.client.post('/api/ai-advisor/', {'message': 'scary space'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['reply'], fake.reply)
        self.assertEqual(fake.messages, ['scary space'])

    def test_missing_key_returns_503(self):
        with mock.patch.dict(os.environ, {'GROQ_API_KEY': ''}):
            response = self.client.post('/api/ai-advisor/', {'message': 'comedy'}, format='json')
        self.assertEqual(response.status_code, 503)

    def test_empty_message_returns_400(self):
        response = self.client.post('/api/ai-advisor/', {'message': '   '}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_factory_returns_groq_adapter_when_key_set(self):
        with mock.patch.dict(os.environ, {'GROQ_API_KEY': 'test-placeholder'}):
            advisor = get_advisor()
        self.assertIsInstance(advisor, GroqMovieAdvisor)

    def test_api_module_imports_without_groq_installed(self):
        # Simulate an environment where the groq package is missing.
        import importlib
        import api.views
        with mock.patch.dict(sys.modules, {'groq': None}):
            importlib.reload(api.views)  # must not raise ImportError
        importlib.reload(api.views)


class M1MovieWritePermissionTests(TestCase):
    """Mitigation for R-01: only admins may create, edit or delete movies."""

    def setUp(self):
        self.movie = make_movie('Original')
        self.user = User.objects.create_user('alice', 'a@example.com', 'secret123')
        self.admin = User.objects.create_user('admin', 'admin@example.com', 'secret123', is_staff=True)
        self.client = APIClient()

    def test_anonymous_cannot_edit_or_delete(self):
        put = self.client.put(f'/api/movies/{self.movie.id}/', {'title': 'HACKED'}, format='json')
        delete = self.client.delete(f'/api/movies/{self.movie.id}/')
        self.assertEqual(put.status_code, 401)
        self.assertEqual(delete.status_code, 401)
        self.movie.refresh_from_db()
        self.assertEqual(self.movie.title, 'Original')

    def test_regular_user_cannot_create_edit_or_delete(self):
        self.client.force_authenticate(self.user)
        post = self.client.post('/api/movies/', {
            'title': 'New', 'description': 'd', 'genre': 'Drama', 'year': 2024}, format='json')
        put = self.client.put(f'/api/movies/{self.movie.id}/', {'title': 'HACKED'}, format='json')
        delete = self.client.delete(f'/api/movies/{self.movie.id}/')
        self.assertEqual((post.status_code, put.status_code, delete.status_code), (403, 403, 403))
        self.assertEqual(Movie.objects.count(), 1)

    def test_admin_can_still_edit(self):
        self.client.force_authenticate(self.admin)
        put = self.client.put(f'/api/movies/{self.movie.id}/', {'title': 'Fixed title'}, format='json')
        self.assertEqual(put.status_code, 200)
        self.movie.refresh_from_db()
        self.assertEqual(self.movie.title, 'Fixed title')


class M2SettingsFromEnvironmentTests(TestCase):
    """Mitigation for R-02: secrets and debug flags come from the environment."""

    def load_settings(self, env):
        import importlib
        import filmly.settings as settings_module
        with mock.patch.dict(os.environ, env, clear=True), \
                mock.patch('filmly.settings.load_dotenv'):
            module = importlib.reload(settings_module)
            values = (module.SECRET_KEY, module.DEBUG, module.ALLOWED_HOSTS)
        importlib.reload(settings_module)
        return values

    def test_safe_defaults_when_nothing_is_configured(self):
        secret_key, debug, hosts = self.load_settings({})
        self.assertFalse(debug)
        self.assertNotIn('*', hosts)
        self.assertFalse(secret_key.startswith('django-insecure-'))
        self.assertGreaterEqual(len(secret_key), 50)

    def test_values_are_read_from_environment(self):
        secret_key, debug, hosts = self.load_settings({
            'DJANGO_SECRET_KEY': 'test-only-key-' + 'x' * 40,
            'DJANGO_DEBUG': 'True',
            'DJANGO_ALLOWED_HOSTS': 'filmly.local,localhost',
        })
        self.assertEqual(secret_key, 'test-only-key-' + 'x' * 40)
        self.assertTrue(debug)
        self.assertEqual(hosts, ['filmly.local', 'localhost'])

    def test_no_api_keys_hardcoded_in_settings(self):
        from pathlib import Path
        source = (Path(__file__).resolve().parent.parent / 'filmly' / 'settings.py').read_text()
        for marker in ('sk-ant-', 'gsk_', "SECRET_KEY = '"):
            self.assertFalse(marker in source, f'{marker!r} found in settings.py')
