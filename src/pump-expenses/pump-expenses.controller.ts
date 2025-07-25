import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { PumpExpenseService } from "./pump-expenses.service";
import {
  CreatePumpExpenseDto,
  UpdatePumpExpenseDto,
} from "./pump-expenses.dto";
import { FilterType } from "../home/home.dto";

@Controller("pump-expense")
export class PumpExpenseController {
  constructor(private readonly pumpExpenseService: PumpExpenseService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 10 }]))
  async create(
    @Body() dto: CreatePumpExpenseDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.pumpExpenseService.create(dto, files?.images || []);
  }

  @Get()
  findAll(
    @Query("date") date?: string,
    @Query("filterType") filterType?: FilterType,
  ) {
    return this.pumpExpenseService.findAll(date, filterType);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.pumpExpenseService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePumpExpenseDto) {
    return this.pumpExpenseService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.pumpExpenseService.delete(id);
  }
}
