import { Container } from "inversify";
import "reflect-metadata";
import { LlamaController } from "./llama/llama.controller";
import { ILlamaController, ILlamaService } from "./llama/llama.interface";
import { LlamaService } from "./llama/llama.service";
import { MigrationController } from "./migrations/migration.controller";
import {
  IMigrationController,
  IMigrationRepository,
  IMigrationService,
} from "./migrations/migration.interface";
import { MigrationRepository } from "./migrations/migration.repository";
import { MigrationService } from "./migrations/migration.service";
import { ProfileController } from "./profiles/profile.controller";
import {
  IProfileController,
  IProfileRepository,
  IProfileService,
} from "./profiles/profile.interface";
import { ProfileRepository } from "./profiles/profile.repository";
import { ProfileService } from "./profiles/profile.service";
import { ScannerController } from "./scanner/scanner.controller";
import {
  IScannerController,
  IScannerRepository,
  IScannerService,
} from "./scanner/scanner.interface";
import { ScannerRepository } from "./scanner/scanner.repository";
import { ScannerService } from "./scanner/scanner.service";
import { SummaryController } from "./summary/summary.controller";
import {
  ISummaryController,
  ISummaryRepository,
  ISummaryService,
} from "./summary/summary.interface";
import { SummaryRepository } from "./summary/summary.repository";
import { SummaryService } from "./summary/summary.service";
import { TYPES } from "./types";

const container = new Container();

container
  .bind<IScannerController>(TYPES.IScannerController)
  .to(ScannerController);
container
  .bind<IScannerRepository>(TYPES.IScannerRepository)
  .to(ScannerRepository);
container.bind<IScannerService>(TYPES.IScannerService).to(ScannerService);

container
  .bind<ISummaryController>(TYPES.ISummaryController)
  .to(SummaryController);
container
  .bind<ISummaryRepository>(TYPES.ISummaryRepository)
  .to(SummaryRepository);
container.bind<ISummaryService>(TYPES.ISummaryService).to(SummaryService);

container
  .bind<IMigrationController>(TYPES.IMigrationController)
  .to(MigrationController);
container
  .bind<IMigrationRepository>(TYPES.IMigrationRepository)
  .to(MigrationRepository);
container.bind<IMigrationService>(TYPES.IMigrationService).to(MigrationService);

container
  .bind<IProfileController>(TYPES.IProfileController)
  .to(ProfileController);
container
  .bind<IProfileRepository>(TYPES.IProfileRepository)
  .to(ProfileRepository);
container.bind<IProfileService>(TYPES.IProfileService).to(ProfileService);

container
  .bind<ILlamaService>(TYPES.ILlamaService)
  .to(LlamaService)
  .inSingletonScope();
container.bind<ILlamaController>(TYPES.ILlamaController).to(LlamaController);

export { container };
