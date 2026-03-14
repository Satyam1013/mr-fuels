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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DsrDetailsSchema = exports.DsrDetails = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dsr_enum_1 = require("./dsr.enum");
let TankConfig = class TankConfig {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TankConfig.prototype, "tankNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: dsr_enum_1.TankInputType, required: true }),
    __metadata("design:type", String)
], TankConfig.prototype, "inputType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TankConfig.prototype, "capacity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TankConfig.prototype, "diameter", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TankConfig.prototype, "length", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TankConfig.prototype, "tankType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TankConfig.prototype, "dsrChart", void 0);
TankConfig = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], TankConfig);
let DsrDetails = class DsrDetails extends mongoose_2.Document {
};
exports.DsrDetails = DsrDetails;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "Admin",
        required: true,
        unique: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DsrDetails.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TankConfig], default: [] }),
    __metadata("design:type", Array)
], DsrDetails.prototype, "tankConfig", void 0);
exports.DsrDetails = DsrDetails = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DsrDetails);
exports.DsrDetailsSchema = mongoose_1.SchemaFactory.createForClass(DsrDetails);
