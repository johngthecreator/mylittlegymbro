import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import {
  IFoodItem,
  IInsertRepository,
  IInsertService,
  ILogEntryWithFoodItem,
} from "./insert.interface";

interface Nutriments {
  "energy-kcal": number; // in kcal [cite: 78]
  proteins: number; // in grams [cite: 80]
  carbohydrates: number; // in grams [cite: 77]
  fat: number; // in grams [cite: 78]
  fiber: number; // in grams [cite: 79]
  sodium: number; // in milligrams [cite: 81]
}

interface Product {
  brands: string; // The brand name of the product [cite: 3]
  product_name: string; // The name of the product [cite: 107]
  image_small_url: string;
  nutriments: Nutriments; // Nested object containing nutritional facts
  serving_quantity: number;
  serving_quantity_unit: string;
}

interface FoodDataResponse {
  product: Product;
}

@injectable()
export class InsertService implements IInsertService {
  constructor(
    @inject(TYPES.IInsertRepository) private insertRepository: IInsertRepository
  ) {}

  async insertQuickAdd(
    foodItem: IFoodItem,
    log_serving: number,
    date: string
  ): Promise<void> {
    const foodItemId = await this.insertRepository.insertFoodItem({
      ...foodItem,
      brand: "Quick Add",
    });
    console.log("Food item id: ", foodItemId);
    return this.insertRepository.insertLogEntry({
      food_item_id: foodItemId,
      log_serving: log_serving,
      date: date,
    });
  }
  async insertScanned(ean_id: string): Promise<number> {
    const url = `https://world.openfoodfacts.org/api/v2/product/${ean_id}.json`;
    console.log("From the service" + url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        UserAgent: "GramScaleApp/0.1 (johngorriceta1@gmail.com)",
        Authorization: "Basic " + btoa("off:off"),
      },
    });
    const respData: FoodDataResponse = await response.json();
    const result = await this.insertRepository.insertFoodItem({
      ean_id: ean_id,
      name: respData.product.product_name,
      brand: respData.product.brands,
      image_url: respData.product.image_small_url,
      calories: Math.round(respData.product.nutriments["energy-kcal"]),
      g_protein: Math.round(respData.product.nutriments.proteins),
      g_carbs: Math.round(respData.product.nutriments.carbohydrates),
      g_fats: Math.round(respData.product.nutriments.fat),
      g_fiber: Math.round(respData.product.nutriments.fiber),
      g_sodium: Math.round(respData.product.nutriments.sodium),
      serving_quantity: Math.round(respData.product.serving_quantity),
      serving_unit: respData.product.serving_quantity_unit,
    });
    return result;
  }

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
    return this.insertRepository.getLogEntryById(id, startDate, endDate);
  }
}
