import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({
    selector: "ng-template[tableCell]",
    standalone: true,
})
export class TableCellDirective {
    @Input("tableCell") key = "";

    constructor(public templateRef: TemplateRef<unknown>) {}
}
