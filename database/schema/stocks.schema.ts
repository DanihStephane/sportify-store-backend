import { int, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { ProductsSchema } from "./products.schema";
import { BaseEntity } from "../entity/base.entity";

export interface StocksEntity extends BaseEntity {
    id: number;
    productId: number;
    quantity: number;
}

export const StocksSchema = mysqlTable('stocks', {
    id: int().autoincrement().primaryKey(),
    productId: int("product_id").references(() => ProductsSchema.id).notNull(), // Foreign key to products table
    quantity: int("quantity").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});