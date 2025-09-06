import { inject, injectable } from "inversify";
import {
  IFoodItem,
  ILogEntryWithFoodItem,
  IScannerService,
  ISummaryRepository,
  ISummaryService,
} from "../interfaces";
import { TYPES } from "../types";

@injectable()
export class SummaryService implements ISummaryService {
  constructor(
    @inject(TYPES.ISummaryRepository)
    private summaryRepository: ISummaryRepository,
    @inject(TYPES.IScannerService) private scannerService: IScannerService
  ) {}

  async getLogEntryById(
    id: number,
    timestamp: string
  ): Promise<ILogEntryWithFoodItem | null> {
    const date = new Date(parseInt(timestamp)); // Parse timestamp to Date object
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return this.summaryRepository.getLogEntryById(id, startDate, endDate);
  }

  async getLoggedFoodItems(
    startDate: string
  ): Promise<ILogEntryWithFoodItem[]> {
    return this.summaryRepository.getLoggedFoodItems(startDate);
  }

  async deleteLogEntry(id: number): Promise<void> {
    return this.summaryRepository.deleteLogEntry(id);
  }

  async getQuickAddFoodItems(is_quick_add: number = 1): Promise<IFoodItem[]> {
    return this.summaryRepository.getQuickAddFoodItems(is_quick_add);
  }

  async getFoodItemById(id: number): Promise<IFoodItem | null> {
    return this.summaryRepository.getFoodItemById(id);
  }

  async getFoodItemByEanId(ean_id: string): Promise<IFoodItem | null> {
    return this.summaryRepository.getFoodItemByEanId(ean_id);
  }

  async processScannedEan(ean_id: string): Promise<number> {
    const existingFoodItem = await this.summaryRepository.getFoodItemByEanId(
      ean_id
    );
    if (existingFoodItem) {
      if (existingFoodItem.id === undefined) {
        throw new Error("Existing food item ID is undefined.");
      }
      return existingFoodItem.id;
    } else {
      const newFoodItemId = await this.scannerService.insertScanned(ean_id);
      return newFoodItemId;
    }
  }
}
