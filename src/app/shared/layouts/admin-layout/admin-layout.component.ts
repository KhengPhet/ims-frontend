import { Component } from "@angular/core";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./header/header.component";

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, HeaderComponent],
    template: `
        <div class="flex h-screen overflow-hidden bg-gray-100">

            <!-- Sidebar -->
            <app-sidebar></app-sidebar>

            <!-- Main Area -->
            <div class="flex min-w-0 flex-1 flex-col">

                <!-- Fixed Header -->
                <app-header></app-header>

                <!-- Content -->
                <main class="flex-1 overflow-y-auto bg-gray-100">
                    <router-outlet></router-outlet>
                </main>
            </div>
        </div>
    `
})

export class AdminLayoutComponent {

}
