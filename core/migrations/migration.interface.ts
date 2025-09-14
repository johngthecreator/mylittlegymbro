export interface IMigrationController {
  runMigrations(): Promise<void>;
}

export interface IMigrationService {
  runMigrations(): Promise<void>;
}

export interface IMigrationRepository {
  init(): Promise<void>;
  runMigrations(migrations: string[]): Promise<void>;
}
