import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NonFuelProducts } from "./non-fuel-product.schema";
import { CreateNonFuelProductsDto } from "./non-fuel-product.dto";

@Injectable()
export class NonFuelProductsService {
  constructor(
    @InjectModel(NonFuelProducts.name)
    private nonFuelModel: Model<NonFuelProducts>,
  ) {}

  async create(adminId: string, dto: CreateNonFuelProductsDto) {
    const data = new this.nonFuelModel({
      adminId: new Types.ObjectId(adminId),
      nonFuelProducts: dto.nonFuelProducts,
    });

    return data.save();
  }

  async getAll(adminId: string) {
    return this.nonFuelModel.find({
      adminId: new Types.ObjectId(adminId),
    });
  }
}
