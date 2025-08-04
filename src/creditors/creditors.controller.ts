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
  create(@Body() dto: CreateCreditorDto, @GetUser("pumpId") pumpId: string) {
    return this.creditorService.create(dto, pumpId);
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
  getCreditSummary(
    @Query() query: GetCreditorsQueryDto,
    @GetUser("pumpId") pumpId: string,
  ) {
    const { filterType, date } = query;
    if (!filterType || !date) {
      throw new BadRequestException("Both filterType and date are required");
    }
    return this.creditorService.getCreditSummary(pumpId, date, filterType);
  }

  @Get(":id")
  findById(
    @Param("id") contactId: string,
    @Query() query: GetCreditorsQueryDto,
    @GetUser("pumpId") pumpId: string,
  ) {
    const { date, filterType } = query;
    return this.creditorService.findById(contactId, pumpId, date, filterType);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateCreditorDto,
    @GetUser("pumpId") pumpId: string,
  ) {
    return this.creditorService.update(id, dto, pumpId);
  }

  @Delete(":id")
  delete(@Param("id") id: string, @GetUser("pumpId") pumpId: string) {
    return this.creditorService.delete(id, pumpId);
  }
}
