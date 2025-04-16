import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument, UserRole } from "./user.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User> & { role: UserRole }) {
    const existing = await this.userModel.findOne({
      username: userData.username,
    });
    if (existing) throw new ConflictException("Username already exists");

    if (!userData.password) {
      throw new ConflictException("Password is required");
    }
    const hashed = await bcrypt.hash(userData.password, 10);
    const newUser = new this.userModel({ ...userData, password: hashed });
    return newUser.save();
  }

  async update(id: string, updates: Partial<User>) {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await this.userModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async delete(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException("User not found");
    return { message: "User deleted" };
  }

  async findAllByRole(role: UserRole) {
    return this.userModel.find({ role });
  }
}
