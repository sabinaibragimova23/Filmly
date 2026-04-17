import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Favorite } from '../models';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getFavorites() {
    return this.http.get<Favorite[]>(`${this.apiUrl}/favorites/`);
  }

  addFavorite(movieId: number) {
    return this.http.post<Favorite>(`${this.apiUrl}/favorites/`, { movie: movieId });
  }

  removeFavorite(movieId: number) {
    return this.http.delete(`${this.apiUrl}/favorites/${movieId}/`);
  }
}