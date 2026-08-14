import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class CrudService<T extends { id: string }> {
  protected abstract storageKey: string;

  readonly items: WritableSignal<T[]> = signal<T[]>([]);

  constructor() {
    this.items.set(this.load());
  }

  getAll(): T[] {
    return this.items();
  }

  getById(id: string): T | undefined {
    return this.items().find((item) => item.id === id);
  }

  create(item: Omit<T, 'id'>): T {
    const record = { ...item, id: this.nextId() } as T;
    this.items.update((list) => [record, ...list]);
    this.persist();
    return record;
  }

  update(id: string, changes: Partial<T>): T | undefined {
    let updated: T | undefined;
    this.items.update((list) =>
      list.map((item) => {
        if (item.id !== id) {
          return item;
        }
        updated = { ...item, ...changes };
        return updated;
      }),
    );
    if (updated) {
      this.persist();
    }
    return updated;
  }

  delete(id: string): void {
    this.items.update((list) => list.filter((item) => item.id !== id));
    this.persist();
  }

  protected abstract seed(): T[];

  private load(): T[] {
    const raw = this.storage?.getItem(this.storageKey);
    if (raw) {
      try {
        return JSON.parse(raw) as T[];
      } catch {
        // corrupted storage, fall back to seed data
      }
    }
    return this.seed();
  }

  private persist(): void {
    this.storage?.setItem(this.storageKey, JSON.stringify(this.items()));
  }

  private get storage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }

  private nextId(): string {
    const max = this.items().reduce((highest, item) => {
      const numeric = Number(item.id);
      return Number.isFinite(numeric) && numeric > highest ? numeric : highest;
    }, 0);
    return String(max + 1);
  }
}
