import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import {
  IFoodItem,
  IInsertController,
  IInsertService,
  ILogEntryWithFoodItem,
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

  getLogEntryById(
    id: number,
    timestamp: string
  ): Promise<ILogEntryWithFoodItem | null> {
    return this.insertService.getLogEntryById(id, timestamp);
  }
}
