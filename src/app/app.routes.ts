import { Profile } from './features/profile/profile';
import { AddressForm } from './features/profile/address-form/address-form';
import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register'
import { Home } from './features/home/home';
import { guestGuard } from './core/guards/guest/guest-guard';
import { adminGuard } from './core/guards/admin/admin-guard';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { AdminLayout } from './core/layout/admin-layout/admin-layout';
import { ProductDetail } from './features/product-detail/product-detail';
import {Catalog} from './features/catalog/catalog';
import { CartPage } from './features/cart-page/cart-page';
import {Checkout} from './features/checkout/checkout';
import { WishlistPage } from './features/wishlist-page/wishlist-page';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { Products } from './features/admin/products/products';
import { ProductForm } from './features/admin/products/product-form/product-form';
import { Categories } from './features/admin/categories/categories';
import { Users } from './features/admin/users/users';
import { Orders } from './features/admin/orders/orders';
import { Shipping } from './features/static/shipping/shipping';
import { Privacy } from './features/static/privacy/privacy';
import { Terms } from './features/static/terms/terms';


export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [guestGuard]},
    { path: 'register', component: Register, canActivate: [guestGuard] },

    { path: 'shipping', component: Shipping },
    { path: 'privacy', component: Privacy },
    { path: 'terms', component: Terms },

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
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [adminGuard],
        children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    
        { path: 'dashboard', component: AdminDashboard },
        { path: 'products', component: Products },
        { path: 'products/new', component: ProductForm },
        { path: 'products/:id', component: ProductForm },
        { path: 'categories', component: Categories },
        { path: 'orders', component: Orders },
        { path: 'users', component: Users },
        ]
    },
    { path: '**', redirectTo: '' }
];
