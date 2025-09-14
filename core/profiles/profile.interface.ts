import { IProfile } from "../interfaces";

export interface ICreateProfileDto {
  name: string;
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
