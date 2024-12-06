import { mysqlTable, int, decimal, varchar, timestamp } from "drizzle-orm/mysql-core";
import { UsersSchema } from "./users.schema";
import { BaseEntity } from "../entity/base.entity";
import { ProductsSchema } from "./products.schema";

export interface OrdersEntity extends BaseEntity {
    id: number;
    userId: number;
    productId: number;
    quantity: number;
    totalAmount: number;
    status: string;
    orderDate: Date;
}

export const OrdersSchema = mysqlTable('orders', {
    id: int().autoincrement().primaryKey(),
    userId: int("user_id").references(() => UsersSchema.id).notNull(), // Replace with your actual user table name
    productId: int("product_id").references(() => ProductsSchema.id).notNull(),
    quantity: int("quantity").notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(), // Store amount with precision
    status: varchar("status", { length: 50 }).default('pending'), // Example statuses: 'pending', 'processing', 'shipped', 'delivered'
    orderDate: timestamp("order_date").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});