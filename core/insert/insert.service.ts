import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import {
  IFoodItem,
  IInsertRepository,
  IInsertService,
} from "./insert.interface";

@injectable()
export class InsertService implements IInsertService {
  constructor(
    @inject(TYPES.IInsertRepository) private insertRepository: IInsertRepository
  ) {}

  async insertQuickAdd(
    foodItem: IFoodItem,
    log_serving: number,
    date: string
  ): Promise<void> {
    const foodItemId = await this.insertRepository.insertFoodItem({
      ...foodItem,
      brand: "Quick Add",
    });
    console.log("Food item id: ", foodItemId);
    return this.insertRepository.insertLogEntry({
      food_item_id: foodItemId,
      log_serving: log_serving,
      date: date,
    });
  }
}
