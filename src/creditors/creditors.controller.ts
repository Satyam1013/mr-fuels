import {
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

@Controller("creditors")
export class CreditorController {
  constructor(private readonly creditorService: CreditorService) {}

  @Post()
  create(@Body() dto: CreateCreditorDto) {
    return this.creditorService.create(dto);
  }

  @Get()
  findAll(@Query() query: GetCreditorsQueryDto) {
    const { filterType, date } = query;
    return this.creditorService.findAll(date, filterType);
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
