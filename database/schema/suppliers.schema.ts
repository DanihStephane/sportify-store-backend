import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";
import { BaseEntity } from "../entity/base.entity";

export interface SuppliersEntity extends BaseEntity {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
}

export const SuppliersSchema = mysqlTable('suppliers', {
    id: int().autoincrement().primaryKey(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    address: varchar("address", { length: 255 }), // Can store a more detailed address
    phone: varchar("phone", { length: 20 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});