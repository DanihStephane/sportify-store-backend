import { boolean, int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { BaseEntity } from "../entity/base.entity";
import { ProductsSchema } from "./products.schema";

export interface ProductImagesEntity extends BaseEntity {
    id: number;
    productId: number;
    imageUrl: string;
    isMain: boolean;
}

export const ProductImagesSchema = mysqlTable('product_images', {
    id: int().autoincrement().primaryKey(),
    productId: int("product_id").references(() => ProductsSchema.id).notNull(), // Foreign key to products table
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    isMain: boolean().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});