import { FundsRepository } from "./funds.repository";
import { CreateFundDTO, UpdateFundDTO } from "./funds.dto";

export async function handleFunds(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.pathname.split("/")[2];

  try {
    // GET /funds
    if (req.method === "GET" && !id) {
      const funds = await FundsRepository.findAll();
      return Response.json(funds, { status: 200 });
    }

    // GET /funds/:id
    if (req.method === "GET" && id) {
      const fund = await FundsRepository.findById(id);
      if (!fund) {
        return Response.json(
          { error: `No fund found with id '${id}'` },
          { status: 404 },
        );
      }
      return Response.json(fund, { status: 200 });
    }

    // POST /funds
    if (req.method === "POST") {
      const body = await req.json();
      const dto = CreateFundDTO.parse(body);

      const fund = await FundsRepository.create(dto);
      return Response.json(fund, { status: 201 });
    }

    // PUT /funds
    if (req.method === "PUT") {
      const body = await req.json() as Record<string, unknown>;
      if (!body.id) {
        return Response.json(
          {
            error: "Cannot update fund: 'id' field is missing in request body",
          },
          { status: 400 },
        );
      }

      // validate only the fields that exist in body
      const dto = UpdateFundDTO.parse(body);

      const fund = await FundsRepository.update(body.id as string, dto);

      if (!fund) {
        return Response.json(
          { error: `Cannot update fund: No fund found with id '${body.id}'` },
          { status: 404 },
        );
      }

      return Response.json(fund, { status: 200 });
    }

    return Response.json(
      { error: `Endpoint '${req.method} ${url.pathname}' not found` },
      { status: 404 },
    );
  } catch (err: any) {
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
          "An unexpected error occurred while processing the fund request",
      },
      { status: 500 },
    );
  }
}
