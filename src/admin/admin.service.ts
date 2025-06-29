/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "src/user/user.schema";

@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userData: any) {
    try {
      if (!userData.password) {
        throw new Error("Password is required");
      }
      const hashed = await bcrypt.hash(userData.password, 10);
      const newUser = new this.userModel({ ...userData, password: hashed });

      return await newUser.save();
    } catch (error) {
      console.error("Error in createUser:", error);
      throw new InternalServerErrorException("Failed to create user");
    }
  }

  async updateUser(id: string, updates: any) {
    try {
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
      return await this.userModel.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw new InternalServerErrorException("Failed to update user");
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error in deleteUser:", error);
      throw new InternalServerErrorException("Failed to delete user");
    }
  }
}
