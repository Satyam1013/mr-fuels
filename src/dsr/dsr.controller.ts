import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { DsrDetailsService } from "./dsr.service";
import { CreateDsrDetailsDto } from "./dsr.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("dsr-details")
export class DsrDetailsController {
  constructor(private readonly dsrService: DsrDetailsService) {}

  @Post()
  async addOrUpdate(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateDsrDetailsDto,
  ) {
    const adminId = req.user.adminId;
    return this.dsrService.addOrUpdate(adminId, dto);
  }

  @Get()
  async getMyDsr(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
    return this.dsrService.getByAdmin(adminId);
  }

  @Patch()
  async updateDsr(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateDsrDetailsDto,
  ) {
    const adminId = req.user.adminId;
    return this.dsrService.updateDsr(adminId, dto);
  }

  @Delete()
  async deleteDsr(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
    return this.dsrService.deleteDsr(adminId);
  }
}
