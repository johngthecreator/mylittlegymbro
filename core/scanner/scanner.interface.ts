import { IFoodItem, ILogEntry } from "../interfaces";

export interface IScannerController {
  quickAddFoodItem(
    foodItem: IFoodItem,
    log_serving: number,
    date: string
  ): Promise<void>;
  insertScanned(ean_id: string): Promise<number>;
  updateFoodItem(foodItem: IFoodItem, id: number): Promise<void>;
  logFoodItem(
    food_item_id: number,
    serving_amount: number,
    is_unit: boolean,
    serving_quantity: number
  ): Promise<void>;
  searchFoodItems(
    searchTerm: string,
    limit: number,
    offset: number
  ): Promise<IFoodItem[]>;
}

export interface IScannerService {
  insertQuickAdd(
    foodItem: IFoodItem,
    log_serving: number,
    date: string
  ): Promise<void>;
  insertScanned(ean_id: string): Promise<number>;
  updateFoodItem(foodItem: IFoodItem, id: number): Promise<void>;
  insertLogEntry(logEntry: ILogEntry): Promise<void>;
  searchFoodItems(
    searchTerm: string,
    limit: number,
    offset: number
  ): Promise<IFoodItem[]>;
}

export interface IScannerRepository {
  insertFoodItem(foodItem: IFoodItem): Promise<number>;
  insertLogEntry(foodItem: ILogEntry): Promise<void>;
  updateFoodItem(foodItem: IFoodItem, id: number): Promise<void>;
  searchFoodItems(
    searchTerm: string,
    limit: number,
    offset: number
  ): Promise<IFoodItem[]>;
}
