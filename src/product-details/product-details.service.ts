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
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    const existing = await this.productDetailsModel.findOne({ adminId });

    if (existing) {
      return this.productDetailsModel.findByIdAndUpdate(existing._id, dto, {
        new: true,
      });
    }

    return this.productDetailsModel.create({
      adminId: new Types.ObjectId(adminId),
      ...dto,
    });
  }
}
