export interface Role {
    id: string;
    name: string;
    description: string;
    users: number;
    permissions: string[];
}

export interface RoleEntry {
    name: string;
    description: string;
    permissions: string[];
}
