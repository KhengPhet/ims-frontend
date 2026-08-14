import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { User } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class UsersService extends CrudService<User> {
    protected override storageKey = 'ims.users';

    protected override seed(): User[] {
        return [
            { id: 'us1', name: 'Alice Nguyen', email: 'alice@inventory.io', role: 'Administrator', department: 'Operations', status: 'Active' },
            { id: 'us2', name: 'Carlos Vega', email: 'carlos@inventory.io', role: 'Inventory Manager', department: 'Warehouse', status: 'Active' },
            { id: 'us3', name: 'Marta Kowal', email: 'marta@inventory.io', role: 'Sales Manager', department: 'Sales', status: 'Active' },
            { id: 'us4', name: 'Devon Carter', email: 'devon@inventory.io', role: 'Purchasing', department: 'Procurement', status: 'Active' },
            { id: 'us5', name: 'Priya Sharma', email: 'priya@inventory.io', role: 'Accountant', department: 'Finance', status: 'Pending' },
            { id: 'us6', name: 'Tom Becker', email: 'tom@inventory.io', role: 'Inventory Manager', department: 'Warehouse', status: 'Active' },
            { id: 'us7', name: 'Lena Fischer', email: 'lena@inventory.io', role: 'Viewer', department: 'Marketing', status: 'Inactive' },
            { id: 'us8', name: 'Omar Farouk', email: 'omar@inventory.io', role: 'Purchasing', department: 'Procurement', status: 'Active' },
            { id: 'us9', name: 'Emma Lewis', email: 'emma@inventory.io', role: 'Sales Manager', department: 'Sales', status: 'Active' },
            { id: 'us10', name: 'Jonas Weber', email: 'jonas@inventory.io', role: 'Viewer', department: 'Finance', status: 'Pending' },
        ];
    }
}
