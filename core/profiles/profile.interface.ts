import { IProfile } from "../interfaces";

export interface IProfileRepository {
  getProfiles(): Promise<IProfile[]>;
  getProfileById(id: number): Promise<IProfile | undefined>;
  setActiveProfile(id: number): Promise<void>;
  getActiveProfile(): Promise<IProfile | undefined>;
}

export interface IProfileService {
  getProfiles(): Promise<IProfile[]>;
  getProfileById(id: number): Promise<IProfile | undefined>;
  setActiveProfile(id: number): Promise<void>;
  getActiveProfile(): Promise<IProfile | undefined>;
}

export interface IProfileController {
  getProfiles(): Promise<IProfile[]>;
  getProfileById(id: number): Promise<IProfile | undefined>;
  setActiveProfile(id: number): Promise<void>;
  getActiveProfile(): Promise<IProfile | undefined>;
}
