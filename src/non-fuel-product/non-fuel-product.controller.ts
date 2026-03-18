import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { NonFuelProductsService } from "./non-fuel-product.service";
import {
  CreateNonFuelProductsDto,
  NonFuelProductDto,
} from "./non-fuel-product.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("non-fuel-products")
export class NonFuelProductsController {
  constructor(private readonly nonFuelService: NonFuelProductsService) {}

  @Post()
  create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateNonFuelProductsDto,
  ) {
    return this.nonFuelService.create(adminId, dto.products);
  }

  @Get()
  getAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.nonFuelService.getAll(adminId);
  }

  @Patch(":id")
  update(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
    @Body() dto: NonFuelProductDto,
  ) {
    return this.nonFuelService.update(adminId, id, dto);
  }

  @Delete(":id")
  delete(@GetUser("adminId") adminId: Types.ObjectId, @Param("id") id: string) {
    return this.nonFuelService.delete(adminId, id);
  }
}
