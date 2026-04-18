from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Movie, Review, Favorite, UserProfile


# ── serializers.Serializer (plain) ─────────────────────────────────────────

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': "Passwords do not match."})
        return data


# ── serializers.ModelSerializer ────────────────────────────────────────────

class MovieSerializer(serializers.ModelSerializer):
    average_rating = serializers.ReadOnlyField()

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'description', 'genre',
            'year', 'poster_url', 'average_rating', 'created_at',
        ]


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'movie', 'movie_title',
            'user', 'username', 'text', 'rating', 'created_at'
        ]
        read_only_fields = ['user', 'movie']

    def get_username(self, obj):
        return obj.user.username



class FavoriteSerializer(serializers.ModelSerializer):
    movie_details = MovieSerializer(source='movie', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'movie', 'movie_details', 'created_at']
        read_only_fields = ['user']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'avatar_url']