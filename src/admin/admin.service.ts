import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument, UserRole } from "src/user/user.schema";

@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userData: Partial<User>) {
    if (!userData.password) {
      throw new Error("Password is required");
    }
    const hashed = await bcrypt.hash(userData.password, 10);
    const newUser = new this.userModel({ ...userData, password: hashed });
    return newUser.save();
  }

  async updateUser(id: string, updates: Partial<User>) {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    return this.userModel.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async findAllUsersByRole(role: string) {
    if (!(role in UserRole)) {
      throw new Error("Invalid role");
    }
    return this.userModel.find({ role });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }
}
