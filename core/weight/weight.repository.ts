import { injectable } from "inversify";
import { IWeightRepository } from "./weight.interface";

@injectable()
export class WeightRepository implements IWeightRepository {}
