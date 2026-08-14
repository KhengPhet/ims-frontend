import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { Supplier } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class SuppliersService extends CrudService<Supplier> {
    protected override storageKey = 'ims.suppliers';

    protected override seed(): Supplier[] {
        return [
            { id: 's1', name: 'TechSource Wholesale', contact: 'Robert Lee', email: 'sales@techsource.io', location: 'Austin, USA', categories: 'Electronics, Accessories', orders: 87, status: 'Active' },
            { id: 's2', name: 'Northwind Paper Co.', contact: 'Helen Cooper', email: 'orders@northwindpaper.com', location: 'Chicago, USA', categories: 'Stationery', orders: 54, status: 'Active' },
            { id: 's3', name: 'Pacific Supply Group', contact: 'Kenji Tanaka', email: 'contact@pacificsg.com', location: 'Los Angeles, USA', categories: 'Electronics', orders: 61, status: 'Active' },
            { id: 's4', name: 'Metro Distribution', contact: 'Anna Petrova', email: 'info@metrodist.eu', location: 'Berlin, Germany', categories: 'Office, Furniture', orders: 39, status: 'Active' },
            { id: 's5', name: 'Meridian Traders', contact: 'Omar Haddad', email: 'hello@meridiantrade.com', location: 'Dubai, UAE', categories: 'Various', orders: 22, status: 'Inactive' },
            { id: 's6', name: 'BlueOak Wholesale', contact: 'Grace Kim', email: 'sales@blueoak.co', location: 'Seattle, USA', categories: 'Office, Stationery', orders: 48, status: 'Active' },
            { id: 's7', name: 'Zenith Imports', contact: 'Luis Garcia', email: 'support@zenithimports.com', location: 'Madrid, Spain', categories: 'Electronics, Accessories', orders: 31, status: 'Inactive' },
            { id: 's8', name: 'Harmony Products', contact: 'Nina Kowalski', email: 'nina@harmonyprod.pl', location: 'Warsaw, Poland', categories: 'Office', orders: 17, status: 'Active' },
            { id: 's9', name: 'Summit Office Supplies', contact: 'Jack Turner', email: 'jack@summitoffice.com', location: 'Denver, USA', categories: 'Stationery', orders: 44, status: 'Active' },
            { id: 's10', name: 'EcoDistributors', contact: 'Mia Chen', email: 'mia@ecodist.com', location: 'Portland, USA', categories: 'Office, Furniture', orders: 26, status: 'Active' },
        ];
    }
}
