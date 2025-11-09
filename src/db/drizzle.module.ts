import { Module } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as authSchema from './schema/auth-admin.schema';
import * as newsSchema from './schema/news.schema';

dotenv.config();

// Combine all schemas
const schema = { ...authSchema, ...newsSchema };

export type DbType = NodePgDatabase<typeof schema>;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL === 'true',
});

export const db = drizzle(pool, { schema });

@Module({
  providers: [{ provide: 'DB', useValue: db }],
  exports: ['DB'],
})
export class DrizzleModule {}
