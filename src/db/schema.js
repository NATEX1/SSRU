import { mysqlTable, int, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

export const comments = mysqlTable('comments', {
  id: int('id').autoincrement().primaryKey(),  
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  message: text('message').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});