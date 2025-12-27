/** @type {import('drizzle-kit').Config} */
export default {
  dialect: "mysql",
  schema: './src/db/schema.js',
  out: './drizzle',
  dbCredentials: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 8889,
  },
};