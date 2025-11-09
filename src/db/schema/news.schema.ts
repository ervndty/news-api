import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const news = pgTable('news', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at'),
});

export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
