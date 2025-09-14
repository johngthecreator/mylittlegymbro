import { inject, injectable } from "inversify";
import { ICreateFoodItem, IFoodItem, ILogEntry } from "../interfaces";
import { TYPES } from "../types";
import { IScannerController, IScannerService } from "./scanner.interface";

@injectable()
export class ScannerController implements IScannerController {
  constructor(
    @inject(TYPES.IScannerService) private scannerService: IScannerService
  ) {}
  quickAddFoodItem(
    foodItem: ICreateFoodItem,
    profileId: number,
    log_serving: number,
    date: string
  ): Promise<void> {
    return this.scannerService.insertQuickAdd(
      foodItem,
      profileId,
      log_serving,
      date
    );
  }

  insertScanned(ean_id: string): Promise<number> {
    return this.scannerService.insertScanned(ean_id);
  }

  async updateFoodItem(foodItem: IFoodItem, id: number): Promise<void> {
    return this.scannerService.updateFoodItem(foodItem, id);
  }

  async logFoodItem(
    food_item_id: number,
    profileId: number,
    serving_amount: number,
    is_unit: boolean,
    serving_quantity: number
  ): Promise<void> {
    const logEntry: ILogEntry = {
      food_item_id: food_item_id,
      date: new Date().toISOString(),
      log_serving: is_unit ? serving_amount / serving_quantity : serving_amount,
      profile_id: profileId,
    };
    return this.scannerService.insertLogEntry(logEntry);
  }

  async searchFoodItems(
    searchTerm: string,
    limit: number,
    offset: number
  ): Promise<IFoodItem[]> {
    return this.scannerService.searchFoodItems(searchTerm, limit, offset);
  }
}
