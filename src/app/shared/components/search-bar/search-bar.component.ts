import { Component, EventEmitter, Input, Output, signal } from "@angular/core";
import { LucideAngularModule, Search, X } from "lucide-angular";

@Component({
    selector: "app-search-bar",
    standalone: true,
    imports: [LucideAngularModule],
    template: `
        <div class="relative">
            <lucide-icon [img]="icons.search" size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></lucide-icon>
            <input
                type="text"
                [placeholder]="placeholder"
                [value]="term()"
                (input)="onInput($event)"
                class="w-full h-11 pl-9 pr-9 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300"
            />
            @if (term()) {
                <button type="button" (click)="clear()" aria-label="Clear search" class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 transition">
                    <lucide-icon [img]="icons.x" size="14"></lucide-icon>
                </button>
            }
        </div>
    `,
})
export class SearchBarComponent {
    @Input() placeholder = "Search...";
    @Input() debounce = 200;
    @Output() search = new EventEmitter<string>();

    icons = { search: Search, x: X };

    protected readonly term = signal("");
    private timer: ReturnType<typeof setTimeout> | undefined;

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.term.set(value);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.search.emit(value), this.debounce);
    }

    clear(): void {
        this.term.set("");
        clearTimeout(this.timer);
        this.search.emit("");
    }
}
