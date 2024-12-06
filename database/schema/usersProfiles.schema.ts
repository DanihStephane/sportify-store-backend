import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { BaseEntity } from "../entity/base.entity";
import { UsersSchema } from "./users.schema";

export interface UsersProfilesEntity extends BaseEntity {
    userId?: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    postCode?: string;
    country?: string;
}

export const UsersProfilesSchema = mysqlTable('users_profiles', {
    id: int().autoincrement().primaryKey(),
    userId: int("user_id").notNull().references(() => UsersSchema.id), // Lien vers la table 'users'
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    phone: varchar("phone", { length: 20 }), // Longueur ajustée en fonction de vos besoins
    address: varchar("address", { length: 255 }),
    city: varchar("city", { length: 100 }),
    postCode: varchar("post_code", { length: 10 }),
    country: varchar("country", { length: 50 }), // Code pays (ex: US, FR)
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});