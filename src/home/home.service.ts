import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Home } from "./home.schema";
import { CreateHomeDto } from "./home.dto";

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Home.name) private readonly homeModel: Model<Home>,
  ) {}

  async create(data: CreateHomeDto) {
    return this.homeModel.create(data);
  }

  async findAll() {
    const result = await this.homeModel.find().sort({ createdAt: -1 });
    return result.length > 0 ? result : 0;
  }
}
