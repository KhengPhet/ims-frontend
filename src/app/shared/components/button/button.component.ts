import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LucideAngularModule, LoaderCircle, LucideIconData } from "lucide-angular";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

@Component({
    selector: "app-button",
    standalone: true,
    imports: [LucideAngularModule],
    template: `
        <button
            [type]="type"
            [disabled]="disabled || loading"
            (click)="clicked.emit($event)"
            class="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            [class.w-full]="fullWidth"
            [class]="variantClass + ' ' + sizeClass"
        >
            @if (loading) {
                <lucide-icon [img]="icons.loader" size="16" class="animate-spin"></lucide-icon>
                <span>{{ loadingText }}</span>
            } @else {
                @if (icon) {
                    <lucide-icon [img]="icon" size="16"></lucide-icon>
                }
                <ng-content></ng-content>
            }
        </button>
    `,
})
export class ButtonComponent {
    @Input() variant: ButtonVariant = "primary";
    @Input() size: ButtonSize = "md";
    @Input() type: string = "button";
    @Input() disabled = false;
    @Input() loading = false;
    @Input() loadingText = "Saving...";
    @Input() icon?: LucideIconData;
    @Input() fullWidth = false;
    @Output() clicked = new EventEmitter<MouseEvent>();

    icons = { loader: LoaderCircle };

    get variantClass(): string {
        const map: Record<ButtonVariant, string> = {
            primary: "bg-blue-600 text-white shadow-sm shadow-blue-200 hover:bg-blue-700 active:bg-blue-800",
            secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100",
            outline: "bg-transparent text-blue-600 border border-blue-200 hover:bg-blue-50",
            ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-800",
            danger: "bg-red-600 text-white shadow-sm shadow-red-200 hover:bg-red-700",
        };
        return map[this.variant];
    }

    get sizeClass(): string {
        return this.size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm";
    }
}
