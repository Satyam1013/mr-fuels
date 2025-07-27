import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreditorContactService } from "./creditor-contact.service";
import {
  CreateCreditorContactDto,
  UpdateCreditorContactDto,
} from "./creditor-contact.dto";

@Controller("creditor-contacts")
export class CreditorContactController {
  constructor(private readonly contactService: CreditorContactService) {}

  @Post()
  create(@Body() dto: CreateCreditorContactDto) {
    return this.contactService.create(dto);
  }

  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.contactService.getById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCreditorContactDto) {
    return this.contactService.update(id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.contactService.delete(id);
  }
}
