export class LoginDto {
    email!: string;
    password!: string;
}

export class RegisterDto {
    email: string;
    role: string;
    password: string;
}

export class ForgotDto {
    email!: string;
    password?: string;
    token?: string;
}

export class VerifyDto {
    email!: string;
    token: string;
    timestamp: string;
    signature: string;
}