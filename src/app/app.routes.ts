import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register'
import { Home } from './features/home/home';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [guestGuard]}, 
    { path: 'register', component: Register, canActivate: [guestGuard] },
    { path: '', component: Home, pathMatch: 'full' },
    { path: '**', redirectTo: '' }
];
