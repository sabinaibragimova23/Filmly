import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Movie } from '../models';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getMovies(filters: { search?: string; genre?: string; year?: string } = {}) {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.genre)  params = params.set('genre',  filters.genre);
    if (filters.year)   params = params.set('year',   filters.year);
    return this.http.get<Movie[]>(`${this.apiUrl}/movies/`, { params });
  }

  getMovie(id: number) {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${id}/`);
  }

  createMovie(data: Partial<Movie>) {
    return this.http.post<Movie>(`${this.apiUrl}/movies/`, data);
  }

  updateMovie(id: number, data: Partial<Movie>) {
    return this.http.put<Movie>(`${this.apiUrl}/movies/${id}/`, data);
  }

  deleteMovie(id: number) {
    return this.http.delete(`${this.apiUrl}/movies/${id}/`);
  }
}