import { Component, ContentChildren, EventEmitter, Input, Output, QueryList } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { LucideAngularModule, ChevronUp, ChevronDown, Eye, SquarePen, Trash2, SearchX, LucideIconData } from "lucide-angular";
import { TableCellDirective } from "./table-cell.directive";
import { BadgeComponent, BadgeVariant } from "../badge/badge.component";
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { PaginationComponent } from "../pagination/pagination.component";

export type ColumnAlign = "left" | "right" | "center";

export interface TableColumn<T> {
    key: string;
    label: string;
    sortable?: boolean;
    align?: ColumnAlign;
    hide?: string;
    headerClass?: string;
    cellClass?: string;
    bold?: boolean;
    render?: (row: T) => string;
    badge?: (row: T) => { label: string; variant: BadgeVariant; icon?: LucideIconData };
    initials?: (row: T) => string;
}

@Component({
    selector: "app-data-table",
    standalone: true,
    imports: [NgTemplateOutlet, LucideAngularModule, BadgeComponent, SearchBarComponent, PaginationComponent],
    templateUrl: "./data-table.component.html",
})
export class DataTableComponent<T> {
    @Input() columns: TableColumn<T>[] = [];
    @Input() data: T[] = [];
    @Input() searchKeys: (keyof T | string)[] = [];
    @Input() title = "";
    @Input() description = "";
    @Input() showSearch = true;
    @Input() searchPlaceholder = "Search...";
    @Input() pageSize = 10;
    @Input() actions = false;
    @Input() showView = true;
    @Input() showEdit = true;
    @Input() showDelete = true;

    @Input() filterable = false;
    @Input() filterOptions: string[] = [];
    @Input() filterFn?: (row: T, value: string) => boolean;

    @Output() view = new EventEmitter<T>();
    @Output() edit = new EventEmitter<T>();
    @Output() delete = new EventEmitter<T>();
    @Output() searchChange = new EventEmitter<string>();
    @Output() filterChange = new EventEmitter<string>();

    @ContentChildren(TableCellDirective) cellTemplates!: QueryList<TableCellDirective>;

    icons = {
        up: ChevronUp,
        down: ChevronDown,
        eye: Eye,
        edit: SquarePen,
        trash: Trash2,
        empty: SearchX,
    };

    protected term = "";
    protected filter = "";
    protected sortKey = "";
    protected sortDir: "asc" | "desc" = "asc";
    protected page = 1;

    get filtered(): T[] {
        let list = [...this.data];
        const query = this.term.trim().toLowerCase();
        if (query && this.searchKeys.length) {
            list = list.filter((row) =>
                this.searchKeys.some((key) => String((row as Record<string, unknown>)[key as string] ?? "").toLowerCase().includes(query)),
            );
        }
        if (this.filter && this.filterFn) {
            list = list.filter((row) => this.filterFn!(row, this.filter));
        }
        if (this.sortKey) {
            const key = this.sortKey;
            list.sort((a, b) => {
                const av = (a as Record<string, unknown>)[key];
                const bv = (b as Record<string, unknown>)[key];
                const cmp =
                    typeof av === "number" && typeof bv === "number"
                        ? av - bv
                        : String(av ?? "").localeCompare(String(bv ?? ""));
                return this.sortDir === "asc" ? cmp : -cmp;
            });
        }
        return list;
    }

    get total(): number {
        return this.filtered.length;
    }

    get totalPages(): number {
        return Math.max(1, Math.ceil(this.total / this.pageSize));
    }

    get start(): number {
        return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
    }

    get end(): number {
        return Math.min(this.page * this.pageSize, this.total);
    }

    get pagedRows(): T[] {
        const startIndex = (this.page - 1) * this.pageSize;
        return this.filtered.slice(startIndex, startIndex + this.pageSize);
    }

    cellValue(row: T, key: string): unknown {
        return (row as Record<string, unknown>)[key];
    }

    alignClass(column: TableColumn<T>): string {
        return column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left";
    }

    sortBy(key: string): void {
        if (this.sortKey === key) {
            this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
        } else {
            this.sortKey = key;
            this.sortDir = "asc";
        }
    }

    sortIcon(key: string): "up" | "down" {
        return this.sortDir === "asc" ? "up" : "down";
    }

    onSearch(value: string): void {
        this.term = value;
        this.page = 1;
        this.searchChange.emit(value);
    }

    onFilter(value: string): void {
        this.filter = value;
        this.page = 1;
        this.filterChange.emit(value);
    }

    onPageChange(page: number): void {
        this.page = page;
    }

    templateFor(key: string): TableCellDirective | undefined {
        return this.cellTemplates?.find((cell) => cell.key === key);
    }
}
