import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgres://localhost:5432/setup-collector",
})

export async function dropReportsTable() {
  return await pool.query(/*sql*/ `
    DROP TABLE IF EXISTS reports
  `)
}

export async function createReportsTable() {
  return await pool.query(/*sql*/ `
    CREATE TABLE reports (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      os VARCHAR(255) NOT NULL,
      os_version VARCHAR(255) NOT NULL,
      arch VARCHAR(255) NOT NULL,
      node_version VARCHAR(255),
      node_path VARCHAR(255),
      shell VARCHAR(255) NOT NULL,
      vscode BOOLEAN NOT NULL,
      postgres BOOLEAN NOT NULL,
      postgres_version VARCHAR(255)
    )
  `)
}

export async function getReportByEmail(email) {
  const { rows: [report] } = await pool.query(/*sql*/`
    SELECT * FROM reports
    WHERE email = $1
  `, [email]);
  return report;
}

export async function updateReport({
  email,
  os,
  os_version,
  arch,
  node_version,
  node_path,
  shell,
  vscode,
  postgres,
  postgres_version,
}) {
  return await pool.query(/*sql*/`
    UPDATE reports SET
    email = $1,
    os = $2,
    os_version = $3,
    arch = $4,
    node_version = $5,
    node_path = $6,
    shell = $7,
    vscode = $8,
    postgres = $9,
    postgres_version = $10
    WHERE email = $1
  `,[
    email,
    os,
    os_version,
    arch,
    node_version,
    node_path,
    shell,
    vscode,
    postgres,
    postgres_version
  ]);
}

export async function saveReport({
  email,
  os,
  os_version,
  arch,
  node_version,
  node_path,
  shell,
  vscode,
  postgres,
  postgres_version,
}) {
  return await pool.query(/*sql*/`
    INSERT INTO reports (
      email,
      os,
      os_version,
      arch,
      node_version,
      node_path,
      shell,
      vscode,
      postgres,
      postgres_version
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
    )
  `,[
    email,
    os,
    os_version,
    arch,
    node_version,
    node_path,
    shell,
    vscode,
    postgres,
    postgres_version
  ]);
}
