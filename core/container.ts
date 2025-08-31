import "reflect-metadata";
import { Container } from "inversify";
import { GreetingService } from "./GreetingService";
import { GreetingController } from "./GreetingController";
import { TYPES } from "./types";
import { IGreetingController, IGreetingService } from "./interfaces";

const container = new Container();

container.bind<IGreetingService>(TYPES.IGreetingService).to(GreetingService);
container.bind<IGreetingController>(TYPES.IGreetingController).to(GreetingController);

export { container };
