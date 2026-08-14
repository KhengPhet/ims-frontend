import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { StockInRecord } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class StockInService extends CrudService<StockInRecord> {
    protected override storageKey = 'ims.stockIn';

    protected override seed(): StockInRecord[] {
        return [
            { id: '1', reference: 'IN-2025-0142', type: 'Stock In', product: 'Wireless Mouse MX', sku: 'PRD-1024', supplier: 'Logitech Distribution', quantity: 150, unit: 'pcs', unitCost: 22.5, total: 3375, user: 'Sarah Johnson', date: 'Aug 09, 2026 · 09:41', status: 'Completed', warehouse: 'Main Warehouse', location: 'Aisle B, Rack 3', receivedDate: '2026-08-09', notes: 'PO-2026-0184' },
            { id: '2', reference: 'IN-2025-0141', type: 'Stock In', product: 'Office Chair Ergo', sku: 'PRD-5562', supplier: 'Herman Miller Wholesale', quantity: 50, unit: 'pcs', unitCost: 289, total: 14450, user: 'Sarah Johnson', date: 'Aug 09, 2026 · 08:15', status: 'Completed', warehouse: 'Main Warehouse', location: 'Aisle F, Rack 1', receivedDate: '2026-08-09', notes: 'PO-2026-0179' },
            { id: '3', reference: 'IN-2025-0140', type: 'Stock In', product: 'Desk Lamp LED', sku: 'PRD-6630', supplier: 'Philips Lighting', quantity: 120, unit: 'pcs', unitCost: 38.9, total: 4668, user: 'Sarah Johnson', date: 'Aug 08, 2026 · 16:32', status: 'Completed', warehouse: 'Secondary Warehouse', location: 'Aisle C, Rack 2', receivedDate: '2026-08-08', notes: 'PO-2026-0175' },
            { id: '4', reference: 'IN-2025-0139', type: 'Stock In', product: 'Notebook A5 Grid', sku: 'PRD-7718', supplier: 'Moleskine Partners', quantity: 400, unit: 'pcs', unitCost: 9.2, total: 3680, user: 'Sarah Johnson', date: 'Aug 08, 2026 · 14:05', status: 'Pending', warehouse: 'Secondary Warehouse', location: 'Aisle D, Rack 5', receivedDate: '2026-08-08', notes: 'PO-2026-0170' },
            { id: '5', reference: 'IN-2025-0138', type: 'Stock In', product: 'Bluetooth Speaker', sku: 'PRD-8844', supplier: 'JBL Distributor', quantity: 80, unit: 'pcs', unitCost: 61.4, total: 4912, user: 'Sarah Johnson', date: 'Aug 07, 2026 · 11:20', status: 'Completed', warehouse: 'West Storage', location: 'Aisle A, Rack 4', receivedDate: '2026-08-07', notes: 'PO-2026-0168' },
            { id: '6', reference: 'IN-2025-0137', type: 'Stock In', product: 'HDMI Cable 1.5m', sku: 'PRD-1187', supplier: 'UGREEN Supply Co.', quantity: 300, unit: 'pcs', unitCost: 4.3, total: 1290, user: 'Sarah Johnson', date: 'Aug 07, 2026 · 10:02', status: 'Cancelled', warehouse: 'East Storage', location: 'Aisle E, Rack 6', receivedDate: '2026-08-07', notes: 'Rejected - wrong spec' },
            { id: '7', reference: 'IN-2025-0136', type: 'Stock In', product: 'A4 Paper Ream', sku: 'PRD-3351', supplier: 'Double A Imports', quantity: 500, unit: 'ream', unitCost: 5.6, total: 2800, user: 'Sarah Johnson', date: 'Aug 06, 2026 · 09:48', status: 'Completed', warehouse: 'Main Warehouse', location: 'Aisle A, Rack 1', receivedDate: '2026-08-06', notes: 'PO-2026-0160' },
            { id: '8', reference: 'IN-2025-0135', type: 'Stock In', product: 'Stainless Bottle 1L', sku: 'PRD-4410', supplier: 'Hydro Flask Retail', quantity: 60, unit: 'pcs', unitCost: 18.9, total: 1134, user: 'Sarah Johnson', date: 'Aug 06, 2026 · 08:30', status: 'Pending', warehouse: 'West Storage', location: 'Aisle G, Rack 2', receivedDate: '2026-08-06', notes: 'Awaiting inspection' },
        ];
    }
}
