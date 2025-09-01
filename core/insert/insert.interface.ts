export interface IFoodItem {
  ean_id?: string;
  name: string;
  brand?: string;
  image_url?: string;
  calories: number;
  g_protein: number;
  g_carbs: number;
  g_fats: number;
  g_fiber?: number;
  g_sodium?: number;
  serving_quantity?: number;
  serving_unit?: string;
  is_quick_add?: boolean;
}

export interface ILogEntry {
  food_item_id: number;
  log_serving: number;
  date: string;
}

export interface IInsertController {
  quickAddFoodItem(
    foodItem: IFoodItem,
    log_serving: number,
    date: string
  ): Promise<void>;
}

export interface IInsertService {
  insertQuickAdd(
    foodItem: IFoodItem,
    log_serving: number,
    date: string
  ): Promise<void>;
}

export interface IInsertRepository {
  insertFoodItem(foodItem: IFoodItem): Promise<number>;
  insertLogEntry(foodItem: ILogEntry): Promise<void>;
}
