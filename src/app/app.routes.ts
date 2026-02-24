import { Profile } from './features/profile/profile';
import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register'
import { Home } from './features/home/home';
import { guestGuard } from './core/guards/guest-guard';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { ProductDetail } from './features/product-detail/product-detail';

export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [guestGuard]}, 
    { path: 'register', component: Register, canActivate: [guestGuard] },
    { 
        path: '', 
        component: MainLayout, 
        children: [
            { path: '', component: Home },
            { path : 'profile', component: Profile},
            { path : 'products/:id', component: ProductDetail}
        ]
    },
    { path: '**', redirectTo: '' }
];
