import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private api = 'http://127.0.0.1:8000/api';

  getReviews(movieId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.api}/movies/${movieId}/reviews/`);
  }

  getMyReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.api}/my-reviews/`);
  }

  createReview(movieId: number, data: any): Observable<Review> {
    return this.http.post<Review>(`${this.api}/movies/${movieId}/reviews/`, data);
  }

  updateReview(id: number, data: any): Observable<Review> {
    return this.http.put<Review>(`${this.api}/reviews/${id}/`, data);
  }

  deleteReview(id: number) {
    return this.http.delete(`${this.api}/reviews/${id}/`);
  }
}