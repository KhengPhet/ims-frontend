import { Component, Input } from "@angular/core";
import { LucideAngularModule, TrendingUp, TrendingDown, LucideIconData } from "lucide-angular";

@Component({
    selector: "app-stat-card",
    standalone: true,
    imports: [LucideAngularModule],
    template: `
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center {{ iconBg }}">
                        <lucide-icon [img]="icon" size="24" class="{{ iconColor }}"></lucide-icon>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
                        <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ value }}</p>
                    </div>
                </div>
            </div>
            @if (trend || note) {
                <div class="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    @if (trend && trendUp !== undefined) {
                        <span class="flex items-center gap-1 text-xs font-semibold" [class]="trendUp ? 'text-emerald-600' : 'text-red-500'">
                            <lucide-icon [img]="trendUp ? icons.up : icons.down" size="14"></lucide-icon>
                            {{ trend }}
                        </span>
                    }
                    @if (note) {
                        <span class="text-xs text-gray-400">{{ note }}</span>
                    }
                </div>
            }
        </div>
    `,
})
export class StatCardComponent {
    @Input() title = "";
    @Input() value = "";
    @Input() icon!: LucideIconData;
    @Input() iconBg = "bg-blue-100";
    @Input() iconColor = "text-blue-600";
    @Input() trend?: string;
    @Input() trendUp?: boolean;
    @Input() note?: string;

    icons = { up: TrendingUp, down: TrendingDown };
}
