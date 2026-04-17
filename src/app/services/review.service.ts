import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getReviews(movieId: number) {
    return this.http.get<Review[]>(`${this.apiUrl}/movies/${movieId}/reviews/`);
  }

  createReview(movieId: number, data: { text: string; rating: number }) {
    return this.http.post<Review>(`${this.apiUrl}/movies/${movieId}/reviews/`, data);
  }

  updateReview(reviewId: number, data: { text?: string; rating?: number }) {
    return this.http.put<Review>(`${this.apiUrl}/reviews/${reviewId}/`, data);
  }

  deleteReview(reviewId: number) {
    return this.http.delete(`${this.apiUrl}/reviews/${reviewId}/`);
  }
}