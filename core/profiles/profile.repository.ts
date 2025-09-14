import { SQLiteDatabase } from "expo-sqlite";
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
    await this.db.runAsync("UPDATE profiles SET is_active = 0");
    await this.db.runAsync("UPDATE profiles SET is_active = 1 WHERE id = ?", [
      id,
    ]);
  }

  async getActiveProfile(): Promise<IProfile | undefined> {
    const profile = await this.db.getFirstAsync<IProfile>(
      "SELECT * FROM profiles WHERE is_active = 1"
    );
    return profile || undefined;
  }

  async createProfile(profile: ICreateProfileDto): Promise<IProfile> {
    const result = await this.db.runAsync(
      "INSERT INTO profiles (name, is_active) VALUES (?, 0)",
      [profile.name]
    );
    const newProfileId = result.lastInsertRowId;
    const newProfile = await this.getProfileById(newProfileId);
    if (!newProfile) {
      throw new Error("Failed to create profile");
    }
    return newProfile;
  }
}
