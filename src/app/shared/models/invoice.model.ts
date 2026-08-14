export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

export interface Invoice {
    id: string;
    invoiceNumber: string;
    customer: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: InvoiceStatus;
}

export interface InvoiceItem {
    id?: number;
    product: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface InvoiceEntry {
    invoiceNumber: string;
    customer: string;
    email: string;
    issueDate: string;
    dueDate: string;
    paymentTerms: string;
    status: InvoiceStatus;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    grandTotal: number;
    notes: string;
}
