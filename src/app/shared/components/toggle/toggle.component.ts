import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-toggle",
    standalone: true,
    template: `
        <button
            type="button"
            role="switch"
            [attr.aria-checked]="checked"
            [attr.aria-disabled]="disabled"
            [disabled]="disabled"
            (click)="toggled.emit(!checked)"
            class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            [class]="checked ? 'bg-blue-600' : 'bg-gray-200'">
            <span
                class="pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
                [class]="checked ? 'translate-x-5' : 'translate-x-0'"></span>
        </button>
    `,
})
export class ToggleComponent {
    @Input() checked = false;
    @Input() disabled = false;
    @Output() toggled = new EventEmitter<boolean>();
}
