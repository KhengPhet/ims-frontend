export type SupplierStatus = 'Active' | 'Inactive';

export interface Supplier {
    id: string;
    name: string;
    contact: string;
    email: string;
    location: string;
    categories: string;
    orders: number;
    status: SupplierStatus;
}

export interface SupplierEntry {
    name: string;
    contact: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    taxId: string;
    categories: string;
    leadTime: number;
    paymentTerms: string;
    notes: string;
    status: SupplierStatus;
}
