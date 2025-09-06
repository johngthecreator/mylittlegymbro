import { Container } from "inversify";
import "reflect-metadata";
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
import { WeightController } from "./weight/weight.controller";
import {
  IWeightController,
  IWeightRepository,
  IWeightService,
} from "./weight/weight.interface";
import { WeightRepository } from "./weight/weight.repository";
import { WeightService } from "./weight/weight.service";

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
container.bind<IWeightController>(TYPES.IWeightController).to(WeightController);
container.bind<IWeightRepository>(TYPES.IWeightRepository).to(WeightRepository);
container.bind<IWeightService>(TYPES.IWeightService).to(WeightService);

export { container };
