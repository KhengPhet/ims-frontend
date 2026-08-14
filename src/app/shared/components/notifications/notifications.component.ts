import { Component, ElementRef, HostListener, inject } from "@angular/core";
import {
    LucideAngularModule,
    Bell,
    TriangleAlert,
    PackagePlus,
    PackageCheck,
    ShoppingCart,
    CreditCard,
    CircleCheck,
    ArrowRight,
    Inbox,
    LucideIconData,
} from "lucide-angular";

export type NotificationType = "low-stock" | "stock-in" | "stock-out" | "order" | "payment" | "system";

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    time: string;
    read: boolean;
}

interface NotificationStyle {
    icon: LucideIconData;
    bg: string;
    color: string;
}

@Component({
    selector: "app-notifications",
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: "./notifications.component.html",
})
export class NotificationsComponent {
    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

    icons = {
        bell: Bell,
        check: CircleCheck,
        arrow: ArrowRight,
        inbox: Inbox,
    };

    protected open = false;

    notifications: AppNotification[] = [
        { id: "n1", type: "low-stock", title: "Low stock alert", description: "USB-C Cable 2m (PRD-2088) has only 12 units left.", time: "5 min ago", read: false },
        { id: "n2", type: "order", title: "New order received", description: "ORD-2048 · Sarah Johnson · $189.50", time: "24 min ago", read: false },
        { id: "n3", type: "stock-in", title: "Purchase order received", description: "PO-2477 from BlueOak Wholesale · 6 items added.", time: "1 hr ago", read: false },
        { id: "n4", type: "payment", title: "Payment confirmed", description: "$1,240.00 paid for order ORD-2047.", time: "2 hrs ago", read: false },
        { id: "n5", type: "system", title: "Weekly report ready", description: "Your weekly inventory report is available.", time: "Yesterday", read: true },
        { id: "n6", type: "low-stock", title: "Reorder level reached", description: "Office Chair Ergo (PRD-5562) is at its reorder level.", time: "Yesterday", read: true },
    ];

    get unreadCount(): number {
        return this.notifications.filter((n) => !n.read).length;
    }

    styleFor(type: NotificationType): NotificationStyle {
        const map: Record<NotificationType, NotificationStyle> = {
            "low-stock": { icon: TriangleAlert, bg: "bg-amber-100", color: "text-amber-600" },
            "stock-in": { icon: PackagePlus, bg: "bg-emerald-100", color: "text-emerald-600" },
            "stock-out": { icon: PackageCheck, bg: "bg-blue-100", color: "text-blue-600" },
            order: { icon: ShoppingCart, bg: "bg-violet-100", color: "text-violet-600" },
            payment: { icon: CreditCard, bg: "bg-sky-100", color: "text-sky-600" },
            system: { icon: Bell, bg: "bg-gray-100", color: "text-gray-600" },
        };
        return map[type];
    }

    toggle(): void {
        this.open = !this.open;
    }

    markAllRead(): void {
        this.notifications.forEach((n) => (n.read = true));
    }

    markRead(item: AppNotification): void {
        item.read = true;
        this.open = false;
    }

    viewAll(): void {
        this.open = false;
        console.log("view all notifications");
    }

    @HostListener("document:click", ["$event"])
    onDocumentClick(event: Event): void {
        if (!this.host.nativeElement.contains(event.target as Node)) {
            this.open = false;
        }
    }
}
