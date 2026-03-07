import { Profile } from './features/profile/profile';
import { AddressForm } from './features/profile/address-form/address-form';
import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register'
import { Home } from './features/home/home';
import { guestGuard } from './core/guards/guest-guard';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { ProductDetail } from './features/product-detail/product-detail';
import {Catalog} from './features/catalog/catalog';
import { CartPage } from './features/cart-page/cart-page';
import {Checkout} from './features/checkout/checkout';
import { WishlistPage } from './features/wishlist-page/wishlist-page';

export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [guestGuard]},
    { path: 'register', component: Register, canActivate: [guestGuard] },
    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', component: Home },
            { path : 'profile', component: Profile},
            { path : 'profile/address', component: AddressForm},
            { path : 'products/:id', component: ProductDetail},
            { path : 'catalog', component: Catalog},
            { path : 'cart', component: CartPage},
            { path : 'cart/checkout', component: Checkout},
            { path : 'wishlist', component: WishlistPage}
        ]
    },
    { path: '**', redirectTo: '' }
];
