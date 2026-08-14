import { LucideIconData, LayoutDashboard, LayoutGrid, Boxes, Package, Layers, Tag,
    ArrowDownToLine, ArrowUpFromLine, History, ShoppingCart, ShoppingBag, Users,
    CreditCard, Receipt, ClipboardList, ClipboardPlus, Truck, ChartBar, ChartLine,
    ChartPie, Banknote, SlidersHorizontal, UserCog, ShieldCheck, Settings } from 'lucide-angular';

export interface SidebarMenu {
    title: string;
    icon: LucideIconData;
    route?: string;
    badge?: string | number;
    expanded?: boolean;
    children?: SidebarMenu[];
}

export interface SidebarUser {
    name: string;
    role: string;
    initials: string;
}

export const sidebarMenus: SidebarMenu[] = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        route: '/dashboard' 
    },
    {
        title: 'Inventory',
        icon: Boxes,
        badge: 6,
        children: [
            { title: 'Products', icon: Package, route: '/products' },
            { title: 'Categories', icon: Layers, route: '/categories' },
            { title: 'Brands', icon: Tag, route: '/brands' },
            { title: 'Stock In', icon: ArrowDownToLine, route: '/inventory/stock-in' },
            { title: 'Stock Out', icon: ArrowUpFromLine, route: '/inventory/stock-out' },
            { title: 'Inventory History', icon: History, route: '/inventory/history' }
        ]
    },
    {
        title: 'Sales',
        icon: ShoppingCart,
        children: [
            { title: 'Orders', icon: ShoppingBag, route: '/sales/orders' },
            { title: 'Customers', icon: Users, route: '/sales/customers' },
            { title: 'Payments', icon: CreditCard, route: '/sales/payments' },
            { title: 'Invoice', icon: Receipt, route: '/sales/invoice' }
        ]
    },
    {
        title: 'Purchase',
        icon: ClipboardList,
        children: [
            { title: 'Suppliers', icon: Truck, route: '/purchase/suppliers' },
            { title: 'Purchase Orders', icon: ClipboardPlus, route: '/purchase/orders' }
        ]
    },
    {
        title: 'Reports',
        icon: ChartBar,
        children: [
            { title: 'Sales Report', icon: ChartLine, route: '/reports/sales' },
            { title: 'Inventory Report', icon: ChartPie, route: '/reports/inventory' },
            { title: 'Profit Report', icon: Banknote, route: '/reports/profit' }
        ]
    },
    {
        title: 'Management',
        icon: SlidersHorizontal,
        children: [
            { title: 'Users', icon: UserCog, route: '/management/users' },
            { title: 'Roles', icon: ShieldCheck, route: '/management/roles' },
            { title: 'Settings', icon: Settings, route: '/management/settings' }
        ]
    }
];

export const sidebarUser: SidebarUser = {
    name: 'Admin',
    role: 'Administrator',
    initials: 'AD'
};
