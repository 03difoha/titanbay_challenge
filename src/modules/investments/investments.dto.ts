import { z } from "zod";

export const CreateInvestmentDTO = z.object({
  investor_id: z.string().uuid(),
  fund_id: z.string().uuid(),
  amount_usd: z.number().positive(),
  investment_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a YYYY-MM-DD date"),
});

export type CreateInvestmentDTOType = z.infer<typeof CreateInvestmentDTO>;
