import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NonFuelProducts } from "./non-fuel-product.schema";
import { NonFuelProductDto } from "./non-fuel-product.dto";

@Injectable()
export class NonFuelProductsService {
  constructor(
    @InjectModel(NonFuelProducts.name)
    private nonFuelProductModel: Model<NonFuelProducts>,
  ) {}

  async create(adminId: Types.ObjectId, products: NonFuelProductDto[]) {
    const data = products.map((p) => ({
      ...p,
      adminId,
    }));

    return this.nonFuelProductModel.insertMany(data);
  }

  async getAll(adminId: Types.ObjectId) {
    return this.nonFuelProductModel.find({
      adminId,
    });
  }

  async update(adminId: Types.ObjectId, id: string, dto: NonFuelProductDto) {
    const product = await this.nonFuelProductModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        adminId,
      },
      dto,
      { new: true },
    );

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async delete(adminId: Types.ObjectId, id: string) {
    const product = await this.nonFuelProductModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return { message: "Product deleted successfully" };
  }
}
