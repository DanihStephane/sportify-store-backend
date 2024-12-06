import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

export default defineConfig ({
    schema: './database/schema/index.ts',
    out: './database/sql',
    dialect: "mysql",
    dbCredentials: {
        host: process.env.DB_HOST,
        port: dbPort,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
});