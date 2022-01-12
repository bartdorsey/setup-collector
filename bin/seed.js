const { pool, dropReportsTable, createReportsTable } = require('../src/db');

async function main() {
  console.log(`Dropping Tables`);
  await dropReportsTable();
  console.log(`Creating Tables`);
  await createReportsTable();
  await pool.end();
}

main();