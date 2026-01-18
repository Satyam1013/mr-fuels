import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ProductDetails } from "./product-details.schema";
import { Admin } from "../admin/admin.schema";
import { CreateProductDetailsDto } from "./product-details.dto";

@Injectable()
export class ProductDetailsService {
  constructor(
    @InjectModel(ProductDetails.name)
    private productDetailsModel: Model<ProductDetails>,
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
  ) {}

  async addProductDetails(adminId: string, dto: CreateProductDetailsDto) {
    const admin = await this.adminModel.exists({ _id: adminId });
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    return this.productDetailsModel.findOneAndUpdate(
      { adminId: new Types.ObjectId(adminId) },
      { $set: dto },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
  }
}
