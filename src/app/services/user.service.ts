import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models';

export interface UserProfile {
  user: User;
  bio: string;
  avatar_url: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getMe() {
    return this.http.get<User>(`${this.apiUrl}/auth/me/`);
  }

  getProfile() {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/`);
  }

  updateProfile(data: { bio?: string; avatar_url?: string }) {
    return this.http.put<UserProfile>(`${this.apiUrl}/profile/`, data);
  }
}