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
exports.CreditorSchema = exports.Creditor = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Creditor = class Creditor {
};
exports.Creditor = Creditor;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "CreditorContact",
        required: true,
        unique: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Creditor.prototype, "creditorContactId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Creditor.prototype, "totalCreditGiven", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Creditor.prototype, "totalCreditLeft", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            _id: false,
            amount: Number,
            time: Date,
            type: { type: String, enum: ["credit", "return"] },
            imgUrl: String,
            details: String,
            paidType: { type: String, enum: ["cash", "account"] },
        },
    ]),
    __metadata("design:type", Array)
], Creditor.prototype, "records", void 0);
exports.Creditor = Creditor = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Creditor);
exports.CreditorSchema = mongoose_1.SchemaFactory.createForClass(Creditor);
