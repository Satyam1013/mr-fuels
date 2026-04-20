import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NonFuelSaleProduct } from "./non-fuel-product-sales.schema";
import { CreateNonFuelSaleProductDto } from "./non-fuel-product-sales.dto";
import { Machine } from "../machines/machines.schema";
import { NonFuelProducts } from "../non-fuel-product/non-fuel-product.schema";

@Injectable()
export class NonFuelProductSaleService {
  constructor(
    @InjectModel(NonFuelSaleProduct.name)
    private nonFuelSaleModel: Model<NonFuelSaleProduct>,

    @InjectModel(Machine.name)
    private machineModel: Model<Machine>,

    @InjectModel(NonFuelProducts.name)
    private nonFuelProductsModel: Model<NonFuelProducts>,
  ) {}

  async addProducts(
    adminId: Types.ObjectId,
    dtos: CreateNonFuelSaleProductDto[],
  ) {
    const session = await this.nonFuelSaleModel.db.startSession();
    session.startTransaction();

    try {
      const productsToSave = [];

      for (const dto of dtos) {
        const machineId = new Types.ObjectId(dto.machineId);
        const productId = new Types.ObjectId(dto.productId);

        const machine = await this.machineModel.findOne({
          _id: machineId,
          adminId,
        });

        if (!machine) {
          throw new Error("Machine not found for this admin");
        }

        const product = await this.nonFuelProductsModel.findOne({
          _id: productId,
          adminId,
        });

        if (!product) {
          throw new Error("Product not found for this admin");
        }

        // ❗ Stock validation
        if (product.totalStock < dto.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.productName}`,
          );
        }

        // ✅ Update product (stock - , amountCollected +)
        await this.nonFuelProductsModel.updateOne(
          { _id: productId },
          {
            $inc: {
              totalStock: -dto.quantity,
              amountCollected: dto.amount,
            },
          },
          { session },
        );

        productsToSave.push({
          ...dto,
          adminId,
          machineId,
          productId,
        });
      }

      const result = await this.nonFuelSaleModel.insertMany(productsToSave, {
        session,
      });

      await session.commitTransaction();
      await session.endSession();
      return result;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }

  async getProducts(adminId: Types.ObjectId) {
    return this.nonFuelSaleModel
      .find({ adminId })
      .populate("productId")
      .populate("machineId");
  }

  async deleteProduct(productId: string) {
    return this.nonFuelSaleModel.findByIdAndDelete(productId);
  }
}
