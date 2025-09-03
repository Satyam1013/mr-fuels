import { Body, Controller, Post } from "@nestjs/common";
import { DSRService } from "./dsr.service";
import { CreateDSRDto } from "./dsr.dto";
import { GetUser } from "../auth/get-user.decoration";

@Controller("dsr")
export class DSRController {
  constructor(private readonly dsrService: DSRService) {}

  @Post()
  async create(@Body() dto: CreateDSRDto, @GetUser("pumpId") pumpId: string) {
    return this.dsrService.create(dto, pumpId);
  }
}
