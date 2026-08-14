import { Component, inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    Barcode,
    BadgeCheck,
    Box,
    ChevronDown,
    ChevronRight,
    CircleAlert,
    ClipboardList,
    DollarSign,
    Eye,
    ImagePlus,
    Layers,
    LoaderCircle,
    MapPin,
    Package,
    Percent,
    Plus,
    RefreshCw,
    Ruler,
    Save,
    Scale,
    Search,
    Sparkles,
    Tags,
    Trash2,
    Truck,
    UserRound,
    Weight,
    X,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { ToggleComponent } from "../../../../shared/components/toggle/toggle.component";
import { AddProduct, Product, ProductStatus, ProductVariant } from "../../../../shared/models";
import { ProductService } from "../product.service";

interface VariantControls {
    name: FormControl<string>;
    sku: FormControl<string>;
    price: FormControl<number>;
    stock: FormControl<number>;
}

@Component({
    selector: "app-add-product",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent, ToggleComponent],
    templateUrl: "./add-product.component.html",
})
export class AddProductComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly productService = inject(ProductService);

    icons = {
        save: Save,
        x: X,
        sparkles: Sparkles,
        refresh: RefreshCw,
        imagePlus: ImagePlus,
        loader: LoaderCircle,
        chevronRight: ChevronRight,
        chevronDown: ChevronDown,
        dollar: DollarSign,
        package: Package,
        box: Box,
        layers: Layers,
        percent: Percent,
        barcode: Barcode,
        supplier: UserRound,
        location: MapPin,
        truck: Truck,
        weight: Weight,
        ruler: Ruler,
        search: Search,
        tags: Tags,
        eye: Eye,
        scale: Scale,
        clipboard: ClipboardList,
        badge: BadgeCheck,
        plus: Plus,
        trash: Trash2,
        alert: CircleAlert,
    };

    categories = ["Electronics", "Furniture", "Stationery", "Clothing", "Food", "Beverage", "Tools"];

    subCategories: Record<string, string[]> = {
        Electronics: ["Mobile Accessories", "Computers", "Audio", "Cables & Adapters", "Components"],
        Furniture: ["Office Chairs", "Desks", "Storage", "Lighting"],
        Stationery: ["Paper", "Writing Supplies", "Organizers"],
        Clothing: ["Shirts", "Pants", "Shoes", "Accessories"],
        Food: ["Snacks", "Dry Goods", "Canned Food"],
        Beverage: ["Soft Drinks", "Juices", "Water", "Coffee & Tea"],
        Tools: ["Hand Tools", "Power Tools", "Hardware"],
    };

    productTypes = ["Simple Product", "Variable Product", "Service"];
    brands = ["Logitech", "Anker", "Philips", "Herman Miller", "Double A", "Moleskine", "Hydro Flask", "JBL", "UGREEN", "Generic"];
    discountTypes = ["No Discount", "Percentage", "Fixed Amount"];
    taxTypes = ["No Tax", "VAT", "GST"];
    units = ["Piece", "Box", "Pack", "Kg", "Liter", "Meter"];
    warehouses = ["Main Warehouse", "Secondary Warehouse", "West Storage", "East Storage"];
    stockStatuses = ["In Stock", "Low Stock", "Out of Stock"];
    visibilities = ["Public", "Private", "Hidden"];
    shippingClasses = ["Standard", "Express", "Overnight", "Freight"];
    suppliers = ["TechMart Supply", "OfficePro Wholesale", "Global Trade Co", "GreenFarm Foods", "Metro Retail"];
    quickVariantNames = ["Small", "Medium", "Large", "Black", "White", "Blue"];

    isSaving = false;
    dragActive = false;
    imagePreview: string | null = null;
    variantsEnabled = false;

    variants = this.fb.array<FormGroup<VariantControls>>([]);

    form = this.fb.nonNullable.group({
        name: ["", [Validators.required, Validators.minLength(3)]],
        sku: ["", Validators.required],
        barcode: [""],
        category: ["", Validators.required],
        subCategory: [""],
        brand: [""],
        productType: ["Simple Product"],
        description: [""],
        shortDescription: [""],
        costPrice: [0, [Validators.min(0)]],
        sellingPrice: [0, [Validators.required, Validators.min(0.01)]],
        discountType: ["No Discount"],
        discountValue: [0, [Validators.min(0)]],
        taxType: ["No Tax"],
        taxRate: [0, [Validators.min(0), Validators.max(100)]],
        stockQuantity: [0, [Validators.required, Validators.min(0)]],
        minimumStock: [0, [Validators.min(0)]],
        maximumStock: [0, [Validators.min(0)]],
        unit: ["Piece"],
        warehouse: [""],
        location: [""],
        stockStatus: ["In Stock"],
        variants: this.variants,
        supplier: [""],
        supplierCode: [""],
        poReference: [""],
        supplierContact: [""],
        supplierEmail: ["", Validators.email],
        weight: [0, [Validators.min(0)]],
        length: [0, [Validators.min(0)]],
        width: [0, [Validators.min(0)]],
        height: [0, [Validators.min(0)]],
        shippingClass: [""],
        fragile: [false],
        metaTitle: [""],
        metaDescription: [""],
        keywords: [""],
        slug: [""],
        status: [true],
        featured: [false],
        allowPurchase: [true],
        allowSale: [true],
        visibility: ["Public"],
        warranty: [""],
        manufactureDate: [""],
        expiryDate: [""],
        serialTracking: [false],
        batchTracking: [false],
        notes: [""],
    });

    get variantControls(): FormGroup<VariantControls>[] {
        return this.variants.controls;
    }

    get subCategoryOptions(): string[] {
        return this.subCategories[this.form.controls.category.value] ?? [];
    }

    get costPrice(): number {
        return this.form.controls.costPrice.value;
    }

    get sellingPrice(): number {
        return this.form.controls.sellingPrice.value;
    }

    get profitMargin(): number {
        return this.sellingPrice - this.costPrice;
    }

    get profitMarginPct(): number {
        if (this.costPrice <= 0) return 0;
        return (this.profitMargin / this.costPrice) * 100;
    }

    get finalPrice(): number {
        const selling = this.sellingPrice;
        const type = this.form.controls.discountType.value;
        const value = this.form.controls.discountValue.value;
        if (type === "Percentage" && value > 0) return selling * (1 - Math.min(value, 100) / 100);
        if (type === "Fixed Amount" && value > 0) return Math.max(0, selling - value);
        return selling;
    }

    isInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return !!control && !!control.errors && (control.touched || control.dirty);
    }

    errorFor(controlName: string): string {
        const control = this.form.get(controlName);
        if (!control || !control.errors || (!control.touched && !control.dirty)) {
            return "";
        }
        const errors = control.errors;
        if (controlName === "name") {
            if (errors["required"]) return "Product name is required";
            if (errors["minlength"]) return "Product name must be at least 3 characters";
        }
        if (controlName === "sku") return "SKU is required";
        if (controlName === "category") return "Please select a category";
        if (controlName === "sellingPrice") {
            if (errors["required"]) return "Selling price is required";
            if (errors["min"]) return "Selling price must be greater than 0";
        }
        if (controlName === "stockQuantity") {
            if (errors["required"]) return "Stock quantity is required";
            if (errors["min"]) return "Stock quantity cannot be negative";
        }
        if (controlName === "costPrice") return "Cost price cannot be negative";
        if (controlName === "minimumStock") return "Minimum stock cannot be negative";
        if (controlName === "maximumStock") return "Maximum stock cannot be negative";
        if (controlName === "discountValue") return "Discount value cannot be negative";
        if (controlName === "taxRate") {
            if (errors["min"]) return "Tax rate must be at least 0";
            if (errors["max"]) return "Tax rate cannot exceed 100";
        }
        if (controlName === "supplierEmail") return "Please enter a valid email address";
        if (["weight", "length", "width", "height"].includes(controlName)) return "Value cannot be negative";
        return "Invalid value";
    }

    inputClass(controlName: string): string {
        return this.isInvalid(controlName) ? "border-red-300 ring-2 ring-red-100" : "border-gray-200";
    }

    generateSKU(): void {
        const name = this.form.controls.name.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
        const rand = Math.floor(1000 + Math.random() * 9000);
        this.form.controls.sku.setValue(`${name || "PRD"}-${rand}`);
    }

    generateBarcode(): void {
        const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
        let sum = 0;
        digits.forEach((d, i) => {
            sum += i % 2 === 0 ? d : d * 3;
        });
        const check = (10 - (sum % 10)) % 10;
        this.form.controls.barcode.setValue([...digits, check].join(""));
    }

    generateSlug(): void {
        const slug = (this.form.controls.name.value || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        this.form.controls.slug.setValue(slug);
    }

    createVariant(): void {
        this.variants.push(this.buildVariantGroup("", ""));
    }

    quickAddVariant(name: string): void {
        const sku = this.variantSKU(name);
        this.variants.push(this.buildVariantGroup(name, sku));
    }

    removeVariant(index: number): void {
        this.variants.removeAt(index);
    }

    onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            this.readImage(file);
        }
        input.value = "";
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.dragActive = false;
        const file = event.dataTransfer?.files?.[0];
        if (file) {
            this.readImage(file);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.dragActive = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.dragActive = false;
    }

    removeImage(): void {
        this.imagePreview = null;
    }

    resetForm(): void {
        this.form.reset({
            name: "",
            sku: "",
            barcode: "",
            category: "",
            subCategory: "",
            brand: "",
            productType: "Simple Product",
            description: "",
            shortDescription: "",
            costPrice: 0,
            sellingPrice: 0,
            discountType: "No Discount",
            discountValue: 0,
            taxType: "No Tax",
            taxRate: 0,
            stockQuantity: 0,
            minimumStock: 0,
            maximumStock: 0,
            unit: "Piece",
            warehouse: "",
            location: "",
            stockStatus: "In Stock",
            supplier: "",
            supplierCode: "",
            poReference: "",
            supplierContact: "",
            supplierEmail: "",
            weight: 0,
            length: 0,
            width: 0,
            height: 0,
            shippingClass: "",
            fragile: false,
            metaTitle: "",
            metaDescription: "",
            keywords: "",
            slug: "",
            status: true,
            featured: false,
            allowPurchase: true,
            allowSale: true,
            visibility: "Public",
            warranty: "",
            manufactureDate: "",
            expiryDate: "",
            serialTracking: false,
            batchTracking: false,
            notes: "",
        });
        this.variants.clear();
        this.variantsEnabled = false;
        this.imagePreview = null;
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;

        const v = this.form.getRawValue();
        const product: AddProduct = {
            name: v.name,
            sku: v.sku,
            barcode: v.barcode,
            category: v.category,
            subCategory: v.subCategory,
            brand: v.brand,
            productType: v.productType,
            description: v.description,
            shortDescription: v.shortDescription,
            image: this.imagePreview ?? "",
            costPrice: v.costPrice,
            sellingPrice: v.sellingPrice,
            discountType: v.discountType,
            discountValue: v.discountValue,
            taxType: v.taxType,
            taxRate: v.taxRate,
            stockQuantity: v.stockQuantity,
            minimumStock: v.minimumStock,
            maximumStock: v.maximumStock,
            unit: v.unit,
            warehouse: v.warehouse,
            location: v.location,
            stockStatus: v.stockStatus,
            variants: v.variants as ProductVariant[],
            supplier: v.supplier,
            supplierCode: v.supplierCode,
            poReference: v.poReference,
            supplierContact: v.supplierContact,
            supplierEmail: v.supplierEmail,
            weight: v.weight,
            length: v.length,
            width: v.width,
            height: v.height,
            shippingClass: v.shippingClass,
            fragile: v.fragile,
            metaTitle: v.metaTitle,
            metaDescription: v.metaDescription,
            keywords: v.keywords,
            slug: v.slug,
            status: v.status,
            featured: v.featured,
            allowPurchase: v.allowPurchase,
            allowSale: v.allowSale,
            visibility: v.visibility,
            warranty: v.warranty,
            manufactureDate: v.manufactureDate,
            expiryDate: v.expiryDate,
            serialTracking: v.serialTracking,
            batchTracking: v.batchTracking,
            notes: v.notes,
        };

        setTimeout(() => {
            this.productService.create(this.toProduct(product));
            this.isSaving = false;
            this.router.navigate(["/products"]);
        }, 1200);
    }

    private toProduct(product: AddProduct): Omit<Product, "id"> {
        return {
            name: product.name,
            sku: product.sku,
            category: product.category,
            brand: product.brand,
            price: product.sellingPrice,
            quantity: product.stockQuantity,
            reorderLevel: product.minimumStock,
            status: this.statusFor(product.stockQuantity, product.minimumStock),
            description: product.shortDescription || product.description || undefined,
        };
    }

    private statusFor(quantity: number, reorderLevel: number): ProductStatus {
        if (quantity === 0) return "Out of Stock";
        if (quantity <= reorderLevel) return "Low Stock";
        return "In Stock";
    }

    onCancel(): void {
        this.router.navigate(["/products"]);
    }

    currency(value: number): string {
        return "$" + value.toFixed(2);
    }

    private buildVariantGroup(name: string, sku: string): FormGroup<VariantControls> {
        return this.fb.nonNullable.group({
            name: [name, Validators.required],
            sku: [sku],
            price: [0, [Validators.min(0)]],
            stock: [0, [Validators.min(0)]],
        });
    }

    private variantSKU(name: string): string {
        const base = this.form.controls.sku.value || "PRD";
        const suffix = name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3);
        return `${base}-${suffix || "VAR"}${Math.floor(100 + Math.random() * 900)}`;
    }

    private readImage(file: File): void {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.type)) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
}
