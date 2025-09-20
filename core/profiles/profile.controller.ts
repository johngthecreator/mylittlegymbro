import { inject, injectable } from "inversify";
import { IProfile } from "../interfaces";
import { TYPES } from "../types";
import {
  ICreateProfileDto,
  IProfileController,
  IProfileService,
} from "./profile.interface";

@injectable()
export class ProfileController implements IProfileController {
  constructor(
    @inject(TYPES.IProfileService)
    private profileService: IProfileService
  ) {}

  async getProfiles(): Promise<IProfile[]> {
    return this.profileService.getProfiles();
  }

  async getProfileById(id: number): Promise<IProfile | undefined> {
    return this.profileService.getProfileById(id);
  }

  async setActiveProfile(id: number): Promise<void> {
    await this.profileService.setActiveProfile(id);
  }

  async getActiveProfile(): Promise<IProfile | undefined> {
    return this.profileService.getActiveProfile();
  }

  async createProfile(profile: ICreateProfileDto): Promise<IProfile> {
    return this.profileService.createProfile(profile);
  }

  async updateProfile(
    id: number,
    profile: ICreateProfileDto
  ): Promise<IProfile> {
    return this.profileService.updateProfile(id, profile);
  }

  async deleteProfile(id: number): Promise<void> {
    await this.profileService.deleteProfile(id);
  }
}
