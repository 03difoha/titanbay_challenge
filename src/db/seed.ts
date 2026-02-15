import { FundsRepository } from "@/modules/funds/funds.repository";
import { InvestorsRepository } from "@/modules/investors/investors.repository";
import { InvestmentsRepository } from "@/modules/investments/investments.repository";

async function seed() {
  console.log("🌱 Seeding database...");

  // -----------------------
  // FUNDS
  // -----------------------
  const fund1 = await FundsRepository.create({
    name: "Growth Fund I",
    vintage_year: 2024,
    target_size_usd: 5_000_000,
    status: "Fundraising",
  });

  const fund2 = await FundsRepository.create({
    name: "Opportunity Fund II",
    vintage_year: 2023,
    target_size_usd: 10_000_000,
    status: "Investing",
  });

  if (!fund1 || !fund2) {
    throw new Error("Failed to create funds");
  }

  console.log("✅ Funds created");

  // -----------------------
  // INVESTORS
  // -----------------------
  const investor1 = await InvestorsRepository.create({
    name: "Alice Smith",
    investor_type: "Individual",
    email: `alice-${Date.now()}@example.com`,
  });

  const investor2 = await InvestorsRepository.create({
    name: "Big Capital LP",
    investor_type: "Institution",
    email: `capital.seed.${Date.now()}.@example.com`,
  });

  if (!investor1 || !investor2) {
    throw new Error("Failed to create investors");
  }

  console.log("✅ Investors created");

  // -----------------------
  // INVESTMENTS
  // -----------------------
  await InvestmentsRepository.create({
    fund_id: fund1.id,
    investor_id: investor1.id,
    amount_usd: 100_000,
    investment_date: "2024-01-15",
  });

  await InvestmentsRepository.create({
    fund_id: fund1.id,
    investor_id: investor2.id,
    amount_usd: 500_000,
    investment_date: "2024-02-01",
  });

  await InvestmentsRepository.create({
    fund_id: fund2.id,
    investor_id: investor2.id,
    amount_usd: 1_000_000,
    investment_date: "2023-06-10",
  });

  console.log("✅ Investments created");
  console.log("🌱 Seeding complete");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed");
    console.error(err);
    process.exit(1);
  });
