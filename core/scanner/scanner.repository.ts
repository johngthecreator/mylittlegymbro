import { SQLiteDatabase } from "expo-sqlite";
import { inject, injectable } from "inversify";
import { IFoodItem, ILogEntry } from "../interfaces";
import { TYPES } from "../types";
import { IScannerRepository } from "./scanner.interface";

@injectable()
export class ScannerRepository implements IScannerRepository {
  constructor(@inject(TYPES.SQLiteDatabase) private db: SQLiteDatabase) {}
  async insertFoodItem(foodItem: IFoodItem): Promise<number> {
    const result = await this.db.runAsync(
      "INSERT INTO food_items (ean_id,name,brand,image_url,calories,g_protein,g_carbs,g_fats,g_fiber,serving_quantity,serving_unit,is_quick_add) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        foodItem.ean_id || "",
        foodItem.name,
        foodItem.brand || "",
        foodItem.image_url || "",
        foodItem.calories,
        foodItem.g_protein,
        foodItem.g_carbs,
        foodItem.g_fats,
        foodItem.g_fiber || 0,
        foodItem.serving_quantity || 0,
        foodItem.serving_unit || "",
        foodItem.is_quick_add || false,
      ]
    );
    console.log("Food item inserted: ", foodItem);
    return result.lastInsertRowId;
  }
  async insertLogEntry(logItem: ILogEntry): Promise<void> {
    const result = await this.db.runAsync(
      "INSERT INTO log_entries (food_item_id,log_serving, date, profile_id) VALUES (?,?,?,?)",
      [
        logItem.food_item_id,
        logItem.log_serving,
        logItem.date,
        logItem.profile_id,
      ]
    );
    console.log("Log entry inserted: ", result.lastInsertRowId);
    return Promise.resolve();
  }

  async updateFoodItem(foodItem: IFoodItem, id: number): Promise<void> {
    await this.db.runAsync(
      "UPDATE food_items SET name = ?, brand = ?, calories = ?, g_protein = ?, g_carbs = ?, g_fats = ?, g_fiber = ?, serving_quantity = ?, serving_unit = ? WHERE id = ?",
      [
        foodItem.name,
        foodItem.brand || "",
        foodItem.calories,
        foodItem.g_protein,
        foodItem.g_carbs,
        foodItem.g_fats,
        foodItem.g_fiber || 0,
        foodItem.serving_quantity || 0,
        foodItem.serving_unit || "",
        id,
      ]
    );
    return Promise.resolve();
  }

  async searchFoodItems(
    searchTerm: string,
    limit: number,
    offset: number
  ): Promise<IFoodItem[]> {
    const results = await this.db.getAllAsync<IFoodItem>(
      "SELECT * FROM food_items WHERE name LIKE ? OR brand LIKE ? ORDER BY id LIMIT ? OFFSET ?",
      [`%${searchTerm}%`, `%${searchTerm}%`, limit, offset]
    );
    return results;
  }
}
