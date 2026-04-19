from collections import defaultdict

from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView

from .models import Movie, Review, Favorite, UserProfile, Actor, MovieActor
from .serializers import (
    LoginSerializer, RegisterSerializer,
    MovieSerializer, ReviewSerializer,
    FavoriteSerializer, UserProfileSerializer, UserSerializer,
)

import os
import json
import urllib.request
import urllib.error


class MyReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).order_by('-created_at')


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(
        username=serializer.validated_data['username'],
        password=serializer.validated_data['password'],
    )
    if not user:
        return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user_id': user.id, 'username': user.username})


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    data = serializer.validated_data
    user = User.objects.create_user(username=data['username'], email=data['email'], password=data['password'])
    UserProfile.objects.create(user=user)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user_id': user.id, 'username': user.username}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    return Response({'message': 'Logged out.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response(UserSerializer(request.user).data)


from groq import Groq

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_advisor_view(request):
    user_message = request.data.get('message', '').strip()
    if not user_message:
        return Response({'error': 'Message is required'}, status=400)

    api_key = os.environ.get('GROQ_API_KEY', '')
    if not api_key:
        return Response({'error': 'AI service not configured.'}, status=503)

    client = Groq(api_key=api_key)
    completion = client.chat.completions.create(
        model='llama-3.1-8b-instant',
        messages=[
            {'role': 'system', 'content': 'You are a movie expert. Recommend 2-3 films. Format: Title (year) — description. No markdown or asterisks.'},
            {'role': 'user', 'content': user_message}
        ]
    )
    return Response({'reply': completion.choices[0].message.content})


class MovieListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        movies = Movie.objects.all()
        search = request.query_params.get('search', '').strip()
        genre  = request.query_params.get('genre',  '').strip()
        year   = request.query_params.get('year',   '').strip()
        if search: movies = movies.filter(title__icontains=search)
        if genre:  movies = movies.filter(genre__icontains=genre)
        if year:   movies = movies.filter(year=year)
        return Response(MovieSerializer(movies, many=True).data)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MovieDetailView(APIView):
    permission_classes = [AllowAny]

    def _get_movie(self, pk):
        try: return Movie.objects.get(pk=pk)
        except Movie.DoesNotExist: return None

    def get(self, request, pk):
        movie = self._get_movie(pk)
        if not movie: return Response({'error': 'Movie not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(MovieSerializer(movie).data)

    def put(self, request, pk):
        movie = self._get_movie(pk)
        if not movie: return Response({'error': 'Movie not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MovieSerializer(movie, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        movie = self._get_movie(pk)
        if not movie: return Response({'error': 'Movie not found.'}, status=status.HTTP_404_NOT_FOUND)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewListView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request, movie_id):
        reviews = Review.objects.for_movie(movie_id)
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request, movie_id):
        try: movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist: return Response({'error': 'Movie not found.'}, status=status.HTTP_404_NOT_FOUND)
        if Review.objects.filter(movie=movie, user=request.user).exists():
            return Response({'error': 'You already reviewed this movie.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, movie=movie)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def _get_review(self, pk, user):
        try: return Review.objects.get(pk=pk, user=user)
        except Review.DoesNotExist: return None

    def put(self, request, pk):
        review = self._get_review(pk, request.user)
        if not review: return Response({'error': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        review = self._get_review(pk, request.user)
        if not review: return Response({'error': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FavoriteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(FavoriteSerializer(Favorite.objects.filter(user=request.user), many=True).data)

    def post(self, request):
        try: movie = Movie.objects.get(pk=request.data.get('movie'))
        except Movie.DoesNotExist: return Response({'error': 'Movie not found.'}, status=status.HTTP_404_NOT_FOUND)
        fav, created = Favorite.objects.get_or_create(user=request.user, movie=movie)
        if not created: return Response({'error': 'Already in favorites.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(FavoriteSerializer(fav).data, status=status.HTTP_201_CREATED)


class FavoriteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, movie_id):
        try:
            Favorite.objects.get(user=request.user, movie_id=movie_id).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({'error': 'Not in favorites.'}, status=status.HTTP_404_NOT_FOUND)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response(UserProfileSerializer(profile).data)

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def actor_ratings_view(request):
    user = request.user
    movie_scores = {}

    for review in Review.objects.filter(user=user, is_published=True).select_related('movie'):
        movie_scores[review.movie_id] = {
            'score': review.rating,
            'title': review.movie.title,
            'genre': review.movie.genre,
        }

    for fav in Favorite.objects.filter(user=user).select_related('movie'):
        mid = fav.movie_id
        if mid in movie_scores:
            movie_scores[mid]['score'] = min(5, movie_scores[mid]['score'] + 1)
        else:
            movie_scores[mid] = {'score': 4, 'title': fav.movie.title, 'genre': fav.movie.genre}

    if not movie_scores:
        return Response([])

    actor_data = defaultdict(lambda: {'total': 0, 'count': 0, 'genres': defaultdict(int), 'movies': [], 'actor': None})

    for credit in MovieActor.objects.filter(movie_id__in=movie_scores.keys()).select_related('actor', 'movie'):
        mid, aid = credit.movie_id, credit.actor_id
        info = movie_scores[mid]
        actor_data[aid]['total'] += info['score']
        actor_data[aid]['count'] += 1
        actor_data[aid]['genres'][info['genre']] += 1
        actor_data[aid]['movies'].append(info['title'])
        actor_data[aid]['actor'] = credit.actor

    if not actor_data:
        return Response([])

    max_score = max(d['total'] / d['count'] for d in actor_data.values())

    results = []
    for aid, data in actor_data.items():
        raw_avg = data['total'] / data['count']
        percent = round((raw_avg / max_score) * 99) if max_score > 0 else 0
        top_genre = max(data['genres'], key=data['genres'].get)
        results.append({
            'id': aid,
            'name': data['actor'].name,
            'photo_url': data['actor'].photo_url,
            'match_percent': percent,
            'movies_count': data['count'],
            'top_genre': top_genre,
            'movies': data['movies'][:3],
            '_raw': raw_avg,
        })

    results.sort(key=lambda x: x['_raw'], reverse=True)
    for i, r in enumerate(results):
        r['match_percent'] = max(10, r['match_percent'] - i * 3)
        del r['_raw']

    return Response(results[:20])
