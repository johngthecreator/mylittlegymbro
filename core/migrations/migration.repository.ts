import { SQLiteDatabase } from "expo-sqlite";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IMigrationRepository } from "./migration.interface";

@injectable()
export class MigrationRepository implements IMigrationRepository {
  constructor(@inject(TYPES.SQLiteDatabase) private db: SQLiteDatabase) {}

  async init(): Promise<void> {
    await this.db.execAsync(
      `CREATE TABLE IF NOT EXISTS db_version (version INTEGER PRIMARY KEY);`
    );
  }

  async runMigrations(migrations: string[]): Promise<void> {
    const result = await this.db.getAllSync<{ version: number }>(
      "SELECT MAX(version) as version FROM db_version"
    );
    const currentVersion = result[0]?.version || 0;

    for (let i = currentVersion; i < migrations.length; i++) {
      try {
        await this.db.execAsync(migrations[i]);
        await this.db.runAsync(
          "INSERT OR REPLACE INTO db_version (version) VALUES (?)",
          [i + 1]
        );
        console.log(`Applied migration version ${i + 1}`);
      } catch (error) {
        console.error(`Migration error at version ${i + 1}:`, error);
        throw error; // Re-throw to stop further migrations if one fails
      }
    }
  }
}
