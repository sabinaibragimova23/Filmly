import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./pages/detail/detail.component').then(m => m.DetailComponent),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent),
  },

  {
  path: 'advisor',
  loadComponent: () =>
    import('./pages/advisor/advisor.component').then(m => m.AdvisorComponent),
  },

  {
  path: 'actors',
  loadComponent: () =>
    import('./pages/actors/actors.component').then(m => m.ActorsComponent),
  canActivate: [authGuard],
},

  {
    path: '**',
    redirectTo: 'home',
  },

];