import { injectable } from "inversify";
import { IGreetingService } from "./interfaces";

@injectable()
export class GreetingService implements IGreetingService {
	greet() {
		return "Hello from the GreetingService!";
	}
}
