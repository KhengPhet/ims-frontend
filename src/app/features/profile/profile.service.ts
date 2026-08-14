import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export interface MyProfile {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    location: string;
    bio: string;
    image: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private readonly authService = inject(AuthService);

    readonly profile: WritableSignal<MyProfile>;

    constructor() {
        this.profile = signal<MyProfile>(this.load());
    }

    save(patch: Partial<MyProfile>): MyProfile {
        const updated = { ...this.profile(), ...patch };
        this.profile.set(updated);
        this.persist(updated);
        return updated;
    }

    private load(): MyProfile {
        const raw = this.storage?.getItem(this.storageKey);
        if (raw) {
            try {
                return JSON.parse(raw) as MyProfile;
            } catch {
                // corrupted storage, fall back to defaults
            }
        }
        return this.seed();
    }

    private persist(profile: MyProfile): void {
        this.storage?.setItem(this.storageKey, JSON.stringify(profile));
    }

    private seed(): MyProfile {
        const user = this.authService.getUser();
        return {
            fullName: user?.username ?? 'Admin',
            username: user?.username ?? 'admin',
            email: user?.email ?? 'admin@inventory.io',
            phone: '+1 555-0142',
            role: user?.role ?? 'Administrator',
            department: 'Operations',
            location: 'Springfield, USA',
            bio: 'Inventory system administrator responsible for stock, orders and team management.',
            image: user?.image ?? null,
        };
    }

    private get storage(): Storage | null {
        return typeof localStorage === 'undefined' ? null : localStorage;
    }

    private get storageKey(): string {
        return 'ims.myProfile';
    }
}
