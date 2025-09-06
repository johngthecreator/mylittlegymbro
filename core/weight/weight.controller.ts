import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IWeightController, IWeightService } from "./weight.interface";

@injectable()
export class WeightController implements IWeightController {
  constructor(
    @inject(TYPES.IWeightService) private weightService: IWeightService
  ) {}
}
