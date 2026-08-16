import { Component, inject, signal } from "@angular/core";
import { afterNextRender } from "@angular/core";
import { Router } from "@angular/router";
import { LucideAngularModule, Menu, Search, UserRound, Settings, LogOut, CircleQuestionMark } from "lucide-angular";
import { DropdownComponent, DropdownItem } from "../../../components/dropdown/dropdown.component";
import { NotificationsComponent } from "../../../components/notifications/notifications.component";
import { AuthService } from "../../../../features/auth/auth.service";
import { User } from "../../../../core/models/user.model";
import { resolveImageUrl } from "../../../../core/utils/image-url.util";
import { LayoutService } from "../layout.service";

@Component({
    selector: "app-header",
    standalone: true,
    templateUrl: "./header.component.html",
    imports: [LucideAngularModule, DropdownComponent, NotificationsComponent],
})
export class HeaderComponent {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    protected readonly layout = inject(LayoutService);

    icons = { search: Search, menu: Menu };

    readonly user = signal<User | null>(null);

    constructor() {
        afterNextRender(() => {
            this.user.set(this.authService.getUser());
        });
    }

    get displayName(): string {
        return this.user()?.username ?? "User";
    }

    get roleLabel(): string {
        const role = this.user()?.role ?? "user";
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    get avatar(): string {
        return resolveImageUrl(this.user()?.image, "https://i.pravatar.cc/100");
    }

    menuItems: DropdownItem[] = [
        { label: "My Profile", icon: UserRound },
        { label: "Help Center", icon: CircleQuestionMark },
        { label: "Settings", icon: Settings },
        { label: "Sign Out", icon: LogOut, danger: true },
    ];

    onMenuSelect(item: DropdownItem): void {
        if (item.label === "My Profile") {
            this.router.navigate(["/profile"]);
        }
        if (item.label === "Settings") {
            this.router.navigate(["/management/settings"]);
        }
        if (item.label === "Sign Out") {
            this.authService.logout();
        }
    }
}
