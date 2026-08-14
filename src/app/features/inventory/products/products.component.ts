import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  Package,
  CircleCheck,
  TriangleAlert,
  CircleX,
  Download,
  Plus,
  Check,
  X,
  ChevronDown,
  SquarePen,
  Trash2,
  LucideIconData,
} from 'lucide-angular';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import {
  DataTableComponent,
  TableColumn,
} from '../../../shared/components/data-table/data-table.component';
import { TableCellDirective } from '../../../shared/components/data-table/table-cell.directive';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { BadgeVariant } from '../../../shared/components/badge/badge.component';
import { Product, ProductStatus } from '../../../shared/models';
import { ProductService } from './product.service';

interface StatCard {
  title: string;
  value: string;
  icon: LucideIconData;
  iconBg: string;
  iconColor: string;
  note: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
    StatCardComponent,
    ButtonComponent,
    DataTableComponent,
    TableCellDirective,
    ModalComponent,
    BadgeComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProductService);

  readonly products = this.service.items;

  icons = {
    package: Package,
    check: CircleCheck,
    alert: TriangleAlert,
    x: CircleX,
    download: Download,
    plus: Plus,
    save: Check,
    close: X,
    down: ChevronDown,
    edit: SquarePen,
    trash: Trash2,
  };

  stats: StatCard[] = [
    {
      title: 'Total Products',
      value: '1,248',
      icon: Package,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      note: 'items in catalog',
    },
    {
      title: 'Active Items',
      value: '1,190',
      icon: CircleCheck,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      note: 'ready to sell',
    },
    {
      title: 'Low Stock',
      value: '23',
      icon: TriangleAlert,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      note: 'need reorder',
    },
    {
      title: 'Out of Stock',
      value: '8',
      icon: CircleX,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      note: 'unavailable',
    },
  ];

  categories = ['Electronics', 'Stationery', 'Kitchen', 'Furniture'];

  viewItem: Product | null = null;
  editOpen = false;
  editingId: string | null = null;
  deleteTarget: Product | null = null;

  editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    sku: ['', Validators.required],
    category: ['', Validators.required],
    brand: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    reorderLevel: [0, [Validators.min(0)]],
    status: ['In Stock'],
  });

  columns: TableColumn<Product>[] = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true, hide: 'hidden lg:table-cell' },
    { key: 'price', label: 'Price', sortable: true, align: 'right' },
    {
      key: 'quantity',
      label: 'Stock',
      sortable: true,
      align: 'right',
      hide: 'hidden md:table-cell',
    },
    { key: 'status', label: 'Status', badge: (row) => this.statusBadge(row) },
  ];

  filterOptions = ['In Stock', 'Low Stock', 'Out of Stock'];

  currency(value: number): string {
    return '$' + value.toFixed(2);
  }

  statusBadge(item: Product): { label: string; variant: BadgeVariant } {
    if (item.status === 'Out of Stock') return { label: 'Out of Stock', variant: 'red' };
    if (item.status === 'Low Stock') return { label: 'Low Stock', variant: 'amber' };
    return { label: 'In Stock', variant: 'green' };
  }

  stockBar(item: Product): { cls: string; width: string } {
    const pct = Math.min(100, Math.round((item.quantity / (item.reorderLevel * 4)) * 100));
    if (item.quantity === 0) return { cls: 'bg-red-500', width: '0%' };
    if (item.quantity <= item.reorderLevel) return { cls: 'bg-amber-500', width: pct + '%' };
    return { cls: 'bg-emerald-500', width: pct + '%' };
  }

  filterByStatus(row: Product, value: string): boolean {
    return row.status === value;
  }

  get brandOptions(): string[] {
    return [
      ...new Set(
        this.products()
          .map((p) => p.brand)
          .filter(Boolean),
      ),
    ].sort();
  }

  addProduct(): void {
    this.router.navigate(['/products/add']);
  }

  viewProduct(item: Product): void {
    this.viewItem = item;
  }

  closeView(): void {
    this.viewItem = null;
  }

  editFromView(): void {
    if (this.viewItem) {
      this.openEdit(this.viewItem);
    }
  }

  openEdit(item: Product): void {
    this.editForm.patchValue({
      name: item.name,
      sku: item.sku,
      category: item.category,
      brand: item.brand,
      price: item.price,
      quantity: item.quantity,
      reorderLevel: item.reorderLevel,
      status: item.status,
    });
    this.viewItem = null;
    this.editingId = item.id;
    this.editOpen = true;
  }

  closeEdit(): void {
    this.editOpen = false;
    this.editingId = null;
    this.editForm.reset();
  }

  editInvalid(controlName: string): boolean {
    const control = this.editForm.get(controlName);
    return !!control && !!control.errors && (control.touched || control.dirty);
  }

  editError(controlName: string): string {
    const control = this.editForm.get(controlName);
    if (!control || !control.errors || (!control.touched && !control.dirty)) {
      return '';
    }
    const errors = control.errors;
    if (controlName === 'name') {
      if (errors['required']) return 'Product name is required';
      if (errors['minlength']) return 'Product name must be at least 3 characters';
    }
    if (controlName === 'sku') return 'SKU is required';
    if (controlName === 'category') return 'Please select a category';
    if (controlName === 'price') {
      if (errors['required']) return 'Price is required';
      if (errors['min']) return 'Price must be greater than 0';
    }
    if (controlName === 'quantity') {
      if (errors['required']) return 'Stock quantity is required';
      if (errors['min']) return 'Stock quantity cannot be negative';
    }
    if (controlName === 'reorderLevel') return 'Reorder level cannot be negative';
    return 'Invalid value';
  }

  saveEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    if (!this.editingId) {
      return;
    }
    const v = this.editForm.getRawValue();
    this.service.update(this.editingId, {
      name: v.name,
      sku: v.sku,
      category: v.category,
      brand: v.brand,
      price: v.price,
      quantity: v.quantity,
      reorderLevel: v.reorderLevel,
      status: v.status as ProductStatus,
    });
    this.closeEdit();
  }

  deleteProduct(item: Product): void {
    this.deleteTarget = item;
  }

  confirmDelete(): void {
    if (this.deleteTarget) {
      this.service.delete(this.deleteTarget.id);
      this.deleteTarget = null;
    }
  }

  closeDelete(): void {
    this.deleteTarget = null;
  }
}
