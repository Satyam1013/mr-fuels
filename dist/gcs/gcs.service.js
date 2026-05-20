"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GcsService = void 0;
const common_1 = require("@nestjs/common");
const storage_1 = require("@google-cloud/storage");
let GcsService = class GcsService {
    constructor() {
        this.storage = new storage_1.Storage({
            projectId: process.env.GCS_PROJECT_ID,
            keyFilename: process.env.GCS_KEY_FILE,
        });
        this.bucket = this.storage.bucket(process.env.GCS_BUCKET_NAME);
    }
    async uploadFile(file) {
        return new Promise((resolve, reject) => {
            const destination = `action-point-remarks/${Date.now()}-${file.originalname}`;
            const blob = this.bucket.file(destination);
            const stream = blob.createWriteStream({
                resumable: false,
                contentType: file.mimetype,
            });
            stream.on("error", reject);
            stream.on("finish", () => {
                resolve(`https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${destination}`);
            });
            stream.end(file.buffer);
        });
    }
    async deleteFile(fileUrl) {
        const filePath = fileUrl.replace(`https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/`, "");
        await this.bucket.file(filePath).delete({ ignoreNotFound: true });
    }
};
exports.GcsService = GcsService;
exports.GcsService = GcsService = __decorate([
    (0, common_1.Injectable)()
], GcsService);
