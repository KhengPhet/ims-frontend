export type PurchaseOrderStatus = 'Pending' | 'Approved' | 'In Transit' | 'Received' | 'Cancelled';

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    supplier: string;
    items: number;
    total: number;
    orderDate: string;
    expectedDate: string;
    status: PurchaseOrderStatus;
}

export interface PurchaseOrderItem {
    product: string;
    sku: string;
    quantity: number;
    unitCost: number;
    total: number;
}

export interface PurchaseOrderEntry {
    poNumber: string;
    supplier: string;
    supplierContact: string;
    supplierEmail: string;
    orderDate: string;
    expectedDate: string;
    status: PurchaseOrderStatus;
    paymentTerms: string;
    items: PurchaseOrderItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    shipping: number;
    grandTotal: number;
    notes: string;
}
