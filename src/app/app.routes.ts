import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/my-profile.component').then(
            (m) => m.MyProfileComponent,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/inventory/products/products.component').then(
            (m) => m.ProductsComponent,
          ),
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./features/inventory/products/add-product/add-product.component').then(
            (m) => m.AddProductComponent,
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/inventory/categories/categories.component').then(
            (m) => m.CategoriesComponent,
          ),
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./features/inventory/brands/brands.component').then(
            (m) => m.BrandsComponent,
          ),
      },
      {
        path: 'inventory/stock-in',
        loadComponent: () =>
          import('./features/inventory/stock-in/stock-in.component').then(
            (m) => m.StockInComponent,
          ),
      },
      {
        path: 'inventory/stock-in/add',
        loadComponent: () =>
          import('./features/inventory/stock-in/add-stock-in/add-stock-in.component').then(
            (m) => m.AddStockInComponent,
          ),
      },
      {
        path: 'inventory/stock-in/edit/:id',
        loadComponent: () =>
          import('./features/inventory/stock-in/edit-stock-in/edit-stock-in.component').then(
            (m) => m.EditStockInComponent,
          ),
      },
      {
        path: 'inventory/stock-out',
        loadComponent: () =>
          import('./features/inventory/stock-out/stock-out.component').then(
            (m) => m.StockOutComponent,
          ),
      },
      {
        path: 'inventory/stock-out/add',
        loadComponent: () =>
          import('./features/inventory/stock-out/add-stock-out/add-stock-out.component').then(
            (m) => m.AddStockOutComponent,
          ),
      },
      {
        path: 'inventory/stock-out/edit/:id',
        loadComponent: () =>
          import('./features/inventory/stock-out/edit-stock-out/edit-stock-out.component').then(
            (m) => m.EditStockOutComponent,
          ),
      },
      {
        path: 'inventory/history',
        loadComponent: () =>
          import('./features/inventory/inventory-history/inventory-history.component').then(
            (m) => m.InventoryHistoryComponent,
          ),
      },
      {
        path: 'inventory/history/edit/:id',
        loadComponent: () =>
          import('./features/inventory/inventory-history/edit-movement/edit-movement.component').then(
            (m) => m.EditMovementComponent,
          ),
      },
      {
        path: 'sales/orders',
        loadComponent: () =>
          import('./features/sales/orders/orders.component').then(
            (m) => m.OrdersComponent,
          ),
      },
      {
        path: 'sales/orders/add',
        loadComponent: () =>
          import('./features/sales/orders/add-order/add-order.component').then(
            (m) => m.AddOrderComponent,
          ),
      },
      {
        path: 'sales/orders/edit/:id',
        loadComponent: () =>
          import('./features/sales/orders/edit-order/edit-order.component').then(
            (m) => m.EditOrderComponent,
          ),
      },
      {
        path: 'sales/customers',
        loadComponent: () =>
          import('./features/sales/customers/customers.component').then(
            (m) => m.CustomersComponent,
          ),
      },
      {
        path: 'sales/customers/add',
        loadComponent: () =>
          import('./features/sales/customers/add-customer/add-customer.component').then(
            (m) => m.AddCustomerComponent,
          ),
      },
      {
        path: 'sales/customers/edit/:id',
        loadComponent: () =>
          import('./features/sales/customers/edit-customer/edit-customer.component').then(
            (m) => m.EditCustomerComponent,
          ),
      },
      {
        path: 'sales/payments',
        loadComponent: () =>
          import('./features/sales/payments/payments.component').then(
            (m) => m.PaymentsComponent,
          ),
      },
      {
        path: 'sales/invoice',
        loadComponent: () =>
          import('./features/sales/invoice/invoice.component').then(
            (m) => m.InvoiceComponent,
          ),
      },
      {
        path: 'sales/invoice/add',
        loadComponent: () =>
          import('./features/sales/invoice/add-invoice/add-invoice.component').then(
            (m) => m.AddInvoiceComponent,
          ),
      },
      {
        path: 'purchase/suppliers',
        loadComponent: () =>
          import('./features/purchase/suppliers/suppliers.component').then(
            (m) => m.SuppliersComponent,
          ),
      },
      {
        path: 'purchase/suppliers/add',
        loadComponent: () =>
          import('./features/purchase/suppliers/add-supplier/add-supplier.component').then(
            (m) => m.AddSupplierComponent,
          ),
      },
      {
        path: 'purchase/suppliers/view/:id',
        loadComponent: () =>
          import('./features/purchase/suppliers/view-supplier/view-supplier.component').then(
            (m) => m.ViewSupplierComponent,
          ),
      },
      {
        path: 'purchase/suppliers/edit/:id',
        loadComponent: () =>
          import('./features/purchase/suppliers/edit-supplier/edit-supplier.component').then(
            (m) => m.EditSupplierComponent,
          ),
      },
      {
        path: 'purchase/orders',
        loadComponent: () =>
          import('./features/purchase/purchase-orders/purchase-orders.component').then(
            (m) => m.PurchaseOrdersComponent,
          ),
      },
      {
        path: 'purchase/orders/add',
        loadComponent: () =>
          import('./features/purchase/purchase-orders/add-purchase-order/add-purchase-order.component').then(
            (m) => m.AddPurchaseOrderComponent,
          ),
      },
      {
        path: 'purchase/orders/view/:id',
        loadComponent: () =>
          import('./features/purchase/purchase-orders/view-purchase-order/view-purchase-order.component').then(
            (m) => m.ViewPurchaseOrderComponent,
          ),
      },
      {
        path: 'purchase/orders/edit/:id',
        loadComponent: () =>
          import('./features/purchase/purchase-orders/edit-purchase-order/edit-purchase-order.component').then(
            (m) => m.EditPurchaseOrderComponent,
          ),
      },
      {
        path: 'reports/sales',
        loadComponent: () =>
          import('./features/reports/sales-report/sales-report.component').then(
            (m) => m.SalesReportComponent,
          ),
      },
      {
        path: 'reports/inventory',
        loadComponent: () =>
          import('./features/reports/inventory-report/inventory-report.component').then(
            (m) => m.InventoryReportComponent,
          ),
      },
      {
        path: 'reports/profit',
        loadComponent: () =>
          import('./features/reports/profit-report/profit-report.component').then(
            (m) => m.ProfitReportComponent,
          ),
      },
      {
        path: 'management/users',
        loadComponent: () =>
          import('./features/management/users/users.component').then(
            (m) => m.UsersComponent,
          ),
      },
      {
        path: 'management/users/add',
        loadComponent: () =>
          import('./features/management/users/add-user/add-user.component').then(
            (m) => m.AddUserComponent,
          ),
      },
      {
        path: 'management/users/view/:id',
        loadComponent: () =>
          import('./features/management/users/view-user/view-user.component').then(
            (m) => m.ViewUserComponent,
          ),
      },
      {
        path: 'management/users/edit/:id',
        loadComponent: () =>
          import('./features/management/users/edit-user/edit-user.component').then(
            (m) => m.EditUserComponent,
          ),
      },
      {
        path: 'management/roles',
        loadComponent: () =>
          import('./features/management/roles/roles.component').then(
            (m) => m.RolesComponent,
          ),
      },
      {
        path: 'management/roles/add',
        loadComponent: () =>
          import('./features/management/roles/add-role/add-role.component').then(
            (m) => m.AddRoleComponent,
          ),
      },
      {
        path: 'management/settings',
        loadComponent: () =>
          import('./features/management/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
