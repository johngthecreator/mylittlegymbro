import { IFoodItem, ILogEntryWithFoodItem } from "../interfaces";

export interface ISummaryController {
  getLogEntryById(
    id: number,
    timestamp: string
  ): Promise<ILogEntryWithFoodItem | null>;
  getLoggedFoodItems(startDate: string): Promise<ILogEntryWithFoodItem[]>;
  deleteLogEntry(id: number): Promise<void>;
  getQuickAddFoodItems(is_quick_add: number): Promise<IFoodItem[]>;
  getFoodItemById(id: number): Promise<IFoodItem | null>;
  getFoodItemByEanId(ean_id: string): Promise<IFoodItem | null>;
  processScannedEan(ean_id: string): Promise<number>;
}
export interface ISummaryService {
  getLogEntryById(
    id: number,
    timestamp: string
  ): Promise<ILogEntryWithFoodItem | null>;
  getLoggedFoodItems(startDate: string): Promise<ILogEntryWithFoodItem[]>;
  deleteLogEntry(id: number): Promise<void>;
  getQuickAddFoodItems(is_quick_add: number): Promise<IFoodItem[]>;
  getFoodItemById(id: number): Promise<IFoodItem | null>;
  getFoodItemByEanId(ean_id: string): Promise<IFoodItem | null>;
  processScannedEan(ean_id: string): Promise<number>;
}
export interface ISummaryRepository {
  getLogEntryById(
    id: number,
    startDate: string,
    endDate: string
  ): Promise<ILogEntryWithFoodItem | null>;
  getLoggedFoodItems(startDate: string): Promise<ILogEntryWithFoodItem[]>;
  deleteLogEntry(id: number): Promise<void>;
  getQuickAddFoodItems(is_quick_add: number): Promise<IFoodItem[]>;
  getFoodItemById(id: number): Promise<IFoodItem | null>;
  getFoodItemByEanId(ean_id: string): Promise<IFoodItem | null>;
}
