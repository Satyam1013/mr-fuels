// gcs.controller.ts
import {
  Controller,
  Post,
  Delete,
  Body,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { GcsService } from "./gcs.service";
import { Public } from "../auth/public.decorator";

@Controller("files")
export class GcsController {
  constructor(private readonly gcsService: GcsService) {}

  @Public()
  @Post("upload")
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage() }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = await this.gcsService.uploadFile(file);
    return { success: true, url };
  }

  @Delete("delete")
  async delete(@Body("url") url: string) {
    await this.gcsService.deleteFile(url);
    return { success: true };
  }
}
