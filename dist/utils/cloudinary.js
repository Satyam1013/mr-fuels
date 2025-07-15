"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = void 0;
exports.uploadPdfToCloudinary = uploadPdfToCloudinary;
exports.uploadPdfBufferToCloudinary = uploadPdfBufferToCloudinary;
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const cloudinary = require("cloudinary").v2;
// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
 * Upload a PDF file from disk path to Cloudinary
 * @param filePath - Local file path of the PDF
 */
async function uploadPdfToCloudinary(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "pdfs",
            resource_type: "raw", // For PDF and other non-image files
        });
        return {
            secure_url: result.secure_url,
            public_id: result.public_id,
        };
    }
    catch (error) {
        console.error("Cloudinary PDF upload failed:", error);
        throw new Error("Cloudinary PDF upload failed");
    }
}
/**
 * Upload a PDF from a buffer (e.g., received from an HTTP file upload)
 * @param buffer - Buffer of the uploaded PDF
 * @param filename - Original filename of the PDF
 */
async function uploadPdfBufferToCloudinary(buffer, filename) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: "pdfs",
            resource_type: "raw",
            public_id: filename.replace(/\.[^/.]+$/, ""), // remove extension for public_id
        }, (error, result) => {
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
        });
        stream.end(buffer);
    });
}
/**
 * Delete a file from Cloudinary using its full URL
 * @param imageUrl - Cloudinary URL of the uploaded file
 */
const deleteFromCloudinary = async (imageUrl) => {
    const publicId = imageUrl.split("/").pop()?.split(".")[0];
    if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
