import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import {
  IFoodItem,
  IInsertController,
  IInsertService,
} from "./insert.interface";

@injectable()
export class InsertController implements IInsertController {
  constructor(
    @inject(TYPES.IInsertService) private insertService: IInsertService
  ) {}
  quickAddFoodItem(
    foodItem: IFoodItem,
    log_serving: number,
    date: string
  ): Promise<void> {
    return this.insertService.insertQuickAdd(foodItem, log_serving, date);
  }
}
