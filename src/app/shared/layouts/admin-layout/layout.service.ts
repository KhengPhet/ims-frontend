import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
    readonly sidebarOpen = signal(false);
    readonly isDesktop = signal(false);
    private readonly mql: MediaQueryList | null = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null;
    constructor() {
        if (this.mql) {
            this.isDesktop.set(this.mql.matches);
            this.mql.addEventListener('change', (event) => this.isDesktop.set(event.matches));
        }
    }
    toggleSidebar(): void {
        this.sidebarOpen.update((open) => !open);
    }
    closeSidebar(): void {
        this.sidebarOpen.set(false);
    }
}
