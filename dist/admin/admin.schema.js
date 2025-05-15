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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSchema = exports.Admin = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
let Admin = class Admin {
};
exports.Admin = Admin;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Admin.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Admin.prototype, "businessEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Admin.prototype, "mobileNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: Object }] }),
    __metadata("design:type", Array)
], Admin.prototype, "tankCapacity", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                machineNo: Number,
                nozel: String,
            },
        ],
    }),
    __metadata("design:type", Array)
], Admin.prototype, "machines", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: "User" }] }),
    __metadata("design:type", Array)
], Admin.prototype, "managers", void 0);
exports.Admin = Admin = __decorate([
    (0, mongoose_1.Schema)()
], Admin);
exports.AdminSchema = mongoose_1.SchemaFactory.createForClass(Admin);
//# sourceMappingURL=admin.schema.js.map