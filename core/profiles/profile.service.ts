import { inject, injectable } from "inversify";
import { IProfile } from "../interfaces";
import { TYPES } from "../types";
import {
  ICreateProfileDto,
  IProfileRepository,
  IProfileService,
} from "./profile.interface";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.IProfileRepository)
    private profileRepository: IProfileRepository
  ) {}

  async getProfiles(): Promise<IProfile[]> {
    return this.profileRepository.getProfiles();
  }

  async getProfileById(id: number): Promise<IProfile | undefined> {
    return this.profileRepository.getProfileById(id);
  }

  async setActiveProfile(id: number): Promise<void> {
    await this.profileRepository.setActiveProfile(id);
  }

  async getActiveProfile(): Promise<IProfile | undefined> {
    return this.profileRepository.getActiveProfile();
  }

  async createProfile(profile: ICreateProfileDto): Promise<IProfile> {
    return this.profileRepository.createProfile(profile);
  }

  async updateProfile(
    id: number,
    profile: ICreateProfileDto
  ): Promise<IProfile> {
    return this.profileRepository.updateProfile(id, profile);
  }

  async deleteProfile(id: number): Promise<void> {
    await this.profileRepository.deleteProfile(id);
  }
}
