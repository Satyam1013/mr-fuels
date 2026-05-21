"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GcsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const gcs_service_1 = require("./gcs.service");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const mongoose_1 = require("mongoose");
const multerOptions = {
    storage: (0, multer_1.memoryStorage)(),
    limits: { fileSize: 10 * 1024 * 1024 },
};
let GcsController = class GcsController {
    constructor(gcsService) {
        this.gcsService = gcsService;
    }
    async uploadFile(file) {
        const url = await this.gcsService.uploadFile(file);
        return { success: true, url };
    }
    async uploadReading(file, pumpId) {
        const url = await this.gcsService.uploadReading(file, pumpId.toString());
        return { success: true, url };
    }
    async uploadDsr(file, pumpId) {
        const url = await this.gcsService.uploadDsr(file, pumpId.toString());
        return { success: true, url };
    }
    async uploadReport(file, pumpId) {
        const url = await this.gcsService.uploadReport(file, pumpId.toString());
        return { success: true, url };
    }
    async delete(url) {
        await this.gcsService.deleteFile(url);
        return { success: true };
    }
};
exports.GcsController = GcsController;
__decorate([
    (0, common_1.Post)("upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", multerOptions)),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GcsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)("readings"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", multerOptions)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], GcsController.prototype, "uploadReading", null);
__decorate([
    (0, common_1.Post)("dsr"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", multerOptions)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], GcsController.prototype, "uploadDsr", null);
__decorate([
    (0, common_1.Post)("reports"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", multerOptions)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], GcsController.prototype, "uploadReport", null);
__decorate([
    (0, common_1.Delete)("delete"),
    __param(0, (0, common_1.Body)("url")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GcsController.prototype, "delete", null);
exports.GcsController = GcsController = __decorate([
    (0, common_1.Controller)("files"),
    __metadata("design:paramtypes", [gcs_service_1.GcsService])
], GcsController);
