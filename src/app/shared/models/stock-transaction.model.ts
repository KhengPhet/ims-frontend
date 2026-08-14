export type TransactionType = 'Stock In' | 'Stock Out' | 'Adjustment';
export type TransactionStatus = 'Completed' | 'Pending' | 'Cancelled';

export interface StockTransaction {
    id: string;
    reference: string;
    type: TransactionType;
    product: string;
    sku: string;
    quantity: number;
    supplier?: string;
    destination?: string;
    user: string;
    date: string;
    status: TransactionStatus;
}

export interface SelectableProduct {
    name: string;
    sku: string;
    unit: string;
    price: number;
    stock: number;
}

export interface StockInRecord extends StockTransaction {
    unitCost: number;
    total: number;
    unit: string;
    warehouse?: string;
    location?: string;
    receivedDate?: string;
    notes?: string;
}

export interface StockInEntry {
    reference: string;
    product: string;
    sku: string;
    quantity: number;
    unit: string;
    unitCost: number;
    total: number;
    supplier: string;
    warehouse: string;
    location: string;
    receivedDate: string;
    notes: string;
    status: TransactionStatus;
}

export interface StockOutRecord extends StockTransaction {
    unit: string;
    warehouse?: string;
    issuedDate?: string;
    reason?: string;
}

export interface StockOutEntry {
    reference: string;
    product: string;
    sku: string;
    quantity: number;
    unit: string;
    destination: string;
    warehouse: string;
    issuedDate: string;
    reason: string;
    status: TransactionStatus;
}
