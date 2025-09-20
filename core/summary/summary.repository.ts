import { SQLiteDatabase } from "expo-sqlite";
import { inject, injectable } from "inversify";
import { IFoodItem, ILogEntryWithFoodItem } from "../interfaces";
import { TYPES } from "../types";
import { ISummaryRepository } from "./summary.interface";

@injectable()
export class SummaryRepository implements ISummaryRepository {
  constructor(@inject(TYPES.SQLiteDatabase) private db: SQLiteDatabase) {}
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
        fi.serving_quantity,
        fi.serving_unit,
        fi.is_quick_add
      FROM log_entries le
      JOIN food_items fi ON le.food_item_id = fi.id
      WHERE le.id = ? AND le.date BETWEEN ? AND ?;`,
      [id, startDate, endDate]
    );
  }

  async getLoggedFoodItems(
    startDate: string,
    profileId: number
  ): Promise<ILogEntryWithFoodItem[]> {
    return await this.db.getAllAsync<ILogEntryWithFoodItem>(
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
        fi.serving_quantity,
        fi.serving_unit,
        fi.is_quick_add
      FROM log_entries le
      JOIN food_items fi ON le.food_item_id = fi.id
      WHERE le.date > ? AND le.profile_id = ? ORDER BY le.date DESC;`,
      [startDate, profileId]
    );
  }

  async deleteLogEntry(id: number): Promise<void> {
    await this.db.runAsync("DELETE FROM log_entries WHERE id = ?", [id]);
    return Promise.resolve();
  }

  async getQuickAddFoodItems(is_quick_add: number = 1): Promise<IFoodItem[]> {
    return await this.db.getAllAsync<IFoodItem>(
      "SELECT * FROM food_items WHERE is_quick_add = ?",
      [is_quick_add]
    );
  }

  async getFoodItemById(id: number): Promise<IFoodItem | null> {
    return await this.db.getFirstAsync<IFoodItem>(
      "SELECT * FROM food_items WHERE id = ?",
      [id]
    );
  }
  async getFoodItemByEanId(ean_id: string): Promise<IFoodItem | null> {
    return await this.db.getFirstAsync<IFoodItem>(
      "SELECT * FROM food_items WHERE ean_id = ?",
      [ean_id]
    );
  }
}
