export type OrderStatus = 'Completed' | 'Processing' | 'Pending' | 'Refunded' | 'Cancelled';

export interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    email: string;
    date: string;
    items: number;
    total: number;
    payment: string;
    status: OrderStatus;
}

export interface OrderItem {
    id?: number;
    product: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface OrderEntry {
    orderNumber: string;
    customer: string;
    email: string;
    orderDate: string;
    status: OrderStatus;
    payment: string;
    items: OrderItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    shipping: number;
    grandTotal: number;
    notes: string;
}
