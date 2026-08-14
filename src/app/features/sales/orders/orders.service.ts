import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { Order } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class OrdersService extends CrudService<Order> {
    protected override storageKey = 'ims.orders';

    protected override seed(): Order[] {
        return [
            { id: 'o1', orderNumber: 'ORD-2048', customer: 'Sarah Johnson', email: 'sarah.johnson@mail.com', date: 'Aug 09, 2026 · 10:42', items: 3, total: 189.5, payment: 'Paid', status: 'Completed' },
            { id: 'o2', orderNumber: 'ORD-2047', customer: 'James Miller', email: 'j.miller@corp.io', date: 'Aug 09, 2026 · 09:18', items: 8, total: 1240.0, payment: 'Paid', status: 'Processing' },
            { id: 'o3', orderNumber: 'ORD-2046', customer: 'Emily Davis', email: 'emily.d@studio.com', date: 'Aug 09, 2026 · 08:05', items: 1, total: 429.0, payment: 'Pending', status: 'Pending' },
            { id: 'o4', orderNumber: 'ORD-2045', customer: 'Michael Brown', email: 'mbrown@builders.co', date: 'Aug 08, 2026 · 16:33', items: 5, total: 342.75, payment: 'Paid', status: 'Completed' },
            { id: 'o5', orderNumber: 'ORD-2044', customer: 'Olivia Wilson', email: 'olivia.w@mail.com', date: 'Aug 08, 2026 · 14:21', items: 2, total: 97.8, payment: 'Refunded', status: 'Refunded' },
            { id: 'o6', orderNumber: 'ORD-2043', customer: 'Daniel Taylor', email: 'd.taylor@tech.io', date: 'Aug 08, 2026 · 11:47', items: 6, total: 685.4, payment: 'Paid', status: 'Processing' },
            { id: 'o7', orderNumber: 'ORD-2042', customer: 'Sophia Martinez', email: 'sophia.m@mail.com', date: 'Aug 07, 2026 · 17:12', items: 4, total: 254.0, payment: 'Pending', status: 'Pending' },
            { id: 'o8', orderNumber: 'ORD-2041', customer: 'Ethan Anderson', email: 'e.anderson@mail.com', date: 'Aug 07, 2026 · 09:56', items: 2, total: 78.5, payment: 'Paid', status: 'Completed' },
            { id: 'o9', orderNumber: 'ORD-2040', customer: 'Ava Rodriguez', email: 'ava.r@mail.com', date: 'Aug 06, 2026 · 13:24', items: 7, total: 912.3, payment: 'Paid', status: 'Completed' },
            { id: 'o10', orderNumber: 'ORD-2039', customer: 'Liam Walker', email: 'liam.w@build.io', date: 'Aug 06, 2026 · 10:15', items: 1, total: 39.99, payment: 'Pending', status: 'Cancelled' },
        ];
    }
}
