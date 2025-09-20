import { IProfile } from "../interfaces";

export interface ICreateProfileDto {
  name: string;
  background: string;
  calorie_goal: number;
  protein_goal: number;
  fat_goal: number;
  carb_goal: number;
}

export interface IProfileRepository {
  getProfiles(): Promise<IProfile[]>;
  getProfileById(id: number): Promise<IProfile | undefined>;
  setActiveProfile(id: number): Promise<void>;
  getActiveProfile(): Promise<IProfile | undefined>;
  createProfile(profile: ICreateProfileDto): Promise<IProfile>;
}

export interface IProfileService {
  getProfiles(): Promise<IProfile[]>;
  getProfileById(id: number): Promise<IProfile | undefined>;
  setActiveProfile(id: number): Promise<void>;
  getActiveProfile(): Promise<IProfile | undefined>;
  createProfile(profile: ICreateProfileDto): Promise<IProfile>;
}

export interface IProfileController {
  getProfiles(): Promise<IProfile[]>;
  getProfileById(id: number): Promise<IProfile | undefined>;
  setActiveProfile(id: number): Promise<void>;
  getActiveProfile(): Promise<IProfile | undefined>;
  createProfile(profile: ICreateProfileDto): Promise<IProfile>;
}
