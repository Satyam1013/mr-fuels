import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { GcsService } from "./gcs.service";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
};

@Controller("files")
export class GcsController {
  constructor(private readonly gcsService: GcsService) {}

  @Post("readings")
  @UseInterceptors(FileInterceptor("file", multerOptions))
  async uploadReading(
    @UploadedFile() file: Express.Multer.File,
    @GetUser("adminId") pumpId: Types.ObjectId,
  ) {
    const url = await this.gcsService.uploadReading(file, pumpId.toString());
    return { success: true, url };
  }

  @Post("dsr")
  @UseInterceptors(FileInterceptor("file", multerOptions))
  async uploadDsr(
    @UploadedFile() file: Express.Multer.File,
    @GetUser("adminId") pumpId: Types.ObjectId,
  ) {
    const url = await this.gcsService.uploadDsr(file, pumpId.toString());
    return { success: true, url };
  }

  @Post("reports")
  @UseInterceptors(FileInterceptor("file", multerOptions))
  async uploadReport(
    @UploadedFile() file: Express.Multer.File,
    @GetUser("adminId") pumpId: Types.ObjectId,
  ) {
    const url = await this.gcsService.uploadReport(file, pumpId.toString());
    return { success: true, url };
  }
}
