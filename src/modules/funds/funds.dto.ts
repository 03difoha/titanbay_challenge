import { z } from "zod";

// Allowed fund statuses
export const fundStatusEnum = z.enum(["Fundraising", "Investing", "Closed"]);

export const CreateFundDTO = z.object({
  name: z.string().min(1),
  vintage_year: z.number().int().gte(1900).lte(new Date().getFullYear()),
  target_size_usd: z.number().positive(),
  status: fundStatusEnum,
});

export type CreateFundDTOType = z.infer<typeof CreateFundDTO>;


export const UpdateFundDTO = z.object({
  name: z.string().optional(),
  vintage_year: z.number().int().optional(),
  target_size_usd: z.number().optional(),
  status: z.enum(["Fundraising", "Investing", "Closed"]).optional(),
});

export type UpdateFundDTOType = z.infer<typeof UpdateFundDTO>;
