import { handleFunds } from "@/modules/funds/funds.routes";
import { handleInvestors } from "@/modules/investors/investors.routes";
import { handleFundInvestments } from "@/modules/investments/fund-investments.routes";

Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean); // ["funds", "<id>", "investments"]

    if (url.pathname.startsWith("/funds")) {
      // Nested route: /funds/:fund_id/investments
      if (
        pathParts.length === 3 &&
        pathParts[2] === "investments" &&
        pathParts[1]
      ) {
        return handleFundInvestments(req, pathParts[1]);
      }
      return handleFunds(req);
    }

    if (url.pathname.startsWith("/investors")) return handleInvestors(req);

    return new Response("Not found", { status: 404 });
  },
});

console.log("Server running on http://localhost:3000");
