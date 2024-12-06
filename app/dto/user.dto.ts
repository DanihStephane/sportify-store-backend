export class UserDTO {
    id?: number;
    email?: string;
    password?: string;
    role?: string;
    token?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    postCode?: string;
    country?: string;
    verified?: boolean;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}