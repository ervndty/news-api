import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const authAdmin = pgTable('auth_admin', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'),
});

export type AuthAdmin = typeof authAdmin.$inferSelect;
export type NewAuthAdmin = typeof authAdmin.$inferInsert;
