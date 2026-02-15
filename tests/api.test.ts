import { describe, it, expect, beforeAll, afterAll } from "vitest";

const BASE_URL = "http://localhost:3000";

let testFundId: string;
let testFundId2: string;
let testInvestorId: string;
let testInvestmentId: string;

let testEmail: string;

describe("API Integration Tests", () => {
  // -------------------------------
  // SETUP: create fund & investor
  // -------------------------------
  beforeAll(async () => {
    // Create a Fund
    const fundPayload = {
      name: `Test Fund ${Date.now()}`,
      vintage_year: 2025,
      target_size_usd: 1000000,
      status: "Fundraising",
    };
    const fundRes = await fetch(`${BASE_URL}/funds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fundPayload),
    });
    const fundData = (await fundRes.json()) as { id: string };
    testFundId = fundData.id;
    expect(fundRes.status).toBe(201);

    // Create an Investor with unique email
    testEmail = `alice-${Date.now()}@example.com`;
    const investorPayload = {
      name: "Alice Smith",
      investor_type: "Individual",
      email: testEmail,
    };
    const invRes = await fetch(`${BASE_URL}/investors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(investorPayload),
    });
    const invData = (await invRes.json()) as { id: string };
    testInvestorId = invData.id;
    expect(invRes.status).toBe(201);
  });

  // -------------------------------
  // FUNDS
  // -------------------------------
  it("GET /funds returns array", async () => {
    const res = await fetch(`${BASE_URL}/funds`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("POST /funds creates a new fund", async () => {
    const payload = {
      name: `Test Fund ${Date.now()}`, // unique fund name per test run
      vintage_year: 2026,
      target_size_usd: 2000000,
      status: "Fundraising",
    };

    const res = await fetch(`${BASE_URL}/funds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Check that it returns 201 Created
    expect(res.status).toBe(201);

    const data = (await res.json()) as {
      id: string;
      name: string;
      vintage_year: number;
      status: string;
    };
    expect(data.id).toBeDefined();
    expect(data.name).toBe(payload.name);
    expect(data.vintage_year).toBe(payload.vintage_year);
    expect(data.status).toBe(payload.status);

    // Store the ID for later tests (optional)
    testFundId2 = data.id;
  });

  it("PUT /funds updates a fund", async () => {
    const payload = { id: testFundId, status: "Investing" };
    const res = await fetch(`${BASE_URL}/funds`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as { status: string };
    expect(data.status).toBe("Investing");
  });

  it("GET /funds/:id returns the created fund", async () => {
    const res = await fetch(`${BASE_URL}/funds/${testFundId}`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { id: string };
    expect(data.id).toBe(testFundId);
  });

  // -------------------------------
  // INVESTORS
  // -------------------------------

  it("POST /investors creates a new investor", async () => {
    testEmail = `alice-${Date.now()}@example.com`; // unique email per test run

    const payload = {
      name: "Alice Smith",
      investor_type: "Individual",
      email: testEmail,
    };

    const res = await fetch(`${BASE_URL}/investors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as { id: string; email: string };
    expect(data.id).toBeDefined();
    expect(data.email).toBe(payload.email);

    // Save for teardown or dependent tests
    testInvestorId = data.id;
  });

  it("GET /investors returns array of investors", async () => {
    const res = await fetch(`${BASE_URL}/investors`);
    expect(res.status).toBe(200);

    const data = (await res.json()) as any[];
    expect(Array.isArray(data)).toBe(true);

    // Check that our test investor is in the list
    const found = data.find((i: any) => i.id === testInvestorId);
    expect(found).toBeDefined();
    expect(found.email).toBe(testEmail);
  });

  it("POST /investors with duplicate email fails", async () => {
    const payload = {
      name: "Alice Smith",
      investor_type: "Individual",
      email: testEmail, // same as created in beforeAll
    };
    const res = await fetch(`${BASE_URL}/investors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(res.status).toBe(400);
    const data = (await res.json()) as { error: string };
    expect(data.error).toContain("already exists");
  });

  // -------------------------------
  // INVESTMENTS
  // -------------------------------
  it("POST /funds/:fund_id/investments creates investment", async () => {
    const payload = {
      investor_id: testInvestorId,
      amount_usd: 50000,
      investment_date: "2024-01-01",
    };
    const res = await fetch(`${BASE_URL}/funds/${testFundId}/investments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(res.status).toBe(201);
    const data = (await res.json()) as { id: string };
    expect(data.id).toBeDefined();
    testInvestmentId = data.id;
  });

  it("GET /funds/:fund_id/investments returns investments", async () => {
    const res = await fetch(`${BASE_URL}/funds/${testFundId}/investments`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any[];
    expect(Array.isArray(data)).toBe(true);
    expect(data.find((i: any) => i.id === testInvestmentId)).toBeDefined();
  });

  // -------------------------------
  // TEARDOWN: cleanup test data
  // -------------------------------
  afterAll(async () => {
    // Delete investment
    if (testInvestmentId) {
      await fetch(`${BASE_URL}/investments/${testInvestmentId}`, {
        method: "DELETE",
      }).catch(() => {});
    }

    // Delete investor
    if (testInvestorId) {
      await fetch(`${BASE_URL}/investors/${testInvestorId}`, {
        method: "DELETE",
      }).catch(() => {});
    }

    // Delete first fund
    if (testFundId) {
      await fetch(`${BASE_URL}/funds/${testFundId}`, {
        method: "DELETE",
      }).catch(() => {});
    }

    // Delete second fund
    if (testFundId2) {
      await fetch(`${BASE_URL}/funds/${testFundId2}`, {
        method: "DELETE",
      }).catch(() => {});
    }
  });
});
