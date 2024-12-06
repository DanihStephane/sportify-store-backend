import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { BaseEntity } from "../entity/base.entity";

export interface CategoryEntity extends BaseEntity{
    id: number;
    name: string;
    slug: string;
    description: string;
}

export const CategorySchema = mysqlTable('category', {
    id: int().autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique(), // Assure l'unicité des slugs
    description: text("description"), // Champ texte pour une description plus longue
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});