export type PaymentMethod = 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Cash' | 'Mobile';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export interface Payment {
    id: string;
    paymentId: string;
    order: string;
    customer: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    date: string;
}
