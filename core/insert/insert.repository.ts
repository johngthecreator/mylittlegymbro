import { SQLiteDatabase } from "expo-sqlite";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import {
  IFoodItem,
  IInsertRepository,
  ILogEntry,
  ILogEntryWithFoodItem,
} from "./insert.interface";

@injectable()
export class InsertRepository implements IInsertRepository {
  constructor(@inject(TYPES.SQLiteDatabase) private db: SQLiteDatabase) {}
  async insertFoodItem(foodItem: IFoodItem): Promise<number> {
    const result = await this.db.runAsync(
      "INSERT INTO food_items (ean_id,name,brand,image_url,calories,g_protein,g_carbs,g_fats,g_fiber,g_sodium,serving_quantity,serving_unit,is_quick_add) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
        foodItem.g_sodium || 0,
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
      "INSERT INTO log_entries (food_item_id,log_serving, date) VALUES (?,?,?)",
      [logItem.food_item_id, logItem.log_serving, logItem.date]
    );
    console.log("Log entry inserted: ", result.lastInsertRowId);
    return Promise.resolve();
  }

  async getLogEntryById(
    id: number,
    startDate: string,
    endDate: string
  ): Promise<ILogEntryWithFoodItem | null> {
    return await this.db.getFirstAsync<ILogEntryWithFoodItem>(
      `SELECT
        le.id,
        le.food_item_id,
        le.log_serving,
        le.date,
        fi.ean_id,
        fi.name,
        fi.brand,
        fi.image_url,
        fi.calories,
        fi.g_protein,
        fi.g_carbs,
        fi.g_fats,
        fi.g_fiber,
        fi.g_sodium,
        fi.serving_quantity,
        fi.serving_unit,
        fi.is_quick_add
      FROM log_entries le
      JOIN food_items fi ON le.food_item_id = fi.id
      WHERE le.id = ? AND le.date BETWEEN ? AND ?;`,
      [id, startDate, endDate]
    );
  }
}
