import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'inventory/stock-in/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'inventory/stock-out/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'inventory/history/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'sales/orders/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'sales/customers/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'purchase/suppliers/view/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'purchase/suppliers/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'purchase/orders/view/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'purchase/orders/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'management/users/view/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'management/users/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
