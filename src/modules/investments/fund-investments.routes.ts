import { InvestmentsRepository } from "./investments.repository";
import { z } from "zod";

// DTO for creating an investment (fund_id comes from URL)
export const CreateFundInvestmentDTO = z.object({
  investor_id: z.string().uuid(),
  amount_usd: z.number().positive(),
  investment_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export type CreateFundInvestmentDTOType = z.infer<
  typeof CreateFundInvestmentDTO
>;

export async function handleFundInvestments(
  req: Request,
  fund_id: string,
): Promise<Response> {
  try {
    // GET /funds/:fund_id/investments
    if (req.method === "GET") {
      const all = await InvestmentsRepository.findAllForFund(fund_id);
      return Response.json(all, { status: 200 });
    }

    // POST /funds/:fund_id/investments
    if (req.method === "POST") {
      const body = await req.json();

      const dto = CreateFundInvestmentDTO.parse(body);

      const investment = await InvestmentsRepository.create({
        ...dto,
        fund_id, // merge fund_id from path
      });

      return Response.json(investment, { status: 201 });
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return Response.json(
        { error: "Validation failed", details: err.errors },
        { status: 400 },
      );
    }

    if (err.code === "23503") {
      return Response.json(
        { error: "Invalid investor_id or fund_id" },
        { status: 400 },
      );
    }

    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
