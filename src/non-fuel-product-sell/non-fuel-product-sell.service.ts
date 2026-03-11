import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NonFuelSellProduct } from "./non-fuel-product-sell.schema";
import { CreateNonFuelSellProductDto } from "./non-fuel-product-sell.dto";

@Injectable()
export class NonFuelProductSellService {
  constructor(
    @InjectModel(NonFuelSellProduct.name)
    private nonFuelSellModel: Model<NonFuelSellProduct>,
  ) {}

  async addProducts(adminId: string, dtos: CreateNonFuelSellProductDto[]) {
    try {
      const productsToSave = dtos.map((dto) => ({
        ...dto,
        adminId: new Types.ObjectId(adminId),
        machineId: new Types.ObjectId(dto.machineId),
      }));

      return this.nonFuelSellModel.insertMany(productsToSave);
    } catch {
      throw new Error("Error adding non-fuel products");
    }
  }

  async getProducts(adminId: string) {
    return this.nonFuelSellModel.find({ adminId: new Types.ObjectId(adminId) });
  }

  async deleteProduct(productId: string) {
    return this.nonFuelSellModel.findByIdAndDelete(productId);
  }
}
