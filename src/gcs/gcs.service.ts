import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";

@Injectable()
export class GcsService {
  private storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: process.env.GCS_KEY_FILE,
  });

  private bucket = this.storage.bucket(process.env.GCS_BUCKET_NAME!);

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const destination = `action-point-remarks/${Date.now()}-${file.originalname}`;
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
