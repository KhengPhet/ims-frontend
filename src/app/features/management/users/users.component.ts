import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    LucideAngularModule,
    Plus,
    Download,
    Users,
    UserCheck,
    UserPlus,
    ShieldCheck,
    Building2,
    Mail,
    TriangleAlert,
    Trash2,
    LucideIconData,
} from "lucide-angular";
import { StatCardComponent } from "../../../shared/components/stat-card/stat-card.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DataTableComponent, TableColumn } from "../../../shared/components/data-table/data-table.component";
import { TableCellDirective } from "../../../shared/components/data-table/table-cell.directive";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { BadgeVariant } from "../../../shared/components/badge/badge.component";
import { User, UserStatus } from "../../../shared/models";
import { UsersService } from "./users.service";

interface StatCard {
    title: string;
    value: string;
    icon: LucideIconData;
    iconBg: string;
    iconColor: string;
    note: string;
}

@Component({
    selector: "app-users",
    standalone: true,
    imports: [LucideAngularModule, StatCardComponent, ButtonComponent, DataTableComponent, TableCellDirective, ModalComponent],
    templateUrl: "./users.component.html",
})
export class UsersComponent {
    private readonly router = inject(Router);
    private readonly service = inject(UsersService);

    readonly users = this.service.items;

    icons = {
        plus: Plus,
        download: Download,
        users: Users,
        userCheck: UserCheck,
        userPlus: UserPlus,
        shield: ShieldCheck,
        building: Building2,
        mail: Mail,
        alert: TriangleAlert,
        trash: Trash2,
    };

    deleteTarget: User | null = null;

    stats: StatCard[] = [
        { title: "Total Users", value: "48", icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600", note: "all accounts" },
        { title: "Active Users", value: "41", icon: UserCheck, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", note: "logged in this month" },
        { title: "Pending Invites", value: "4", icon: UserPlus, iconBg: "bg-amber-100", iconColor: "text-amber-600", note: "awaiting response" },
        { title: "Admin Roles", value: "3", icon: ShieldCheck, iconBg: "bg-violet-100", iconColor: "text-violet-600", note: "full access" },
    ];

    columns: TableColumn<User>[] = [
        { key: "name", label: "User", sortable: true, initials: (row) => this.initials(row.name) },
        { key: "email", label: "Email", hide: "hidden lg:table-cell" },
        { key: "role", label: "Role" },
        { key: "department", label: "Department", hide: "hidden md:table-cell" },
        { key: "status", label: "Status", badge: (row) => this.statusBadge(row.status) },
    ];

    filterOptions = ["Active", "Pending", "Inactive"];

    initials(name: string): string {
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }

    statusBadge(status: UserStatus): { label: string; variant: BadgeVariant } {
        if (status === "Active") return { label: "Active", variant: "green" };
        if (status === "Pending") return { label: "Pending", variant: "amber" };
        return { label: "Inactive", variant: "gray" };
    }

    filterByStatus(row: User, value: string): boolean {
        return row.status === value;
    }

    inviteUser(): void {
        this.router.navigate(["/management/users/add"]);
    }

    viewUser(user: User): void {
        this.router.navigate(["/management/users/view", user.id]);
    }

    editUser(user: User): void {
        this.router.navigate(["/management/users/edit", user.id]);
    }

    deleteUser(user: User): void {
        this.deleteTarget = user;
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
