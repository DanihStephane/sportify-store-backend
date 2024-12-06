import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { ProductsSchema } from "./products.schema";
import { SuppliersSchema } from "./suppliers.schema";
import { BaseEntity } from "../entity/base.entity";

export interface SuppliersOrdersEntity extends BaseEntity {
    id: number;
    supplierId: number;
    productId: number;
    quantity: number;
    status: string;
    orderDate: Date;
}

export const SuppliersOrdersSchema = mysqlTable('suppliers_orders', {
    id: int().autoincrement().primaryKey(),
    supplierId: int("supplier_id").references(() => SuppliersSchema.id).notNull(),
    productId: int("product_id").references(() => ProductsSchema.id).notNull(),
    quantity: int("quantity").notNull(),
    status: varchar("status", { length: 50 }).default('pending'), // Example statuses: 'pending', 'processing', 'shipped', 'delivered'
    orderDate: timestamp("order_date").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});