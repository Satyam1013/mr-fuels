import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { AuthenticatedRequest } from "../auth/auth.request";
import { UpiService } from "./payment.service";
import { SubmitUpiDto } from "./payment.dto";

@Controller("payments")
export class UpiController {
  constructor(private readonly upiService: UpiService) {}

  @Post("submit-upi")
  @UseInterceptors(FilesInterceptor("files"))
  async submitUpiPayments(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { date: string; shiftId: string; upiPayments: string },
    @Req() req: AuthenticatedRequest,
  ) {
    const adminId = req.user.adminId;

    let parsedPayments: SubmitUpiDto["upiPayments"];

    try {
      parsedPayments = JSON.parse(
        body.upiPayments,
      ) as SubmitUpiDto["upiPayments"];
    } catch {
      throw new BadRequestException("Invalid upiPayments JSON format");
    }

    const parsedDto: SubmitUpiDto = {
      date: body.date,
      shiftId: Number(body.shiftId),
      upiPayments: parsedPayments,
    };

    return this.upiService.submitUpiPayments(adminId, parsedDto, files);
  }
}
