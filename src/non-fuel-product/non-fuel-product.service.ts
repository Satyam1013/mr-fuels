import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NonFuelProduct } from "./non-fuel-product.schema";
import { CreateNonFuelProductDto } from "./non-fuel-product.dto";

@Injectable()
export class NonFuelProductService {
  constructor(
    @InjectModel(NonFuelProduct.name)
    private nonFuelModel: Model<NonFuelProduct>,
  ) {}

  async addProducts(adminId: string, dtos: CreateNonFuelProductDto[]) {
    const productsToSave = dtos.map((dto) => ({
      ...dto,
      adminId: new Types.ObjectId(adminId),
    }));

    return this.nonFuelModel.insertMany(productsToSave);
  }

  async getProducts(adminId: string) {
    return this.nonFuelModel.find({ adminId: new Types.ObjectId(adminId) });
  }

  async deleteProduct(productId: string) {
    return this.nonFuelModel.findByIdAndDelete(productId);
  }
}
