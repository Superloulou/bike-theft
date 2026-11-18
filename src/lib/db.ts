import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import type { ReportRecord } from './types';

const DB_FILE = process.env.DATABASE_FILE ?? path.join(process.cwd(), 'data', 'reports.db');

declare global {
  var __bikeTheftDb: Database.Database | undefined;
}

function migrate(db: Database.Database) {
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      reference   TEXT PRIMARY KEY,
      created_at  TEXT NOT NULL,
      status      TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      city        TEXT NOT NULL,
      brand       TEXT NOT NULL,
      model       TEXT NOT NULL,
      color_main  TEXT NOT NULL,
      payload     TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_reports_email   ON reports (email);
    CREATE INDEX IF NOT EXISTS idx_reports_postal  ON reports (postal_code);
    CREATE INDEX IF NOT EXISTS idx_reports_brand   ON reports (brand);
    CREATE INDEX IF NOT EXISTS idx_reports_created ON reports (created_at DESC);
  `);
}

function connect(): Database.Database {
  if (globalThis.__bikeTheftDb) return globalThis.__bikeTheftDb;
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  const db = new Database(DB_FILE);
  migrate(db);
  globalThis.__bikeTheftDb = db;
  return db;
}

export function insertReport(record: ReportRecord): void {
  const stmt = connect().prepare(`
    INSERT INTO reports (
      reference, created_at, status, email, phone, postal_code, city,
      brand, model, color_main, payload
    ) VALUES (
      @reference, @createdAt, @status, @email, @phone, @postalCode, @city,
      @brand, @model, @colorMain, @payload
    )
  `);
  stmt.run({
    reference: record.reference,
    createdAt: record.createdAt,
    status: record.status,
    email: record.contact.email.trim().toLowerCase(),
    phone: record.contact.phone.trim(),
    postalCode: record.location.postalCode.trim(),
    city: record.location.city.trim(),
    brand: record.identity.brand.trim(),
    model: record.identity.model.trim(),
    colorMain: record.appearance.colorMain.trim(),
    payload: JSON.stringify(record),
  });
}

export function getReport(reference: string): ReportRecord | null {
  const row = connect()
    .prepare('SELECT payload FROM reports WHERE reference = ?')
    .get(reference) as { payload: string } | undefined;
  return row ? (JSON.parse(row.payload) as ReportRecord) : null;
}

export function countReports(): number {
  const row = connect().prepare('SELECT COUNT(*) AS total FROM reports').get() as { total: number };
  return row.total;
}

export function listReports(limit = 50): ReportRecord[] {
  const rows = connect()
    .prepare('SELECT payload FROM reports ORDER BY created_at DESC LIMIT ?')
    .all(limit) as { payload: string }[];
  return rows.map((row) => JSON.parse(row.payload) as ReportRecord);
}

export function databaseFile(): string {
  return DB_FILE;
}
