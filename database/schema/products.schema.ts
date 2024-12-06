import { boolean, decimal, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { CategorySchema } from "./category.schema";
import { BaseEntity } from "../entity/base.entity";
import { relations } from "drizzle-orm";
import { OrdersSchema } from "./orders.schema";

export interface ProductsEntity extends BaseEntity {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    categoryId: number;
    active: boolean;
}

export const ProductsSchema = mysqlTable('products', {
    id: int().autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique("product_slug"), // Unique for each product
    description: text("description").notNull(),
    price: decimal({ precision: 10, scale: 2 }), // For storing prices with decimal places
    categoryId: int("category_id").references(() => CategorySchema.id).notNull(), // Foreign key to categories table
    active: boolean("active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});

export const ProductRerlation = relations(ProductsSchema, ({one}) => ({
    order: one(OrdersSchema, {
        fields: [ProductsSchema.id],
        references: [OrdersSchema.productId]
    })
}));