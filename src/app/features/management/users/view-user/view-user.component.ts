import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
    LucideAngularModule,
    ArrowLeft,
    Building2,
    ChevronRight,
    Mail,
    ShieldCheck,
    SquarePen,
    UserRound,
} from "lucide-angular";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { User, UserStatus } from "../../../../shared/models";
import { UsersService } from "../users.service";

@Component({
    selector: "app-view-user",
    standalone: true,
    imports: [RouterModule, LucideAngularModule, ButtonComponent],
    templateUrl: "./view-user.component.html",
})
export class ViewUserComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(UsersService);

    record: User | null = null;

    icons = {
        back: ArrowLeft,
        chevronRight: ChevronRight,
        user: UserRound,
        mail: Mail,
        role: ShieldCheck,
        building: Building2,
        edit: SquarePen,
    };

    constructor() {
        const id = this.route.snapshot.paramMap.get("id");
        this.record = id ? (this.service.getById(id) ?? null) : null;
        if (!this.record) {
            this.router.navigate(["/management/users"]);
        }
    }

    initials(name: string): string {
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }

    statusClass(status: UserStatus): { wrapper: string; dot: string; label: string } {
        const map: Record<UserStatus, { wrapper: string; dot: string; label: string }> = {
            Active: { wrapper: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500", label: "Active" },
            Pending: { wrapper: "bg-amber-50 text-amber-600", dot: "bg-amber-500", label: "Pending" },
            Inactive: { wrapper: "bg-gray-100 text-gray-500", dot: "bg-gray-400", label: "Inactive" },
        };
        return map[status];
    }

    goBack(): void {
        this.router.navigate(["/management/users"]);
    }

    goEdit(): void {
        if (this.record) {
            this.router.navigate(["/management/users/edit", this.record.id]);
        }
    }
}
