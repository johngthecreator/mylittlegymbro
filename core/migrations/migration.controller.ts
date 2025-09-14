import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IMigrationController, IMigrationService } from "./migration.interface";

@injectable()
export class MigrationController implements IMigrationController {
  constructor(
    @inject(TYPES.IMigrationService) private migrationService: IMigrationService
  ) {}

  async runMigrations(): Promise<void> {
    return this.migrationService.runMigrations();
  }
}
