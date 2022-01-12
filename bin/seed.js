import { pool, dropReportsTable, createReportsTable } from '../src/db.js';

async function main() {
  console.log(`Dropping Tables`);
  await dropReportsTable();
  console.log(`Creating Tables`);
  await createReportsTable();
  await pool.end();
}

main();