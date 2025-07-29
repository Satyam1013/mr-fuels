import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreditorContactService } from "./creditor-contact.service";
import {
  CreateCreditorContactDto,
  UpdateCreditorContactDto,
} from "./creditor-contact.dto";
import { GetUser } from "../auth/get-user.decoration";
import { AuthGuard } from "../auth/auth.guard";

@UseGuards(AuthGuard)
@Controller("creditor-contacts")
export class CreditorContactController {
  constructor(private readonly contactService: CreditorContactService) {}

  @Post()
  create(
    @Body() dto: CreateCreditorContactDto,
    @GetUser("pumpId") pumpId: string,
  ) {
    return this.contactService.create(dto, pumpId);
  }

  @Get()
  findAll(@GetUser("pumpId") pumpId: string) {
    return this.contactService.findAll(pumpId);
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
