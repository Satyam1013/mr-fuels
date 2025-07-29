import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CreditorService } from "./creditors.service";
import {
  CreateCreditorDto,
  GetCreditorsQueryDto,
  UpdateCreditorDto,
} from "./creditors.dto";
import { GetUser } from "../auth/get-user.decoration";

@Controller("creditors")
export class CreditorController {
  constructor(private readonly creditorService: CreditorService) {}

  @Post()
  create(@Body() dto: CreateCreditorDto) {
    return this.creditorService.create(dto);
  }

  @Get()
  findAll(
    @Query() query: GetCreditorsQueryDto,
    @GetUser("pumpId") pumpId: string,
  ) {
    const { filterType, date } = query;
    return this.creditorService.findAll(pumpId, date, filterType);
  }

  @Get("/summary")
  getCreditSummary(@Query() query: GetCreditorsQueryDto) {
    const { filterType, date } = query;
    if (!filterType || !date) {
      throw new BadRequestException("Both filterType and date are required");
    }
    return this.creditorService.getCreditSummary(date, filterType);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.creditorService.findById(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCreditorDto) {
    return this.creditorService.update(id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.creditorService.delete(id);
  }
}
