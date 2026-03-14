import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
} from "@nestjs/common";
import { TankService } from "./tank-details.service";
import { CreateTankDetailsDto, UpdateTankDetailsDto } from "./tank-details.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("tanks")
export class TankController {
  constructor(private readonly tankService: TankService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTankDetailsDto) {
    return this.tankService.create(req.user.adminId, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.tankService.findAll(req.user.adminId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tankService.findOne(id);
  }

  @Patch()
  updateMany(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateTankDetailsDto,
  ) {
    return this.tankService.updateMany(req.user.adminId, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tankService.remove(id);
  }
}
