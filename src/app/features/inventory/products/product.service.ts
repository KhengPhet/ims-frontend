import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { Product } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ProductService extends CrudService<Product> {
  protected override storageKey = 'ims.products';

  protected override seed(): Product[] {
    return [
      {
        id: '1',
        name: 'Wireless Mouse MX',
        sku: 'PRD-1024',
        category: 'Electronics',
        brand: 'Logitech',
        price: 39.99,
        quantity: 156,
        reorderLevel: 25,
        status: 'In Stock',
        description:
          'Ergonomic wireless mouse with 2.4GHz connection, silent clicks and up to 18 months of battery life.',
      },
      {
        id: '2',
        name: 'USB-C Cable 2m',
        sku: 'PRD-2088',
        category: 'Electronics',
        brand: 'Anker',
        price: 12.5,
        quantity: 12,
        reorderLevel: 40,
        status: 'Low Stock',
        description:
          'Durable braided USB-C cable supporting fast charging and data transfer up to 480 Mbps.',
      },
      {
        id: '3',
        name: 'A4 Paper Ream',
        sku: 'PRD-3351',
        category: 'Stationery',
        brand: 'Double A',
        price: 8.75,
        quantity: 18,
        reorderLevel: 50,
        status: 'Low Stock',
        description:
          'High-quality A4 copy paper, 80gsm, 500 sheets per ream. Ideal for everyday printing.',
      },
      {
        id: '4',
        name: 'Stainless Bottle 1L',
        sku: 'PRD-4410',
        category: 'Kitchen',
        brand: 'Hydro Flask',
        price: 32.0,
        quantity: 0,
        reorderLevel: 35,
        status: 'Out of Stock',
        description:
          'Double-wall vacuum insulated bottle that keeps drinks cold for 24 hours or hot for 12.',
      },
      {
        id: '5',
        name: 'HDMI Cable 1.5m',
        sku: 'PRD-1187',
        category: 'Electronics',
        brand: 'UGREEN',
        price: 9.9,
        quantity: 9,
        reorderLevel: 30,
        status: 'Low Stock',
        description:
          '4K-ready HDMI cable with gold-plated connectors for reliable audio and video transmission.',
      },
      {
        id: '6',
        name: 'Office Chair Ergo',
        sku: 'PRD-5562',
        category: 'Furniture',
        brand: 'Herman Miller',
        price: 429.0,
        quantity: 34,
        reorderLevel: 10,
        status: 'In Stock',
        description:
          'Ergonomic office chair with adjustable lumbar support, armrests and breathable mesh back.',
      },
      {
        id: '7',
        name: 'Desk Lamp LED',
        sku: 'PRD-6630',
        category: 'Furniture',
        brand: 'Philips',
        price: 54.25,
        quantity: 120,
        reorderLevel: 20,
        status: 'In Stock',
        description:
          'Energy-efficient LED desk lamp with three color temperatures and touch dimming.',
      },
      {
        id: '8',
        name: 'Notebook A5 Grid',
        sku: 'PRD-7718',
        category: 'Stationery',
        brand: 'Moleskine',
        price: 16.9,
        quantity: 240,
        reorderLevel: 60,
        status: 'In Stock',
        description:
          'Classic hardcover A5 notebook with grid ruled pages, ribbon bookmark and elastic closure.',
      },
      {
        id: '9',
        name: 'Bluetooth Speaker',
        sku: 'PRD-8844',
        category: 'Electronics',
        brand: 'JBL',
        price: 89.0,
        quantity: 58,
        reorderLevel: 15,
        status: 'In Stock',
        description:
          'Portable waterproof Bluetooth speaker with 20 hours of playtime and rich bass.',
      },
      {
        id: '10',
        name: 'Stainless Bottle 750ml',
        sku: 'PRD-8823',
        category: 'Kitchen',
        brand: 'Hydro Flask',
        price: 28.0,
        quantity: 64,
        reorderLevel: 25,
        status: 'In Stock',
        description:
          'Vacuum insulated stainless bottle that keeps drinks cold for 24 hours, 750ml capacity.',
      },
      {
        id: '11',
        name: 'Keyboard K380',
        sku: 'PRD-9917',
        category: 'Electronics',
        brand: 'Logitech',
        price: 49.99,
        quantity: 3,
        reorderLevel: 20,
        status: 'Low Stock',
        description:
          'Multi-device Bluetooth keyboard with a compact layout and comfortable quiet typing.',
      },
      {
        id: '12',
        name: 'Monitor 24" IPS',
        sku: 'PRD-2204',
        category: 'Electronics',
        brand: 'Philips',
        price: 189.0,
        quantity: 0,
        reorderLevel: 8,
        status: 'Out of Stock',
        description:
          '24-inch IPS Full HD monitor with slim bezels, flicker-free technology and HDMI input.',
      },
    ];
  }
}
