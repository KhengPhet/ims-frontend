import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { LucideAngularModule, X, LucideIconData } from "lucide-angular";

export type ModalSize = "sm" | "md" | "lg";

@Component({
    selector: "app-modal",
    standalone: true,
    imports: [LucideAngularModule],
    template: `
        @if (open) {
            <div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 backdrop-blur-sm p-4 sm:p-6" (click)="close()">
                <div class="w-full bg-white rounded-2xl shadow-2xl my-8" [class]="sizeClass" (click)="$event.stopPropagation()">
                    <!-- Header -->
                    <div class="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
                        @if (icon) {
                            <span class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 {{ iconBg }}">
                                <lucide-icon [img]="icon" size="22" class="{{ iconColor }}"></lucide-icon>
                            </span>
                        }
                        <div class="min-w-0 flex-1">
                            <h2 class="text-lg font-bold text-gray-800">{{ title }}</h2>
                            @if (subtitle) {
                                <p class="text-xs text-gray-400 mt-0.5">{{ subtitle }}</p>
                            }
                        </div>
                        <button type="button" (click)="close()" aria-label="Close" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                            <lucide-icon [img]="icons.x" size="20"></lucide-icon>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="px-6 py-6">
                        <ng-content></ng-content>
                    </div>

                    <!-- Footer -->
                    @if (showFooter) {
                        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                            <ng-content select="[modalFooter]"></ng-content>
                        </div>
                    }
                </div>
            </div>
        }
    `,
})
export class ModalComponent {
    @Input() open = false;
    @Input() title = "";
    @Input() subtitle?: string;
    @Input() icon?: LucideIconData;
    @Input() iconBg = "bg-blue-100";
    @Input() iconColor = "text-blue-600";
    @Input() size: ModalSize = "md";
    @Input() showFooter = true;
    @Output() closed = new EventEmitter<void>();

    icons = { x: X };

    get sizeClass(): string {
        const map: Record<ModalSize, string> = {
            sm: "max-w-md",
            md: "max-w-xl",
            lg: "max-w-3xl",
        };
        return map[this.size];
    }

    close(): void {
        this.closed.emit();
    }

    @HostListener("document:keydown.escape")
    onEscape(): void {
        if (this.open) this.close();
    }
}
