import { inject, injectable } from "inversify";
import { IFoodItem, ILogEntryWithFoodItem } from "../interfaces";
import { TYPES } from "../types";
import { ISummaryController, ISummaryService } from "./summary.interface";

@injectable()
export class SummaryController implements ISummaryController {
  constructor(
    @inject(TYPES.ISummaryService) private summaryService: ISummaryService
  ) {}

  getLogEntryById(
    id: number,
    timestamp: string
  ): Promise<ILogEntryWithFoodItem | null> {
    return this.summaryService.getLogEntryById(id, timestamp);
  }

  async getLoggedFoodItems(
    startDate: string,
    profileId: number
  ): Promise<ILogEntryWithFoodItem[]> {
    return this.summaryService.getLoggedFoodItems(startDate, profileId);
  }

  async deleteLogEntry(id: number): Promise<void> {
    return this.summaryService.deleteLogEntry(id);
  }

  async getQuickAddFoodItems(is_quick_add: number = 1): Promise<IFoodItem[]> {
    return this.summaryService.getQuickAddFoodItems(is_quick_add);
  }

  async getFoodItemById(id: number): Promise<IFoodItem | null> {
    return this.summaryService.getFoodItemById(id);
  }

  async getFoodItemByEanId(ean_id: string): Promise<IFoodItem | null> {
    return this.summaryService.getFoodItemByEanId(ean_id);
  }

  async processScannedEan(ean_id: string): Promise<number> {
    return this.summaryService.processScannedEan(ean_id);
  }
}
