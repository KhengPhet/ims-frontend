export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  quantity: number;
  reorderLevel: number;
  status: ProductStatus;
  image?: string;
  description?: string;
}

export interface ProductVariant {
  id?: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface AddProduct {
  id?: number;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  subCategory: string;
  brand: string;
  productType: string;
  description: string;
  shortDescription: string;
  image?: string;
  costPrice: number;
  sellingPrice: number;
  discountType: string;
  discountValue: number;
  taxType: string;
  taxRate: number;
  stockQuantity: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
  warehouse: string;
  location: string;
  stockStatus: string;
  variants: ProductVariant[];
  supplier: string;
  supplierCode: string;
  poReference: string;
  supplierContact: string;
  supplierEmail: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  shippingClass: string;
  fragile: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  slug: string;
  status: boolean;
  featured: boolean;
  allowPurchase: boolean;
  allowSale: boolean;
  visibility: string;
  warranty: string;
  manufactureDate: string;
  expiryDate: string;
  serialTracking: boolean;
  batchTracking: boolean;
  notes: string;
}
