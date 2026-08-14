import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LucideAngularModule, UserRound, Building2, Bell, ShieldCheck, SlidersHorizontal, CircleCheck, LucideIconData } from "lucide-angular";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { BadgeComponent } from "../../../shared/components/badge/badge.component";

interface SettingsSection {
    title: string;
    description: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
}

interface ToggleRow {
    key: "emailAlerts" | "lowStock" | "orderUpdates" | "securityAlerts" | "weeklyReports";
    label: string;
    description: string;
}

@Component({
    selector: "app-settings",
    standalone: true,
    imports: [ReactiveFormsModule, LucideAngularModule, ButtonComponent, BadgeComponent],
    templateUrl: "./settings.component.html",
})
export class SettingsComponent {
    private readonly fb = inject(FormBuilder);

    icons = { check: CircleCheck };

    sections: SettingsSection[] = [
        { title: "Profile Settings", description: "Update your name, email and role information.", icon: UserRound, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
        { title: "Company Information", description: "Business name, contact details and tax info.", icon: Building2, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
        { title: "Notification Settings", description: "Choose what alerts you receive by email.", icon: Bell, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
        { title: "Security", description: "Two-factor authentication and password policies.", icon: ShieldCheck, iconBg: "bg-violet-100", iconColor: "text-violet-600" },
        { title: "System Preferences", description: "Language, timezone, currency and regional format.", icon: SlidersHorizontal, iconBg: "bg-gray-100", iconColor: "text-gray-600" },
    ];

    toggles: ToggleRow[] = [
        { key: "emailAlerts", label: "Email Alerts", description: "Receive important account notifications by email" },
        { key: "lowStock", label: "Low Stock Alerts", description: "Notify me when an item reaches its reorder level" },
        { key: "orderUpdates", label: "Order Updates", description: "Get notified on order status changes" },
        { key: "securityAlerts", label: "Security Alerts", description: "Warn about sign-in activity and password changes" },
        { key: "weeklyReports", label: "Weekly Reports", description: "Receive a summary report every Monday" },
    ];

    profileForm = this.fb.nonNullable.group({
        fullName: ["Alice Nguyen", [Validators.required, Validators.minLength(2)]],
        email: ["alice@inventory.io", [Validators.required, Validators.email]],
        role: ["Administrator"],
        phone: ["+1 555-0142"],
    });

    companyForm = this.fb.nonNullable.group({
        companyName: ["Inventory Inc.", Validators.required],
        taxId: ["VAT-8842-1092"],
        email: ["billing@inventory.io", [Validators.required, Validators.email]],
        phone: ["+1 555-0100"],
        address: ["742 Evergreen Terrace, Springfield, IL"],
    });

    notificationsForm = this.fb.nonNullable.group({
        emailAlerts: [true],
        lowStock: [true],
        orderUpdates: [true],
        securityAlerts: [true],
        weeklyReports: [false],
    });

    profileInvalid(control: string): boolean {
        const c = this.profileForm.controls[control as keyof typeof this.profileForm.controls];
        return !!c.errors && (c.touched || c.dirty);
    }

    companyInvalid(control: string): boolean {
        const c = this.companyForm.controls[control as keyof typeof this.companyForm.controls];
        return !!c.errors && (c.touched || c.dirty);
    }

    saveProfile(): void {
        console.log("profile saved", this.profileForm.getRawValue());
    }

    saveCompany(): void {
        console.log("company saved", this.companyForm.getRawValue());
    }

    toggle(key: ToggleRow["key"]): void {
        const control = this.notificationsForm.controls[key];
        control.setValue(!control.value);
    }
}
