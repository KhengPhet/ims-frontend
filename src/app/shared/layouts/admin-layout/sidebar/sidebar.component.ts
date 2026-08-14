import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, X, ChevronDown, LogOut, Boxes } from 'lucide-angular';
import { sidebarMenus, sidebarUser, SidebarMenu } from './sidebar.model';
import { LayoutService } from '../layout.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterModule, LucideAngularModule],
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
    protected readonly menus: SidebarMenu[] = sidebarMenus;
    protected readonly user = sidebarUser;
    protected readonly icons = { close: X, chevron: ChevronDown, logout: LogOut, logo: Boxes };
    protected readonly layout = inject(LayoutService);

    private readonly router = inject(Router);

    toggleSection(menu: SidebarMenu): void {
        menu.expanded = !menu.expanded;
        if (menu.expanded) {
            for (const other of this.menus) {
                if (other !== menu && other.children) {
                    other.expanded = false;
                }
            }
        }
    }

    isParentActive(menu: SidebarMenu): boolean {
        return (
            menu.children?.some((child) =>
                this.router.isActive(child.route ?? '', {
                    paths: 'subset',
                    queryParams: 'ignored',
                    fragment: 'ignored',
                    matrixParams: 'ignored',
                }),
            ) ?? false
        );
    }

    isSectionOpen(menu: SidebarMenu): boolean {
        return (menu.expanded ?? false) || this.isParentActive(menu);
    }

    logout(): void {
        console.log('logout');
    }
}
