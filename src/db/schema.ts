// src/db/schema.ts
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  numeric,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

export const fundStatusEnum = pgEnum("fund_status", [
  "Fundraising",
  "Investing",
  "Closed",
]);
export const investorTypeEnum = pgEnum("investor_type", [
  "Individual",
  "Institution",
  "Family Office",
]);

// Fund table
export const funds = pgTable("funds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  vintage_year: integer("vintage_year").notNull(),
  target_size_usd: numeric("target_size_usd").notNull(),
  status: fundStatusEnum("status").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Investor table
export const investors = pgTable("investors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  investor_type: investorTypeEnum("investor_type").notNull(),
  email: text("email").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Investment table
export const investments = pgTable("investments", {
  id: uuid("id").primaryKey().defaultRandom(),
  investor_id: uuid("investor_id")
    .notNull()
    .references(() => investors.id, { onDelete: "cascade" }),
  fund_id: uuid("fund_id")
    .notNull()
    .references(() => funds.id, { onDelete: "cascade" }),
  amount_usd: numeric("amount_usd").notNull(),
  investment_date: date("investment_date").notNull(),
});
