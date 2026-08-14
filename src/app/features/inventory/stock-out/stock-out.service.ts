import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { StockOutRecord } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class StockOutService extends CrudService<StockOutRecord> {
    protected override storageKey = 'ims.stockOut';

    protected override seed(): StockOutRecord[] {
        return [
            { id: '1', reference: 'OUT-2026-0248', type: 'Stock Out', product: 'Wireless Mouse MX', sku: 'PRD-1024', destination: 'Online Store — Wholesale', quantity: 60, unit: 'pcs', user: 'James Miller', date: 'Aug 09, 2026 · 10:12', status: 'Completed', warehouse: 'Main Warehouse', issuedDate: '2026-08-09', reason: 'SO-2026-0312 dispatch' },
            { id: '2', reference: 'OUT-2026-0247', type: 'Stock Out', product: 'Notebook A5 Grid', sku: 'PRD-7718', destination: 'Retail Shop — Downtown', quantity: 120, unit: 'pcs', user: 'James Miller', date: 'Aug 09, 2026 · 09:03', status: 'Completed', warehouse: 'Main Warehouse', issuedDate: '2026-08-09', reason: 'Store replenishment' },
            { id: '3', reference: 'OUT-2026-0246', type: 'Stock Out', product: 'Bluetooth Speaker', sku: 'PRD-8844', destination: 'Warehouse B — Cross-dock', quantity: 40, unit: 'pcs', user: 'James Miller', date: 'Aug 08, 2026 · 17:45', status: 'Pending', warehouse: 'Secondary Warehouse', issuedDate: '2026-08-08', reason: 'Cross-dock transfer' },
            { id: '4', reference: 'OUT-2026-0245', type: 'Stock Out', product: 'Desk Lamp LED', sku: 'PRD-6630', destination: 'Retail Shop — Mall', quantity: 25, unit: 'pcs', user: 'James Miller', date: 'Aug 08, 2026 · 15:20', status: 'Completed', warehouse: 'Secondary Warehouse', issuedDate: '2026-08-08', reason: 'Store replenishment' },
            { id: '5', reference: 'OUT-2026-0244', type: 'Stock Out', product: 'USB-C Cable 2m', sku: 'PRD-2088', destination: 'Online Store — Wholesale', quantity: 200, unit: 'pcs', user: 'James Miller', date: 'Aug 07, 2026 · 14:08', status: 'Cancelled', warehouse: 'West Storage', issuedDate: '2026-08-07', reason: 'Order cancelled by customer' },
            { id: '6', reference: 'OUT-2026-0243', type: 'Stock Out', product: 'Office Chair Ergo', sku: 'PRD-5562', destination: 'Maintenance — Office fit-out', quantity: 10, unit: 'pcs', user: 'James Miller', date: 'Aug 07, 2026 · 11:35', status: 'Completed', warehouse: 'East Storage', issuedDate: '2026-08-07', reason: 'Office fit-out project' },
            { id: '7', reference: 'OUT-2026-0242', type: 'Stock Out', product: 'A4 Paper Ream', sku: 'PRD-3351', destination: 'Corporate — Operations', quantity: 80, unit: 'ream', user: 'James Miller', date: 'Aug 06, 2026 · 10:51', status: 'Pending', warehouse: 'Main Warehouse', issuedDate: '2026-08-06', reason: 'Operations allocation' },
            { id: '8', reference: 'OUT-2026-0241', type: 'Stock Out', product: 'HDMI Cable 1.5m', sku: 'PRD-1187', destination: 'Retail Shop — Airport', quantity: 150, unit: 'pcs', user: 'James Miller', date: 'Aug 06, 2026 · 09:17', status: 'Completed', warehouse: 'West Storage', issuedDate: '2026-08-06', reason: 'Airport store opening' },
        ];
    }
}
