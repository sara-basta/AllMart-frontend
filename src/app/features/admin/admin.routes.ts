import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin/admin.guard';
import { AdminLayout } from '../../core/layout/admin-layout/admin-layout';
import { AdminDashboardComponent } from './workspace/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './workspace/admin-users/admin-users.component';
import { AdminProductsComponent } from './workspace/admin-products/admin-products.component';
import { AdminOrdersComponent } from './workspace/admin-orders/admin-orders.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'orders', component: AdminOrdersComponent },
    ],
  },
];


