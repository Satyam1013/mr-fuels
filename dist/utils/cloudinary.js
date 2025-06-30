"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = void 0;
exports.uploadPdfToCloudinary = uploadPdfToCloudinary;
exports.uploadPdfBufferToCloudinary = uploadPdfBufferToCloudinary;
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "dcoegle2h",
    api_key: "221669619162474",
    api_secret: "X0TGO6zw4I8PlmjeTdntYkGPplI",
});
async function uploadPdfToCloudinary(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "pdfs",
            resource_type: "raw",
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
async function uploadPdfBufferToCloudinary(buffer, filename) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: "pdfs",
            resource_type: "raw",
            public_id: filename.replace(/\.[^/.]+$/, ""),
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
const deleteFromCloudinary = async (imageUrl) => {
    const publicId = imageUrl.split("/").pop()?.split(".")[0];
    if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=cloudinary.js.map