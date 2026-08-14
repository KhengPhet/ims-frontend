import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output } from "@angular/core";
import { LucideAngularModule, LucideIconData } from "lucide-angular";

export interface DropdownItem {
    label: string;
    icon?: LucideIconData;
    danger?: boolean;
}

@Component({
    selector: "app-dropdown",
    standalone: true,
    imports: [LucideAngularModule],
    host: { class: "relative inline-block" },
    template: `
        <div (click)="toggle()">
            <ng-content select="[dropdownTrigger]"></ng-content>
        </div>
        @if (open) {
            <div class="absolute z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden py-1.5" [class.right-0]="align === 'right'" [class.left-0]="align === 'left'">
                @for (item of items; track item.label) {
                    <button
                        type="button"
                        (click)="select(item)"
                        class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition hover:bg-gray-50"
                        [class]="item.danger ? 'text-red-600' : 'text-gray-700'">
                        @if (item.icon) {
                            <lucide-icon [img]="item.icon" size="15" class="text-gray-400"></lucide-icon>
                        }
                        {{ item.label }}
                    </button>
                }
            </div>
        }
    `,
})
export class DropdownComponent {
    @Input() items: DropdownItem[] = [];
    @Input() align: "left" | "right" = "right";
    @Output() selected = new EventEmitter<DropdownItem>();

    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

    protected open = false;

    toggle(): void {
        this.open = !this.open;
    }

    select(item: DropdownItem): void {
        this.open = false;
        this.selected.emit(item);
    }

    @HostListener("document:click", ["$event"])
    onDocumentClick(event: Event): void {
        if (!this.host.nativeElement.contains(event.target as Node)) {
            this.open = false;
        }
    }
}
