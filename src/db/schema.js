import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).default("author"),
  position: varchar('position', {length: 50}),
  status: mysqlEnum('status', ['active', 'inactive']).notNull().default('active'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
});

export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("category_id").notNull(),
  authorId: int("author_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  content: text("content").notNull(),
  thumbnail: varchar("thumbnail", { length: 255 }),
  status: varchar("status", { length: 20 }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tags = mysqlTable('tags', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
});

export const articleTags = mysqlTable('article_tags', {
  articleId: int('article_id').notNull().references(() => articles.id),
  tagId: int('tag_id').notNull().references(() => tags.id),
});

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});
