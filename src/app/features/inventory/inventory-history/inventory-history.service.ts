import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { StockTransaction } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class InventoryHistoryService extends CrudService<StockTransaction> {
    protected override storageKey = 'ims.inventoryHistory';

    protected override seed(): StockTransaction[] {
        return [
            { id: '1', reference: 'IN-2026-0142', type: 'Stock In', product: 'Wireless Mouse MX', sku: 'PRD-1024', quantity: 150, user: 'Sarah Johnson', date: 'Aug 09, 2026', status: 'Completed', supplier: 'Logitech Distribution' },
            { id: '2', reference: 'OUT-2026-0247', type: 'Stock Out', product: 'Notebook A5 Grid', sku: 'PRD-7718', quantity: 120, user: 'James Miller', date: 'Aug 09, 2026', status: 'Completed', destination: 'Retail Shop — Downtown' },
            { id: '3', reference: 'ADJ-2026-0088', type: 'Adjustment', product: 'Office Chair Ergo', sku: 'PRD-5562', quantity: 2, user: 'System', date: 'Aug 09, 2026', status: 'Pending' },
            { id: '4', reference: 'IN-2026-0140', type: 'Stock In', product: 'Desk Lamp LED', sku: 'PRD-6630', quantity: 120, user: 'Sarah Johnson', date: 'Aug 08, 2026', status: 'Completed', supplier: 'Philips Lighting' },
            { id: '5', reference: 'OUT-2026-0246', type: 'Stock Out', product: 'Bluetooth Speaker', sku: 'PRD-8844', quantity: 40, user: 'James Miller', date: 'Aug 08, 2026', status: 'Pending', destination: 'Warehouse B — Cross-dock' },
            { id: '6', reference: 'ADJ-2026-0087', type: 'Adjustment', product: 'A4 Paper Ream', sku: 'PRD-3351', quantity: -5, user: 'System', date: 'Aug 08, 2026', status: 'Completed' },
            { id: '7', reference: 'OUT-2026-0244', type: 'Stock Out', product: 'USB-C Cable 2m', sku: 'PRD-2088', quantity: 200, user: 'James Miller', date: 'Aug 07, 2026', status: 'Cancelled', destination: 'Online Store — Wholesale' },
            { id: '8', reference: 'IN-2026-0137', type: 'Stock In', product: 'HDMI Cable 1.5m', sku: 'PRD-1187', quantity: 300, user: 'Sarah Johnson', date: 'Aug 07, 2026', status: 'Completed', supplier: 'UGREEN Supply Co.' },
        ];
    }
}
