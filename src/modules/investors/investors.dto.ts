import { z } from "zod";

export const investorTypeEnum = z.enum([
  "Individual",
  "Institution",
  "Family Office",
]);

export const CreateInvestorDTO = z.object({
  name: z.string().min(1),
  investor_type: investorTypeEnum,
  email: z.string().email(),
});

export type CreateInvestorDTOType = z.infer<typeof CreateInvestorDTO>;
