import { db } from "@/db/client";
import { investors } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { CreateInvestorDTOType } from "./investors.dto";

export class InvestorsRepository {
  static findAll() {
    return db.select().from(investors);
  }

  static findById(id: string) {
    return db
      .select()
      .from(investors)
      .where(eq(investors.id, id))
      .then((rows) => rows[0] ?? null);
  }

  static create(data: CreateInvestorDTOType) {
    return db
      .insert(investors)
      .values(data)
      .returning()
      .then((rows) => rows[0]);
  }

  static update(id: string, data: CreateInvestorDTOType) {
    return db
      .update(investors)
      .set(data)
      .where(eq(investors.id, id))
      .returning()
      .then((rows) => rows[0] ?? null);
  }
}
