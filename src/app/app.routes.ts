import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Home } from './features/home/home'

export const routes: Routes = [
    { path: 'login', component: Login }, 
    { path: '', component: Home, pathMatch: 'full' },
    { path: '**', redirectTo: '' }
];
