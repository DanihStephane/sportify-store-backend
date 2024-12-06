import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { dbConf } from "./db";
import { schema as schemas } from "../database/schema";

export const dbInit = async () => {
    const connection = await mysql.createConnection({
        host: dbConf.host,
        user: dbConf.user,
        database: dbConf.database,
        password: dbConf.password,
        port: dbConf.port,
    });
    
    try {
        await connection.connect();
        
        const db = drizzle(connection, { mode: 'default', schema: schemas });
        
        return db;
    } catch (error) {
        throw new Error('Failed to connect to the database. Please check your configuration. ', error);
    }
}