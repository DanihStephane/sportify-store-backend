import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { UsersSchema } from "./users.schema";
import { BaseEntity } from "../entity/base.entity";

export interface PaymentsEntity extends BaseEntity {
    id: number;
    userId: number;
    typePayment: string;
}

export const PaymentsSchema = mysqlTable('payments', {
    id: int().autoincrement().primaryKey(),
    userId: int("user_id").references(() => UsersSchema.id).notNull(), // Replace with your actual user table name
    typePayment: varchar("type_payment", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});


