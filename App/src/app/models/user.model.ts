export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string,
    birthDate: Date;
    phone?: string;
    address?: string;
}
