import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ProductsComponent } from './features/inventory/products/products.component';
import { AddProductComponent } from './features/inventory/products/add-product/add-product.component';
import { CategoriesComponent } from './features/inventory/categories/categories.component';
import { BrandsComponent } from './features/inventory/brands/brands.component';
import { StockInComponent } from './features/inventory/stock-in/stock-in.component';
import { AddStockInComponent } from './features/inventory/stock-in/add-stock-in/add-stock-in.component';
import { EditStockInComponent } from './features/inventory/stock-in/edit-stock-in/edit-stock-in.component';
import { StockOutComponent } from './features/inventory/stock-out/stock-out.component';
import { AddStockOutComponent } from './features/inventory/stock-out/add-stock-out/add-stock-out.component';
import { EditStockOutComponent } from './features/inventory/stock-out/edit-stock-out/edit-stock-out.component';
import { InventoryHistoryComponent } from './features/inventory/inventory-history/inventory-history.component';
import { EditMovementComponent } from './features/inventory/inventory-history/edit-movement/edit-movement.component';
import { OrdersComponent } from './features/sales/orders/orders.component';
import { AddOrderComponent } from './features/sales/orders/add-order/add-order.component';
import { EditOrderComponent } from './features/sales/orders/edit-order/edit-order.component';
import { CustomersComponent } from './features/sales/customers/customers.component';
import { AddCustomerComponent } from './features/sales/customers/add-customer/add-customer.component';
import { EditCustomerComponent } from './features/sales/customers/edit-customer/edit-customer.component';
import { PaymentsComponent } from './features/sales/payments/payments.component';
import { InvoiceComponent } from './features/sales/invoice/invoice.component';
import { AddInvoiceComponent } from './features/sales/invoice/add-invoice/add-invoice.component';
import { SuppliersComponent } from './features/purchase/suppliers/suppliers.component';
import { AddSupplierComponent } from './features/purchase/suppliers/add-supplier/add-supplier.component';
import { ViewSupplierComponent } from './features/purchase/suppliers/view-supplier/view-supplier.component';
import { EditSupplierComponent } from './features/purchase/suppliers/edit-supplier/edit-supplier.component';
import { PurchaseOrdersComponent } from './features/purchase/purchase-orders/purchase-orders.component';
import { AddPurchaseOrderComponent } from './features/purchase/purchase-orders/add-purchase-order/add-purchase-order.component';
import { ViewPurchaseOrderComponent } from './features/purchase/purchase-orders/view-purchase-order/view-purchase-order.component';
import { EditPurchaseOrderComponent } from './features/purchase/purchase-orders/edit-purchase-order/edit-purchase-order.component';
import { SalesReportComponent } from './features/reports/sales-report/sales-report.component';
import { InventoryReportComponent } from './features/reports/inventory-report/inventory-report.component';
import { ProfitReportComponent } from './features/reports/profit-report/profit-report.component';
import { UsersComponent } from './features/management/users/users.component';
import { AddUserComponent } from './features/management/users/add-user/add-user.component';
import { ViewUserComponent } from './features/management/users/view-user/view-user.component';
import { EditUserComponent } from './features/management/users/edit-user/edit-user.component';
import { RolesComponent } from './features/management/roles/roles.component';
import { AddRoleComponent } from './features/management/roles/add-role/add-role.component';
import { SettingsComponent } from './features/management/settings/settings.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MyProfileComponent } from './features/profile/my-profile.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard],
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [guestGuard],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/login'
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'profile',
                component: MyProfileComponent
            },
            {
                path: 'products',
                component: ProductsComponent
            },
            {
                path: 'products/add',
                component: AddProductComponent
            },
            {
                path: 'categories',
                component: CategoriesComponent
            },
            {
                path: 'brands',
                component: BrandsComponent
            },
            {
                path: 'inventory/stock-in',
                component: StockInComponent
            },
            {
                path: 'inventory/stock-in/add',
                component: AddStockInComponent
            },
            {
                path: 'inventory/stock-in/edit/:id',
                component: EditStockInComponent
            },
            {
                path: 'inventory/stock-out',
                component: StockOutComponent
            },
            {
                path: 'inventory/stock-out/add',
                component: AddStockOutComponent
            },
            {
                path: 'inventory/stock-out/edit/:id',
                component: EditStockOutComponent
            },
            {
                path: 'inventory/history',
                component: InventoryHistoryComponent
            },
            {
                path: 'inventory/history/edit/:id',
                component: EditMovementComponent
            },
            {
                path: 'sales/orders',
                component: OrdersComponent
            },
            {
                path: 'sales/orders/add',
                component: AddOrderComponent
            },
            {
                path: 'sales/orders/edit/:id',
                component: EditOrderComponent
            },
            {
                path: 'sales/customers',
                component: CustomersComponent
            },
            {
                path: 'sales/customers/add',
                component: AddCustomerComponent
            },
            {
                path: 'sales/customers/edit/:id',
                component: EditCustomerComponent
            },
            {
                path: 'sales/payments',
                component: PaymentsComponent
            },
            {
                path: 'sales/invoice',
                component: InvoiceComponent
            },
            {
                path: 'sales/invoice/add',
                component: AddInvoiceComponent
            },
            {
                path: 'purchase/suppliers',
                component: SuppliersComponent
            },
            {
                path: 'purchase/suppliers/add',
                component: AddSupplierComponent
            },
            {
                path: 'purchase/suppliers/view/:id',
                component: ViewSupplierComponent
            },
            {
                path: 'purchase/suppliers/edit/:id',
                component: EditSupplierComponent
            },
            {
                path: 'purchase/orders',
                component: PurchaseOrdersComponent
            },
            {
                path: 'purchase/orders/add',
                component: AddPurchaseOrderComponent
            },
            {
                path: 'purchase/orders/view/:id',
                component: ViewPurchaseOrderComponent
            },
            {
                path: 'purchase/orders/edit/:id',
                component: EditPurchaseOrderComponent
            },
            {
                path: 'reports/sales',
                component: SalesReportComponent
            },
            {
                path: 'reports/inventory',
                component: InventoryReportComponent
            },
            {
                path: 'reports/profit',
                component: ProfitReportComponent
            },
            {
                path: 'management/users',
                component: UsersComponent
            },
            {
                path: 'management/users/add',
                component: AddUserComponent
            },
            {
                path: 'management/users/view/:id',
                component: ViewUserComponent
            },
            {
                path: 'management/users/edit/:id',
                component: EditUserComponent
            },
            {
                path: 'management/roles',
                component: RolesComponent
            },
            {
                path: 'management/roles/add',
                component: AddRoleComponent
            },
            {
                path: 'management/settings',
                component: SettingsComponent
            }

        ]

    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
