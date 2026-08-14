import {
    LucideIconData,
    PackageCheck,
    TriangleAlert,
    ShoppingBag,
    CircleUser,
    Settings,
    KeyRound,
    LogOut,
} from 'lucide-angular';

export interface HeaderUser {
    name: string;
    role: string;
    avatar: string;
    initials: string;
}

export interface NotificationItem {
    id: number;
    title: string;
    description: string;
    time: string;
    icon: LucideIconData;
    iconClasses: string;
    unread: boolean;
}

export interface ProfileMenuItem {
    id: string;
    label: string;
    icon: LucideIconData;
    route?: string;
    danger?: boolean;
}

export interface BreadcrumbItem {
    label: string;
    route?: string;
}

export const headerUser: HeaderUser = {
    name: 'Admin',
    role: 'Administrator',
    avatar: 'https://i.pravatar.cc/96',
    initials: 'AD',
};

export const notificationSeed: NotificationItem[] = [
    {
        id: 1,
        title: 'New stock received',
        description: '150 units of "Wireless Mouse" added to Warehouse A',
        time: '2 min ago',
        icon: PackageCheck,
        iconClasses: 'bg-emerald-500/10 text-emerald-500',
        unread: true,
    },
    {
        id: 2,
        title: 'Low inventory alert',
        description: '"USB-C Cable" is running low (12 left, min 20)',
        time: '1 hr ago',
        icon: TriangleAlert,
        iconClasses: 'bg-amber-500/10 text-amber-500',
        unread: true,
    },
    {
        id: 3,
        title: 'New order created',
        description: 'Order #INV-2048 by John Carter — $1,240.00',
        time: '3 hrs ago',
        icon: ShoppingBag,
        iconClasses: 'bg-blue-500/10 text-blue-600',
        unread: true,
    },
];

export const profileMenuItems: ProfileMenuItem[] = [
    { id: 'profile', label: 'Profile', icon: CircleUser, route: '/profile' },
    { id: 'settings', label: 'Account Settings', icon: Settings, route: '/settings' },
    { id: 'password', label: 'Change Password', icon: KeyRound, route: '/change-password' },
    { id: 'logout', label: 'Logout', icon: LogOut, danger: true },
];
