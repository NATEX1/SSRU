/** @type {import('drizzle-kit').Config} */
export default {
  dialect: "mysql",
  schema: './src/db/schema.js',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};