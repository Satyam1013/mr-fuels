/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as dotenv from "dotenv";
dotenv.config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a PDF file from disk path to Cloudinary
 * @param filePath - Local file path of the PDF
 */
export async function uploadPdfToCloudinary(filePath: string) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "pdfs",
      resource_type: "raw", // For PDF and other non-image files
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary PDF upload failed:", error);
    throw new Error("Cloudinary PDF upload failed");
  }
}

/**
 * Upload a PDF from a buffer (e.g., received from an HTTP file upload)
 * @param buffer - Buffer of the uploaded PDF
 * @param filename - Original filename of the PDF
 */
export async function uploadPdfBufferToCloudinary(
  buffer: Buffer,
  filename: string,
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "pdfs",
        resource_type: "raw",
        public_id: filename.replace(/\.[^/.]+$/, ""),
      },
      (
        error: unknown,
        result: { secure_url: string; public_id: string } | undefined,
      ) => {
        if (error) {
          console.error("Cloudinary PDF buffer upload failed:", error);
          return reject(new Error("Cloudinary PDF upload failed"));
        }
        if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      },
    );
    stream.end(buffer);
  });
}

/**
 * Delete a file from Cloudinary using its full URL
 * @param imageUrl - Cloudinary URL of the uploaded file
 */
export const deleteFromCloudinary = async (imageUrl: string) => {
  const publicId = imageUrl.split("/").pop()?.split(".")[0];
  if (publicId) {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  }
};
