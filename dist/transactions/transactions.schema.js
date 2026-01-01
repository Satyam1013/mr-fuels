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
exports.TransactionDetailsSchema = exports.TransactionDetails = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UpiApp = class UpiApp {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UpiApp.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UpiApp.prototype, "merchantId", void 0);
UpiApp = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], UpiApp);
let TransactionDetails = class TransactionDetails extends mongoose_2.Document {
};
exports.TransactionDetails = TransactionDetails;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TransactionDetails.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [UpiApp], default: [] }),
    __metadata("design:type", Array)
], TransactionDetails.prototype, "upiApps", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TransactionDetails.prototype, "swipeSettlement", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TransactionDetails.prototype, "swipeStatement", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TransactionDetails.prototype, "bankDeposit", void 0);
exports.TransactionDetails = TransactionDetails = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TransactionDetails);
exports.TransactionDetailsSchema = mongoose_1.SchemaFactory.createForClass(TransactionDetails);
