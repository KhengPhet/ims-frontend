import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { PurchaseOrder } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class PurchaseOrdersService extends CrudService<PurchaseOrder> {
    protected override storageKey = 'ims.purchaseOrders';

    protected override seed(): PurchaseOrder[] {
        return [
            { id: 'po1', poNumber: 'PO-2481', supplier: 'TechSource Wholesale', items: 5, total: 4350.0, orderDate: 'Aug 09, 2026', expectedDate: 'Aug 19, 2026', status: 'Pending' },
            { id: 'po2', poNumber: 'PO-2480', supplier: 'Northwind Paper Co.', items: 3, total: 1240.0, orderDate: 'Aug 09, 2026', expectedDate: 'Aug 16, 2026', status: 'Approved' },
            { id: 'po3', poNumber: 'PO-2479', supplier: 'Pacific Supply Group', items: 8, total: 8760.0, orderDate: 'Aug 08, 2026', expectedDate: 'Aug 21, 2026', status: 'In Transit' },
            { id: 'po4', poNumber: 'PO-2478', supplier: 'Metro Distribution', items: 2, total: 1890.0, orderDate: 'Aug 08, 2026', expectedDate: 'Aug 18, 2026', status: 'Approved' },
            { id: 'po5', poNumber: 'PO-2477', supplier: 'BlueOak Wholesale', items: 6, total: 3120.5, orderDate: 'Aug 07, 2026', expectedDate: 'Aug 14, 2026', status: 'Received' },
            { id: 'po6', poNumber: 'PO-2476', supplier: 'Zenith Imports', items: 4, total: 2680.0, orderDate: 'Aug 07, 2026', expectedDate: 'Aug 22, 2026', status: 'Cancelled' },
            { id: 'po7', poNumber: 'PO-2475', supplier: 'Summit Office Supplies', items: 7, total: 945.0, orderDate: 'Aug 06, 2026', expectedDate: 'Aug 13, 2026', status: 'In Transit' },
            { id: 'po8', poNumber: 'PO-2474', supplier: 'EcoDistributors', items: 3, total: 1780.0, orderDate: 'Aug 06, 2026', expectedDate: 'Aug 20, 2026', status: 'Pending' },
            { id: 'po9', poNumber: 'PO-2473', supplier: 'Harmony Products', items: 5, total: 2130.0, orderDate: 'Aug 05, 2026', expectedDate: 'Aug 15, 2026', status: 'Approved' },
            { id: 'po10', poNumber: 'PO-2472', supplier: 'TechSource Wholesale', items: 2, total: 640.0, orderDate: 'Aug 05, 2026', expectedDate: 'Aug 12, 2026', status: 'Received' },
        ];
    }
}
