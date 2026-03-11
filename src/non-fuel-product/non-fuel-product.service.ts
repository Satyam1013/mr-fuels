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

  async create(adminId: string, products: NonFuelProductDto[]) {
    const data = products.map((p) => ({
      ...p,
      adminId: new Types.ObjectId(adminId),
    }));

    return this.nonFuelProductModel.insertMany(data);
  }

  async getAll(adminId: string) {
    return this.nonFuelProductModel.find({
      adminId: new Types.ObjectId(adminId),
    });
  }

  async update(adminId: string, id: string, dto: NonFuelProductDto) {
    const product = await this.nonFuelProductModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        adminId: new Types.ObjectId(adminId),
      },
      dto,
      { new: true },
    );

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async delete(adminId: string, id: string) {
    const product = await this.nonFuelProductModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      adminId: new Types.ObjectId(adminId),
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return { message: "Product deleted successfully" };
  }
}
