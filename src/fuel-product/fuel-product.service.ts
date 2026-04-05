import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  CreateFuelProductsDto,
  UpdateFuelProductsDto,
} from "./fuel-product.dto";
import { FuelProductDetails } from "./fuel-product.schema";
import { FuelType } from "../common/enums/fuel-type.enum";

@Injectable()
export class FuelProductService {
  constructor(
    @InjectModel(FuelProductDetails.name)
    private fuelProductDetailsModel: Model<FuelProductDetails>,
  ) {}

  // ── Add product to array ─────────────────────────────────────────────────
  async create(adminId: Types.ObjectId, dto: CreateFuelProductsDto) {
    // Check karo koi bhi fuelType already exist to nahi karta
    const existing = await this.fuelProductDetailsModel.findOne({
      adminId,
      "products.fuelType": { $in: dto.products.map((p) => p.fuelType) },
    });

    if (existing) {
      const existingTypes = existing.products.map((p) => p.fuelType);
      const duplicates = dto.products
        .map((p) => p.fuelType)
        .filter((ft) => existingTypes.includes(ft));
      throw new BadRequestException(
        `${duplicates.join(", ")} already exists. Use update to change price.`,
      );
    }

    const productsWithDate = dto.products.map((p) => ({
      ...p,
      oldPrice: p.oldPrice ?? p.price,
      updatedPriceFrom: new Date(),
      shiftId: p.shiftId ?? null,
      shiftNumber: p.shiftNumber ?? null,
    }));

    const result = await this.fuelProductDetailsModel.findOneAndUpdate(
      { adminId },
      { $push: { products: { $each: productsWithDate } } },
      { upsert: true, new: true },
    );

    return result;
  }

  // ── Get all products of admin ────────────────────────────────────────────
  async findAll(adminId: Types.ObjectId) {
    const record = await this.fuelProductDetailsModel
      .findOne({ adminId })
      .lean();

    return record?.products ?? [];
  }

  // ── Get one by fuelType ──────────────────────────────────────────────────
  async findByFuelType(adminId: Types.ObjectId, fuelType: FuelType) {
    const record = await this.fuelProductDetailsModel
      .findOne({ adminId })
      .lean();

    const product = record?.products?.find((p) => p.fuelType === fuelType);

    if (!product) {
      throw new NotFoundException(`${fuelType} fuel product not found.`);
    }

    return product;
  }

  async updatePrice(adminId: Types.ObjectId, dto: UpdateFuelProductsDto) {
    const record = await this.fuelProductDetailsModel.findOne({ adminId });

    if (!record) {
      throw new NotFoundException(`Fuel products not found.`);
    }

    for (const item of dto.products) {
      const product = record.products.find((p) => p.fuelType === item.fuelType);

      if (product) {
        if (item.price !== undefined) {
          product.oldPrice = product.price;
          product.price = item.price;
          product.updatedPriceFrom = new Date();
        }
        if (item.purchasingPrice !== undefined) {
          product.purchasingPrice = item.purchasingPrice;
        }
        // ✅ Shift info update karo
        if (item.shiftId !== undefined) {
          product.shiftId = item.shiftId;
        }
        if (item.shiftNumber !== undefined) {
          product.shiftNumber = item.shiftNumber;
        }
      } else {
        record.products.push({
          _id: new Types.ObjectId(),
          fuelType: item.fuelType,
          price: item.price!,
          oldPrice: item.price!,
          purchasingPrice: item.purchasingPrice!,
          updatedPriceFrom: new Date(),
          shiftId: item.shiftId ?? null, // ✅
          shiftNumber: item.shiftNumber ?? null, // ✅
        });
      }
    }

    await record.save();
    return record;
  }

  // ── Delete one product from array ────────────────────────────────────────
  async remove(adminId: Types.ObjectId, fuelType: FuelType) {
    const result = await this.fuelProductDetailsModel.findOneAndUpdate(
      { adminId },
      { $pull: { products: { fuelType } } },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException(`${fuelType} fuel product not found.`);
    }

    return { message: `${fuelType} fuel product deleted successfully.` };
  }
}
