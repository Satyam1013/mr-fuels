import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";

@Injectable()
export class GcsService {
  private storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: JSON.parse(process.env.GCS_KEY_JSON!) as {
      client_email: string;
      private_key: string;
    },
  });

  private bucket = this.storage.bucket(process.env.GCS_BUCKET_NAME!);

  async uploadTransaction(
    file: Express.Multer.File,
    pumpId: string,
  ): Promise<string> {
    return this.upload(file, `transactions/${pumpId}`);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return this.upload(file, "others");
  }

  async uploadReading(
    file: Express.Multer.File,
    pumpId: string,
  ): Promise<string> {
    return this.upload(file, `readings/${pumpId}`);
  }

  async uploadDsr(file: Express.Multer.File, pumpId: string): Promise<string> {
    return this.upload(file, `dsr/${pumpId}`);
  }

  async uploadReport(
    file: Express.Multer.File,
    pumpId: string,
  ): Promise<string> {
    return this.upload(file, `reports/${pumpId}`);
  }

  private async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const destination = `${folder}/${Date.now()}-${file.originalname}`;
      const blob = this.bucket.file(destination);

      const stream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      stream.on("error", reject);
      stream.on("finish", () => {
        resolve(
          `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${destination}`,
        );
      });

      stream.end(file.buffer);
    });
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const filePath = fileUrl.replace(
      `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/`,
      "",
    );
    await this.bucket.file(filePath).delete({ ignoreNotFound: true });
  }
}
