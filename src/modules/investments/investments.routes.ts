import { InvestmentsRepository } from "./investments.repository";
import { CreateInvestmentDTO } from "./investments.dto";

export async function handleInvestments(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.pathname.split("/")[2];

  try {
    // -------------------------------
    // GET funds/:fund_id/investments
    // -------------------------------
    if (req.method === "GET" && !id) {
      return Response.json(
        { error: `You must provide a investment id '${id}'` },
        { status: 400 },
      );
    }

    if (req.method === "GET" && id) {
      const investment = await InvestmentsRepository.findAllForFund(id);
      if (!investment) {
        return Response.json(
          { error: `No investment found with id '${id}'` },
          { status: 404 },
        );
      }
      return Response.json(investment, { status: 200 });
    }

    // -------------------------------
    // POST /investments
    // -------------------------------
    if (req.method === "POST") {
      const body = await req.json();
      const dto = CreateInvestmentDTO.parse(body);

      try {
        const investment = await InvestmentsRepository.create(dto);
        return Response.json(investment, { status: 201 });
      } catch (err: any) {
        // unwrap DrizzleQueryError or database error
        const cause = err?.cause || err;
        const msg = cause?.message || "";
        const detail = cause?.detail || "";

        // Foreign key violations (investor_id or fund_id doesn't exist)
        if (
          cause?.code === "23503" ||
          msg.includes("violates foreign key constraint")
        ) {
          return Response.json(
            {
              error: "Foreign key constraint failed",
              message:
                "Either the investor_id or fund_id does not exist in the database",
            },
            { status: 400 },
          );
        }

        console.error(err);
        // fall back to outer catch for unexpected errors
        throw err;
      }
    }


    // -------------------------------
    // Not found
    // -------------------------------
    return Response.json(
      { error: `Endpoint '${req.method} ${url.pathname}' not found` },
      { status: 404 },
    );
  } catch (err: any) {
    // Zod validation errors
    if (err.name === "ZodError") {
      return Response.json(
        {
          error: "Invalid request data",
          message: "Please check your input fields and types",
          details: err.errors,
        },
        { status: 400 },
      );
    }

    console.error(err);
    return Response.json(
      {
        error: "Internal server error",
        message:
          "An unexpected error occurred while processing the investment request",
      },
      { status: 500 },
    );
  }
}
