// src/db/createTables.ts
import { db } from "./client";
import { funds, investors, investments } from "./schema";

async function createTables() {
  console.log("Creating tables...");

  // Funds
  await db.execute(`
    CREATE TABLE IF NOT EXISTS funds (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      vintage_year INTEGER NOT NULL,
      target_size_usd NUMERIC NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Investors
  await db.execute(`
    CREATE TABLE IF NOT EXISTS investors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      investor_type TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  // Investments
  await db.execute(`
    CREATE TABLE IF NOT EXISTS investments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
      fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
      amount_usd NUMERIC NOT NULL,
      investment_date DATE NOT NULL
    );
  `);

  console.log("Tables created successfully!");
}

createTables()
  .catch((err) => {
    console.error("Error creating tables:", err);
  })
  .finally(() => {
    process.exit(0);
  });
