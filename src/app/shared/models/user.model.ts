export type UserStatus = 'Active' | 'Inactive' | 'Pending';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: UserStatus;
    avatar?: string;
}

export interface UserEntry {
    name: string;
    email: string;
    role: string;
    department: string;
    phone: string;
    status: UserStatus;
    sendInvite: boolean;
}
