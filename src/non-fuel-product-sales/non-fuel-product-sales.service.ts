import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NonFuelSellProduct } from "./non-fuel-product-sales.schema";
import { CreateNonFuelSellProductDto } from "./non-fuel-product-sales.dto";
import { Machine } from "../machines/machines.schema";
import { NonFuelProducts } from "../non-fuel-product/non-fuel-product.schema";

@Injectable()
export class NonFuelProductSellService {
  constructor(
    @InjectModel(NonFuelSellProduct.name)
    private nonFuelSellModel: Model<NonFuelSellProduct>,

    @InjectModel(Machine.name)
    private machineModel: Model<Machine>,

    @InjectModel(NonFuelProducts.name)
    private nonFuelProductsModel: Model<NonFuelProducts>,
  ) {}

  async addProducts(adminId: string, dtos: CreateNonFuelSellProductDto[]) {
    const objectAdminId = new Types.ObjectId(adminId);

    try {
      for (const dto of dtos) {
        const machineId = new Types.ObjectId(dto.machineId);
        const productId = new Types.ObjectId(dto.productId);

        const machine = await this.machineModel.findOne({
          _id: machineId,
          adminId: objectAdminId,
        });

        if (!machine) {
          throw new Error("Machine not found for this admin");
        }

        const product = await this.nonFuelProductsModel.findOne({
          _id: productId,
          adminId: objectAdminId,
        });

        if (!product) {
          throw new Error("Product not found for this admin");
        }
      }

      const productsToSave = dtos.map((dto) => ({
        ...dto,
        adminId: objectAdminId,
        machineId: new Types.ObjectId(dto.machineId),
        productId: new Types.ObjectId(dto.productId),
      }));

      return this.nonFuelSellModel.insertMany(productsToSave);
    } catch (error) {
      console.error("SELL ERROR:", error);
      throw error;
    }
  }

  async getProducts(adminId: string) {
    return this.nonFuelSellModel
      .find({ adminId: new Types.ObjectId(adminId) })
      .populate("productId")
      .populate("machineId");
  }

  async deleteProduct(productId: string) {
    return this.nonFuelSellModel.findByIdAndDelete(productId);
  }
}
