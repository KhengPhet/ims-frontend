import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LucideAngularModule, Plus, Download, Globe, Package, Award, Check, SquarePen, LucideIconData } from "lucide-angular";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DataTableComponent, TableColumn } from "../../../shared/components/data-table/data-table.component";
import { TableCellDirective } from "../../../shared/components/data-table/table-cell.directive";
import { BadgeVariant, BadgeComponent } from "../../../shared/components/badge/badge.component";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { ToggleComponent } from "../../../shared/components/toggle/toggle.component";
import { Brand } from "../../../shared/models";

@Component({
    selector: "app-brands",
    standalone: true,
    imports: [LucideAngularModule, ReactiveFormsModule, ButtonComponent, DataTableComponent, TableCellDirective, ModalComponent, ToggleComponent, BadgeComponent],
    templateUrl: "./brands.component.html",
})
export class BrandsComponent {
    private readonly fb = inject(FormBuilder);

    icons = {
        plus: Plus,
        download: Download,
        globe: Globe,
        package: Package,
        award: Award,
        check: Check,
        edit: SquarePen,
    };

    brands: Brand[] = [
        { id: "b1", name: "Logitech", origin: "Switzerland", products: 84, active: true },
        { id: "b2", name: "Anker", origin: "China", products: 62, active: true },
        { id: "b3", name: "Herman Miller", origin: "USA", products: 27, active: true },
        { id: "b4", name: "Philips", origin: "Netherlands", products: 51, active: true },
        { id: "b5", name: "Double A", origin: "Thailand", products: 14, active: true },
        { id: "b6", name: "Moleskine", origin: "Italy", products: 38, active: true },
        { id: "b7", name: "Hydro Flask", origin: "USA", products: 19, active: false },
        { id: "b8", name: "JBL", origin: "USA", products: 45, active: true },
        { id: "b9", name: "UGREEN", origin: "China", products: 33, active: true },
        { id: "b10", name: "Nestlé", origin: "Switzerland", products: 22, active: false },
    ];

    columns: TableColumn<Brand>[] = [
        { key: "name", label: "Brand", sortable: true, initials: (row) => this.initials(row.name) },
        { key: "origin", label: "Origin", hide: "hidden md:table-cell" },
        { key: "products", label: "Products", align: "right", sortable: true },
        { key: "status", label: "Status", badge: (row) => this.statusBadge(row.active) },
    ];

    modalOpen = false;
    viewModalOpen = false;
    editingBrand: Brand | null = null;
    viewedBrand: Brand | null = null;

    get modalTitle(): string {
        return this.editingBrand ? "Edit Brand" : "Add Brand";
    }

    get modalSubtitle(): string {
        return this.editingBrand ? "Update the details of this brand" : "Create a new brand for your products";
    }

    get submitLabel(): string {
        return this.editingBrand ? "Save Changes" : "Create Brand";
    }

    form = this.fb.nonNullable.group({
        name: ["", [Validators.required, Validators.minLength(2)]],
        origin: [""],
        active: [true],
    });

    initials(name: string): string {
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }

    statusBadge(active: boolean): { label: string; variant: BadgeVariant } {
        return active ? { label: "Active", variant: "green" } : { label: "Inactive", variant: "gray" };
    }

    get activeCount(): number {
        return this.brands.filter((b) => b.active).length;
    }

    isInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return !!control && !!control.errors && (control.touched || control.dirty);
    }

    addBrand(): void {
        this.editingBrand = null;
        this.form.reset({ name: "", origin: "", active: true });
        this.modalOpen = true;
    }

    viewBrand(brand: Brand): void {
        this.viewedBrand = brand;
        this.viewModalOpen = true;
    }

    closeViewModal(): void {
        this.viewModalOpen = false;
        this.viewedBrand = null;
    }

    editBrand(brand: Brand): void {
        this.editingBrand = brand;
        this.form.setValue({ name: brand.name, origin: brand.origin, active: brand.active });
        this.modalOpen = true;
    }

    deleteBrand(brand: Brand): void {
        this.brands = this.brands.filter((b) => b.id !== brand.id);
    }

    closeModal(): void {
        this.modalOpen = false;
        this.editingBrand = null;
        this.form.reset({ name: "", origin: "", active: true });
    }

    saveBrand(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const value = this.form.getRawValue();
        if (this.editingBrand) {
            this.brands = this.brands.map((b) =>
                b.id === this.editingBrand!.id ? { ...b, name: value.name, origin: value.origin || "Unknown", active: value.active } : b,
            );
        } else {
            this.brands = [
                { id: "b" + (this.brands.length + 1), name: value.name, origin: value.origin || "Unknown", products: 0, active: value.active },
                ...this.brands,
            ];
        }
        this.closeModal();
    }
}
