import { db } from "@/db/client";
import { funds } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { CreateFundDTOType, UpdateFundDTOType } from "./funds.dto";

export class FundsRepository {
  static findAll() {
    return db.select().from(funds);
  }

  static findById(id: string) {
    return db
      .select()
      .from(funds)
      .where(eq(funds.id, id))
      .then((rows) => rows[0] ?? null);
  }

  static create(data: CreateFundDTOType) {
    return db
      .insert(funds)
      .values({
        ...data,
        target_size_usd: String(data.target_size_usd),
      })
      .returning()
      .then((rows) => rows[0]);
  }

  static update(id: string, data: UpdateFundDTOType) {
    return db
      .update(funds)
      .set({
        ...data,
        target_size_usd:
          data.target_size_usd !== undefined
            ? data.target_size_usd.toString()
            : undefined,
      })
      .where(eq(funds.id, id))
      .returning()
      .then((rows) => rows[0] ?? null);
  }
}
