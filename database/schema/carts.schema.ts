import { mysqlTable, int, timestamp } from "drizzle-orm/mysql-core";
import { ProductsSchema } from "./products.schema";
import { UsersSchema } from "./users.schema";
import { BaseEntity } from "../entity/base.entity";

export interface CartsEntity extends BaseEntity {
    id: number;
    userId: number;
    productId: number;
    quantity: number;
}

export const CartsSchema = mysqlTable('carts', {
    id: int().autoincrement().primaryKey(),
    userId: int("user_id").references(() => UsersSchema.id).notNull(),
    productId: int("product_id").references(() => ProductsSchema.id).notNull(), // Assuming a 'productsSchema' exists
    quantity: int("quantity").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});