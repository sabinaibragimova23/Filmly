from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg


# Custom Model Manager (requirement)
class ReviewManager(models.Manager):
    def published(self):
        return self.filter(is_published=True)

    def by_user(self, user):
        return self.filter(user=user)

    def for_movie(self, movie_id):
        return self.filter(movie_id=movie_id, is_published=True)


class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    genre = models.CharField(max_length=100)
    year = models.IntegerField()
    poster_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def average_rating(self):
        avg = self.reviews.filter(is_published=True).aggregate(
            avg=Avg('rating')
        )['avg']
        return round(avg, 1) if avg else 0.0


class Review(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]

    # ForeignKey relationship 1: Review → Movie
    movie = models.ForeignKey(
        Movie, on_delete=models.CASCADE, related_name='reviews'
    )
    # ForeignKey relationship 2: Review → User
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='reviews'
    )
    text = models.TextField()
    rating = models.IntegerField(choices=RATING_CHOICES)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = ReviewManager()  # custom manager

    class Meta:
        unique_together = ('movie', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} → {self.movie.title} ({self.rating}★)'


class Favorite(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='favorites'
    )
    movie = models.ForeignKey(
        Movie, on_delete=models.CASCADE, related_name='favorited_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} ♥ {self.movie.title}'


class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile'
    )
    bio = models.TextField(blank=True, default='')
    avatar_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} profile'