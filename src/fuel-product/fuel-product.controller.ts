import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Types } from "mongoose";
import { FuelProductService } from "./fuel-product.service";
import {
  CreateFuelProductsDto,
  UpdateFuelProductsDto,
} from "./fuel-product.dto";
import { GetUser } from "../auth/get-user.decoration";
import { FuelType } from "../common/enums/fuel-type.enum";

@Controller("fuel-product")
export class FuelProductController {
  constructor(private readonly fuelProductService: FuelProductService) {}

  @Post()
  async create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateFuelProductsDto,
  ) {
    return this.fuelProductService.create(adminId, dto);
  }

  @Get()
  async findAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.fuelProductService.findAll(adminId);
  }

  @Get(":fuelType")
  async findOne(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("fuelType") fuelType: FuelType,
  ) {
    return this.fuelProductService.findByFuelType(adminId, fuelType);
  }

  @Patch()
  async updatePrice(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: UpdateFuelProductsDto,
  ) {
    return this.fuelProductService.updatePrice(adminId, dto);
  }

  @Delete(":fuelType")
  async remove(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("fuelType") fuelType: FuelType,
  ) {
    return this.fuelProductService.remove(adminId, fuelType);
  }
}
