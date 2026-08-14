import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LucideAngularModule, ChevronLeft, ChevronRight } from "lucide-angular";

@Component({
    selector: "app-pagination",
    standalone: true,
    imports: [LucideAngularModule],
    template: `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-gray-100">
            <p class="text-xs text-gray-400">Showing {{ start }}–{{ end }} of {{ total }}</p>
            <div class="flex items-center gap-1.5">
                <button
                    type="button"
                    (click)="goTo(page - 1)"
                    [disabled]="page <= 1"
                    class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
                    <lucide-icon [img]="icons.prev" size="14"></lucide-icon>
                    Previous
                </button>
                @for (p of pages(); track p) {
                    @if (p === '...') {
                        <span class="px-1.5 text-xs text-gray-400">…</span>
                    } @else {
                        <button
                            type="button"
                            (click)="goTo(p)"
                            class="min-w-8 px-2.5 py-1.5 text-xs font-medium rounded-lg transition"
                            [class]="p === page ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'">
                            {{ p }}
                        </button>
                    }
                }
                <button
                    type="button"
                    (click)="goTo(page + 1)"
                    [disabled]="page >= totalPages"
                    class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
                    Next
                    <lucide-icon [img]="icons.next" size="14"></lucide-icon>
                </button>
            </div>
        </div>
    `,
})
export class PaginationComponent {
    @Input() total = 0;
    @Input() pageSize = 10;
    @Input() page = 1;
    @Output() pageChange = new EventEmitter<number>();

    icons = { prev: ChevronLeft, next: ChevronRight };

    get totalPages(): number {
        return Math.max(1, Math.ceil(this.total / this.pageSize));
    }

    get start(): number {
        return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
    }

    get end(): number {
        return Math.min(this.page * this.pageSize, this.total);
    }

    pages(): (number | string)[] {
        const result: (number | string)[] = [];
        const current = this.page;
        const last = this.totalPages;
        if (last <= 7) {
            for (let i = 1; i <= last; i++) result.push(i);
        } else {
            result.push(1);
            if (current > 3) result.push("...");
            for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) result.push(i);
            if (current < last - 2) result.push("...");
            result.push(last);
        }
        return result;
    }

    goTo(target: number | string): void {
        const page = typeof target === "string" ? Number(target) : target;
        if (page < 1 || page > this.totalPages || page === this.page) return;
        this.pageChange.emit(page);
    }
}
