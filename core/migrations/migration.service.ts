import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IMigrationRepository, IMigrationService } from "./migration.interface";

@injectable()
export class MigrationService implements IMigrationService {
  constructor(
    @inject(TYPES.IMigrationRepository)
    private migrationRepository: IMigrationRepository
  ) {}

  async runMigrations(): Promise<void> {
    await this.migrationRepository.init();

    const migrations = [
      // Migration 001: Create quick_adds table & adds default "Meee" profile
      `
      BEGIN TRANSACTION;
      CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        is_active INTEGER DEFAULT 0
      );
      INSERT INTO profiles (name, is_active) VALUES ("Meee", 1);
      COMMIT;
      `,
      // Migration 002: adding fk constraint to log_entries table and connecting to profiles table
      `
      BEGIN TRANSACTION;
      ALTER TABLE log_entries ADD COLUMN profile_id INT DEFAULT 1;
      COMMIT;
      `,
      // Migration 004: adding default "Meee" profile
      // `CREATE TABLE IF NOT EXISTS quick_adds (
      //   id INTEGER PRIMARY KEY AUTOINCREMENT,
      //   log_entry_id INTEGER,
      //   name TEXT NOT NULL,
      //   calories REAL NOT NULL,
      //   g_protein REAL NOT NULL,
      //   g_carbs REAL NOT NULL,
      //   g_fats REAL NOT NULL,
      //   date TEXT NOT NULL,
      //   FOREIGN KEY(log_entry_id) REFERENCES log_entries(id)
      // );`,
      // Add more migrations here as needed:
      // `ALTER TABLE some_table ADD COLUMN new_column TEXT;`
    ];

    await this.migrationRepository.runMigrations(migrations);
  }
}
