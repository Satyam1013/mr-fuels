/* eslint-disable @typescript-eslint/no-unsafe-return */
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
import { FilterType } from "../home/home.dto";
import { GetUser } from "../auth/get-user.decoration";
import { AuthGuard } from "../auth/auth.guard";
import {
  CreatePersonalExpenseDto,
  UpdatePersonalExpenseDto,
} from "./personal-expenses.dto";
import { PersonalExpenseService } from "./personal-expenses.service";

@UseGuards(AuthGuard)
@Controller("personal-expense")
export class PersonalExpenseController {
  constructor(
    private readonly personalExpenseService: PersonalExpenseService,
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 10 }]))
  async create(
    @Body() dto: CreatePersonalExpenseDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @GetUser("pumpId") pumpId: string,
  ) {
    return this.personalExpenseService.create(dto, files?.images || [], pumpId);
  }

  @Get()
  findAll(
    @GetUser("pumpId") pumpId: string,
    @Query("date") date?: string,
    @Query("filterType") filterType?: FilterType,
  ) {
    return this.personalExpenseService.findAll(pumpId, date, filterType);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.personalExpenseService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePersonalExpenseDto) {
    return this.personalExpenseService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.personalExpenseService.delete(id);
  }
}
