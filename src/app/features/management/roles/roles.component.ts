import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { LucideAngularModule, Plus, ShieldCheck, Settings2, UsersRound, LucideIconData } from "lucide-angular";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { BadgeComponent } from "../../../shared/components/badge/badge.component";
import { Role } from "../../../shared/models";

interface RoleCard {
    role: Role;
    iconBg: string;
    iconColor: string;
}

@Component({
    selector: "app-roles",
    standalone: true,
    imports: [LucideAngularModule, ButtonComponent, BadgeComponent],
    templateUrl: "./roles.component.html",
})
export class RolesComponent {
    private readonly router = inject(Router);

    icons = {
        plus: Plus,
        shield: ShieldCheck,
        settings: Settings2,
        users: UsersRound,
    };

    roles: RoleCard[] = [
        { role: { id: "r1", name: "Administrator", description: "Full system access, including users, roles and global settings.", users: 3, permissions: ["Manage users & roles", "Manage settings", "Full module access", "Delete records"] }, iconBg: "bg-red-100", iconColor: "text-red-600" },
        { role: { id: "r2", name: "Inventory Manager", description: "Manage products, stock movements and inventory adjustments.", users: 5, permissions: ["View & edit products", "Stock in / stock out", "Inventory adjustments", "View reports"] }, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
        { role: { id: "r3", name: "Sales Manager", description: "Manage orders, customers, payments and invoices.", users: 6, permissions: ["View & manage orders", "Manage customers", "Process payments", "Issue invoices"] }, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
        { role: { id: "r4", name: "Purchasing", description: "Create purchase orders and manage supplier relationships.", users: 4, permissions: ["Create & edit POs", "Manage suppliers", "Approve purchase orders", "View stock levels"] }, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
        { role: { id: "r5", name: "Accountant", description: "View financial records, generate reports and export data.", users: 2, permissions: ["View financial data", "Generate reports", "Export data", "Reconcile payments"] }, iconBg: "bg-violet-100", iconColor: "text-violet-600" },
        { role: { id: "r6", name: "Viewer", description: "Read-only access to dashboards and operational reports.", users: 28, permissions: ["View dashboards", "View reports", "Export data"] }, iconBg: "bg-gray-100", iconColor: "text-gray-600" },
    ];

    addRole(): void {
        this.router.navigate(["/management/roles/add"]);
    }

    manageRole(role: Role): void {
        console.log("manage role", role.name);
    }
}
