import { db } from "@/db/client";
import { investments } from "@/db/schema";
import { eq } from "drizzle-orm";

export class InvestmentsRepository {
  static findAllForFund(fund_id: string) {
    return db
      .select()
      .from(investments)
      .where(eq(investments.fund_id, fund_id));
  }

  static create(data: {
    fund_id: string;
    investor_id: string;
    amount_usd: number;
    investment_date: string;
  }) {
    return db
      .insert(investments)
      .values({
        ...data,
        amount_usd: String(data.amount_usd),
      })
      .returning()
      .then((rows) => rows[0]);
  }
}
