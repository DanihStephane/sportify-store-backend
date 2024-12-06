import { boolean, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { BaseEntity } from "../entity/base.entity";

export interface UsersEntity extends BaseEntity {
    id?: number;
    role?: string;
    email?: string;
    password?: string;
    token?: string;
    verified?: boolean;
    active?: boolean;
}

export const UsersSchema = mysqlTable('users', {
    id: int().autoincrement().primaryKey(),
    role: varchar("role", { length: 10 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique('email_unique'),
    password: text("password").notNull(), // Assurez-vous que ce champ stocke les mots de passe en toute sécurité (hachage)
    token: varchar("token", { length: 255 }), // Champ pour les tokens d'authentification, JWT par exemple
    verified: boolean("verified").default(true),
    active: boolean("active").default(true), // Définir un utilisateur comme inactif au début
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow()
});