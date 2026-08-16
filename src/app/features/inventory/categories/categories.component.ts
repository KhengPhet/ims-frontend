import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import {
    LucideAngularModule,
    Plus,
    Layers,
    Boxes,
    Package,
    Tag,
    X,
    Cpu,
    Armchair,
    FileText,
    Shirt,
    Wrench,
    ShoppingBasket,
    Grid3x3,
    Check,
    Trash2,
    SquarePen,
    LucideIconData,
} from "lucide-angular";
import { StatCardComponent } from "../../../shared/components/stat-card/stat-card.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { BadgeComponent } from "../../../shared/components/badge/badge.component";
import { Category } from "../../../shared/models";

interface StatCard {
    title: string;
    value: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    note: string;
}

interface CategoryMeta {
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    bar: string;
}

@Component({
    selector: "app-categories",
    standalone: true,
    imports: [LucideAngularModule, ReactiveFormsModule, StatCardComponent, ButtonComponent, ModalComponent, BadgeComponent],
    templateUrl: "./categories.component.html",
})
export class CategoriesComponent {
    private readonly fb = inject(FormBuilder);

    icons = {
        plus: Plus,
        tag: Tag,
        check: Check,
        trash: Trash2,
        edit: SquarePen,
        x: X,
    };

    stats: StatCard[] = [
        { title: "Total Categories", value: "8", icon: Layers, iconBg: "bg-blue-100", iconColor: "text-blue-600", note: "active categories" },
        { title: "Products Organized", value: "1,248", icon: Package, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", note: "catalogued items" },
        { title: "Total Stock Value", value: "$184,250", icon: Boxes, iconBg: "bg-amber-100", iconColor: "text-amber-600", note: "in inventory" },
    ];

    categories: Category[] = [
        { id: "c1", name: "Electronics", description: "Devices, peripherals and accessories", products: 342, totalUnits: 12400, stockValue: 84200, percent: 84, active: true },
        { id: "c2", name: "Furniture", description: "Office and warehouse furniture", products: 96, totalUnits: 2400, stockValue: 51200, percent: 62, active: true },
        { id: "c3", name: "Stationery", description: "Paper, notebooks and office supplies", products: 214, totalUnits: 8900, stockValue: 18300, percent: 45, active: true },
        { id: "c4", name: "Apparel", description: "Uniforms, clothing and textile items", products: 158, totalUnits: 5200, stockValue: 12400, percent: 58, active: true },
        { id: "c5", name: "Tools", description: "Hand tools, power tools and hardware", products: 187, totalUnits: 6100, stockValue: 22900, percent: 38, active: true },
        { id: "c6", name: "Food & Beverage", description: "Perishables and packaged goods", products: 251, totalUnits: 15800, stockValue: 26500, percent: 73, active: true },
        { id: "c7", name: "Kitchen", description: "Cooking and dining equipment", products: 143, totalUnits: 6800, stockValue: 17400, percent: 51, active: true },
        { id: "c8", name: "Accessories", description: "Phone cases, cables and misc items", products: 97, totalUnits: 4600, stockValue: 9800, percent: 40, active: false },
    ];

    meta: Record<string, CategoryMeta> = {
        Electronics: { icon: Cpu, iconBg: "bg-blue-100", iconColor: "text-blue-600", bar: "bg-blue-500" },
        Furniture: { icon: Armchair, iconBg: "bg-violet-100", iconColor: "text-violet-600", bar: "bg-violet-500" },
        Stationery: { icon: FileText, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", bar: "bg-emerald-500" },
        Apparel: { icon: Shirt, iconBg: "bg-amber-100", iconColor: "text-amber-600", bar: "bg-amber-500" },
        Tools: { icon: Wrench, iconBg: "bg-slate-100", iconColor: "text-slate-600", bar: "bg-slate-500" },
        "Food & Beverage": { icon: ShoppingBasket, iconBg: "bg-rose-100", iconColor: "text-rose-600", bar: "bg-rose-500" },
        Kitchen: { icon: Armchair, iconBg: "bg-cyan-100", iconColor: "text-cyan-600", bar: "bg-cyan-500" },
        Accessories: { icon: Grid3x3, iconBg: "bg-indigo-100", iconColor: "text-indigo-600", bar: "bg-indigo-500" },
    };

    modalOpen = false;
    editingCategory: Category | null = null;
    deleteTarget: Category | null = null;

    get modalTitle(): string {
        return this.editingCategory ? "Edit Category" : "Add Category";
    }

    get modalSubtitle(): string {
        return this.editingCategory ? "Update the details of this category" : "Create a new category to organize products";
    }

    get submitLabel(): string {
        return this.editingCategory ? "Save Changes" : "Create Category";
    }

    form = this.fb.nonNullable.group({
        name: ["", [Validators.required, Validators.minLength(2)]],
        description: [""],
    });

    metaFor(name: string): CategoryMeta {
        return this.meta[name] ?? { icon: Package, iconBg: "bg-gray-100", iconColor: "text-gray-600", bar: "bg-gray-400" };
    }

    currency(value: number): string {
        return "$" + value.toLocaleString();
    }

    isInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return !!control && !!control.errors && (control.touched || control.dirty);
    }

    openModal(): void {
        this.editingCategory = null;
        this.form.reset();
        this.modalOpen = true;
    }

    openEditModal(category: Category): void {
        this.editingCategory = category;
        this.form.setValue({ name: category.name, description: category.description });
        this.modalOpen = true;
    }

    closeModal(): void {
        this.modalOpen = false;
        this.editingCategory = null;
        this.form.reset();
    }

    saveCategory(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const value = this.form.getRawValue();
        if (this.editingCategory) {
            this.categories = this.categories.map((c) =>
                c.id === this.editingCategory!.id ? { ...c, name: value.name, description: value.description } : c,
            );
        } else {
            this.categories = [
                { id: "c" + (this.categories.length + 1), name: value.name, description: value.description || "Newly added category", products: 0, totalUnits: 0, stockValue: 0, percent: 0, active: true },
                ...this.categories,
            ];
        }
        this.closeModal();
    }

    deleteCategory(category: Category): void {
        this.deleteTarget = category;
    }

    closeDelete(): void {
        this.deleteTarget = null;
    }

    confirmDelete(): void {
        if (!this.deleteTarget) {
            return;
        }

        this.categories = this.categories.filter(
            (category) => category.id !== this.deleteTarget!.id
        );

        this.closeDelete();
    }
}
