export interface ResponseData<T> {
    id: any;
    name: string;
    status: number;
    data: T;
    message?: string;
}