export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string,
    birthDate: Date;
    jmbg: string;
    phone?: string;
    address?: string;
}
