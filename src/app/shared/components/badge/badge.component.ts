import { Component, Input } from "@angular/core";
import { LucideAngularModule, LucideIconData } from "lucide-angular";

export type BadgeVariant = "green" | "red" | "amber" | "blue" | "violet" | "gray";

@Component({
    selector: "app-badge",
    standalone: true,
    imports: [LucideAngularModule],
    template: `
        <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap" [class]="variantClass">
            @if (icon) {
                <lucide-icon [img]="icon" size="12"></lucide-icon>
            }
            {{ label }}
        </span>
    `,
})
export class BadgeComponent {
    @Input() label = "";
    @Input() variant: BadgeVariant = "gray";
    @Input() icon?: LucideIconData;

    get variantClass(): string {
        const map: Record<BadgeVariant, string> = {
            green: "bg-emerald-100 text-emerald-700",
            red: "bg-red-100 text-red-700",
            amber: "bg-amber-100 text-amber-700",
            blue: "bg-blue-100 text-blue-700",
            violet: "bg-violet-100 text-violet-700",
            gray: "bg-gray-100 text-gray-600",
        };
        return map[this.variant];
    }
}
