import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { IGreetingController, IGreetingService } from "./interfaces";

@injectable()
export class GreetingController implements IGreetingController {
	constructor(@inject(TYPES.IGreetingService) private greetingService: IGreetingService) { }

	getGreeting() {
		return this.greetingService.greet();
	}
}
