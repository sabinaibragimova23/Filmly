from django.urls import path
from . import views

urlpatterns = [
    # Auth — FBV
    path('auth/login/',    views.login_view,    name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/logout/',   views.logout_view,   name='logout'),
    path('auth/me/',       views.me_view,        name='me'),

    # Movies — CBV
    path('movies/',         views.MovieListView.as_view(),   name='movie-list'),
    path('movies/<int:pk>/', views.MovieDetailView.as_view(), name='movie-detail'),

    # Reviews — CBV
    path('movies/<int:movie_id>/reviews/', views.ReviewListView.as_view(),   name='review-list'),
    path('reviews/<int:pk>/',              views.ReviewDetailView.as_view(), name='review-detail'),

    # Favorites — CBV
    path('favorites/',              views.FavoriteListView.as_view(),        name='favorite-list'),
    path('favorites/<int:movie_id>/', views.FavoriteDetailView.as_view(),   name='favorite-detail'),

    # Profile — CBV
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('my-reviews/', views.MyReviewListView.as_view(), name='my-reviews'),
    path('ai-advisor/', views.ai_advisor_view, name='ai-advisor'),
    path('actors/my-ratings/', views.actor_ratings_view, name='actor-ratings'),
]