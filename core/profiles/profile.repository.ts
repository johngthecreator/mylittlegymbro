import { SQLiteDatabase } from "expo-sqlite";
import Storage from "expo-sqlite/kv-store";
import { inject, injectable } from "inversify";
import { IProfile } from "../interfaces";
import { TYPES } from "../types";
import { ICreateProfileDto, IProfileRepository } from "./profile.interface";

@injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(@inject(TYPES.SQLiteDatabase) private db: SQLiteDatabase) {}

  async getProfiles(): Promise<IProfile[]> {
    const profiles = await this.db.getAllAsync<IProfile>(
      "SELECT * FROM profiles"
    );
    return profiles;
  }

  async getProfileById(id: number): Promise<IProfile | undefined> {
    const profile = await this.db.getFirstAsync<IProfile>(
      "SELECT * FROM profiles WHERE id = ?",
      [id]
    );
    return profile || undefined;
  }

  async setActiveProfile(id: number): Promise<void> {
    await Storage.setItem("activeProfileId", JSON.stringify(id));
  }

  async getActiveProfile(): Promise<IProfile | undefined> {
    const activeProfileId = await Storage.getItem("activeProfileId");
    if (activeProfileId) {
      return this.getProfileById(JSON.parse(activeProfileId));
    }
    return undefined;
  }

  async createProfile(profile: ICreateProfileDto): Promise<IProfile> {
    const result = await this.db.runAsync(
      "INSERT INTO profiles (name, background, calorie_goal, protein_goal, fat_goal, carb_goal) VALUES (?,?,?,?,?,?)",
      [
        profile.name,
        profile.background,
        profile.calorie_goal,
        profile.protein_goal,
        profile.fat_goal,
        profile.carb_goal,
      ]
    );
    const newProfileId = result.lastInsertRowId;
    const newProfile = await this.getProfileById(newProfileId);
    if (!newProfile) {
      throw new Error("Failed to create profile");
    }
    return newProfile;
  }

  async editProfile(profile: ICreateProfileDto): Promise<IProfile> {
    const result = await this.db.runAsync(
      "UPDATE profiles SET name = (?), background = (?), calorie_goal = (?), protein_goal = (?), fat_goal = (?), carb_goal = (?) WHERE id = ?",
      [
        profile.name,
        profile.background,
        profile.calorie_goal,
        profile.protein_goal,
        profile.fat_goal,
        profile.carb_goal,
      ]
    );
    const newProfileId = result.lastInsertRowId;
    const newProfile = await this.getProfileById(newProfileId);
    if (!newProfile) {
      throw new Error("Failed to create profile");
    }
    return newProfile;
  }
}
