export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  year: number;
  poster_url: string | null;
  average_rating: number;
  created_at: string;
}

export interface Review {
  id: number;
  movie: number;
  movie_title?: string;
  user: number;
  username: string;
  text: string;
  rating: number;
  created_at: string;
}

export interface Favorite {
  id: number;
  movie: number;
  movie_details: Movie;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  username: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}