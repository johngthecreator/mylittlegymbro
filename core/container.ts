import { Container } from "inversify";
import "reflect-metadata";
import { InsertController } from "./insert/insert.controller";
import {
  IInsertController,
  IInsertRepository,
  IInsertService,
} from "./insert/insert.interface";
import { InsertRepository } from "./insert/insert.repository";
import { InsertService } from "./insert/insert.service";
import { TYPES } from "./types";

const container = new Container();

container.bind<IInsertController>(TYPES.IInsertController).to(InsertController);
container.bind<IInsertRepository>(TYPES.IInsertRepository).to(InsertRepository);
container.bind<IInsertService>(TYPES.IInsertService).to(InsertService);

export { container };
