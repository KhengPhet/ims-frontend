export type CustomerStatus = 'Active' | 'Inactive' | 'New';

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    orders: number;
    totalSpent: number;
    status: CustomerStatus;
}

export interface CustomerEntry {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    taxId: string;
    notes: string;
    status: CustomerStatus;
    sendWelcome: boolean;
}
