import { InvestorsRepository } from "./investors.repository";
import { CreateInvestorDTO } from "./investors.dto";

export async function handleInvestors(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.pathname.split("/")[2];

  try {
    // GET /investors
    if (req.method === "GET" && !id) {
      const all = await InvestorsRepository.findAll();
      return Response.json(all, { status: 200 });
    }

    // GET /investors/:id
    if (req.method === "GET" && id) {
      const inv = await InvestorsRepository.findById(id);
      if (!inv) {
        return Response.json(
          { error: `No investor found with id '${id}'` },
          { status: 404 },
        );
      }
      return Response.json(inv, { status: 200 });
    }

    // POST /investors
    if (req.method === "POST") {
      const body = (await req.json()) as Record<string, unknown>;
      const dto = CreateInvestorDTO.parse(body);

      try {
        const inv = await InvestorsRepository.create(dto);
        return Response.json(inv, { status: 201 });
      } catch (err: any) {
        // Drizzle wraps the Postgres error inside 'cause'
        const pgError = err?.cause;

        // Check for Postgres unique violation
        if (
          pgError?.code === "23505" &&
          pgError?.constraint === "investors_email_key"
        ) {
          return Response.json(
            { error: `An investor with email '${body.email}' already exists` },
            { status: 400 },
          );
        }

        // If you want, you can also fallback to checking 'detail' string:
        if (pgError?.detail?.includes("email")) {
          return Response.json(
            { error: `An investor with email '${body.email}' already exists` },
            { status: 400 },
          );
        }

        // Unknown error → bubble up to outer catch
        throw err;
      }
    }

    // PUT /investors
    if (req.method === "PUT") {
      const body = (await req.json()) as Record<string, unknown>;
      if (!body.id) {
        return Response.json(
          {
            error:
              "Cannot update investor: 'id' field is missing in request body",
          },
          { status: 400 },
        );
      }

      const dto = CreateInvestorDTO.parse(body);
      const inv = await InvestorsRepository.update(body.id as string, dto);

      if (!inv) {
        return Response.json(
          {
            error: `Cannot update investor: No investor found with id '${body.id}'`,
          },
          { status: 404 },
        );
      }

      return Response.json(inv, { status: 200 });
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
          "An unexpected error occurred while processing the investor request",
      },
      { status: 500 },
    );
  }
}
