import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { Customer } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class CustomersService extends CrudService<Customer> {
    protected override storageKey = 'ims.customers';

    protected override seed(): Customer[] {
        return [
            { id: 'u1', name: 'Sarah Johnson', email: 'sarah.johnson@mail.com', phone: '+1 555-0142', orders: 24, totalSpent: 4380, status: 'Active' },
            { id: 'u2', name: 'James Miller', email: 'j.miller@corp.io', phone: '+1 555-0178', orders: 41, totalSpent: 9820, status: 'Active' },
            { id: 'u3', name: 'Emily Davis', email: 'emily.d@studio.com', phone: '+1 555-0156', orders: 3, totalSpent: 620, status: 'New' },
            { id: 'u4', name: 'Michael Brown', email: 'mbrown@builders.co', phone: '+1 555-0193', orders: 12, totalSpent: 2740, status: 'Active' },
            { id: 'u5', name: 'Olivia Wilson', email: 'olivia.w@mail.com', phone: '+1 555-0117', orders: 1, totalSpent: 97, status: 'New' },
            { id: 'u6', name: 'Daniel Taylor', email: 'd.taylor@tech.io', phone: '+1 555-0164', orders: 28, totalSpent: 6720, status: 'Active' },
            { id: 'u7', name: 'Sophia Martinez', email: 'sophia.m@mail.com', phone: '+1 555-0139', orders: 6, totalSpent: 1150, status: 'Inactive' },
            { id: 'u8', name: 'Ethan Anderson', email: 'e.anderson@mail.com', phone: '+1 555-0185', orders: 15, totalSpent: 3480, status: 'Active' },
            { id: 'u9', name: 'Ava Rodriguez', email: 'ava.r@mail.com', phone: '+1 555-0128', orders: 9, totalSpent: 2130, status: 'Inactive' },
            { id: 'u10', name: 'Liam Walker', email: 'liam.w@build.io', phone: '+1 555-0199', orders: 2, totalSpent: 84, status: 'New' },
        ];
    }
}
