import { Client } from "pg";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function destroy() {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Refusing to destroy database in production");
    process.exit(1);
  }

  const rl = readline.createInterface({ input, output });

  const answer = await rl.question(
    "⚠️  This will DROP ALL TABLES. Are you sure? (y/N): ",
  );

  rl.close();

  if (answer.toLowerCase() !== "y") {
    console.log("Aborted.");
    process.exit(0);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  console.log("🔥 Dropping all tables...");

  await client.query(`
    DO $$ DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
        LOOP
            EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
  `);

  await client.end();

  console.log("💀 Database destroyed.");
}

destroy().catch((err) => {
  console.error("Destroy failed:");
  console.error(err);
  process.exit(1);
});
