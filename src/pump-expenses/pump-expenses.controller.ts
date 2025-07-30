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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { PumpExpenseService } from "./pump-expenses.service";
import {
  CreatePumpExpenseDto,
  UpdatePumpExpenseDto,
} from "./pump-expenses.dto";
import { FilterType } from "../home/home.dto";
import { GetUser } from "../auth/get-user.decoration";
import { AuthGuard } from "../auth/auth.guard";

@UseGuards(AuthGuard)
@Controller("pump-expense")
export class PumpExpenseController {
  constructor(private readonly pumpExpenseService: PumpExpenseService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 10 }]))
  async create(
    @Body() dto: CreatePumpExpenseDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @GetUser("pumpId") pumpId: string,
  ) {
    return this.pumpExpenseService.create(dto, files?.images || [], pumpId);
  }

  @Get()
  findAll(
    @GetUser("pumpId") pumpId: string,
    @Query("date") date?: string,
    @Query("filterType") filterType?: FilterType,
  ) {
    return this.pumpExpenseService.findAll(pumpId, date, filterType);
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
