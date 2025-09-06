import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IWeightRepository, IWeightService } from "./weight.interface";

@injectable()
export class WeightService implements IWeightService {
  constructor(
    @inject(TYPES.IWeightRepository) private weightRepository: IWeightRepository
  ) {}
}
