import { Profile } from './features/profile/profile';
import { AddressForm } from './features/profile/address-form/address-form';
import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register'
import { Home } from './features/home/home';
import { guestGuard } from './core/guards/guest/guest-guard';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { ProductDetail } from './features/product-detail/product-detail';
import {Catalog} from './features/catalog/catalog';
import { CartPage } from './features/cart-page/cart-page';
import {Checkout} from './features/checkout/checkout';
import { WishlistPage } from './features/wishlist-page/wishlist-page';
import { Shipping } from './features/static/shipping/shipping';
import { Privacy } from './features/static/privacy/privacy';
import { Terms } from './features/static/terms/terms';
import { CheckoutSuccess } from './features/checkout-success/checkout-success';
import { sellerGuard } from './core/guards/seller/seller-guard';
import { SellerLayout } from './core/layout/seller-layout/seller-layout';
import { SellerDashboard } from './features/seller/seller-dashboard/seller-dashboard';
import { SellerOrders } from './features/seller/seller-orders/seller-orders';
import { SellerProducts } from './features/seller/seller-products/seller-products';
import { ProductCreate } from './features/seller/product-create/product-create';
import { ProductEdit } from './features/seller/product-edit/product-edit';
import { PaymentFailed } from './features/payment-failed/payment-failed';


export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [guestGuard]},
    { path: 'register', component: Register, canActivate: [guestGuard] },
    { path: 'cart/checkout', component: Checkout },
    { path: 'payment-failed', component: PaymentFailed },

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
            { path : 'payment-success', component: CheckoutSuccess},
            { path : 'wishlist', component: WishlistPage}
        ]
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    },
    {
        path: 'seller',
        component: SellerLayout,
        canActivate: [sellerGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: SellerDashboard },
            { path: 'orders', component: SellerOrders },
            { path: 'products', component: SellerProducts },
            { path: 'products/new', component: ProductCreate },
            { path: 'products/edit/:id', component: ProductEdit },
        ],
    },
    { path: '**', redirectTo: '' }
];
