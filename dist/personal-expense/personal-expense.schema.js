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
exports.PersonalExpenseSchema = exports.PersonalExpense = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const creditors_enum_1 = require("../creditors/creditors.enum");
let PersonalExpense = class PersonalExpense extends mongoose_2.Document {
};
exports.PersonalExpense = PersonalExpense;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PersonalExpense.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PersonalExpense.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], PersonalExpense.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PersonalExpense.prototype, "shiftNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PersonalExpense.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PersonalExpense.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: creditors_enum_1.CreditBy, required: true }),
    __metadata("design:type", String)
], PersonalExpense.prototype, "creditBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonalExpense.prototype, "narration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonalExpense.prototype, "photoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Machine", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PersonalExpense.prototype, "machineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PersonalExpense.prototype, "nozzleNumber", void 0);
exports.PersonalExpense = PersonalExpense = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PersonalExpense);
exports.PersonalExpenseSchema = mongoose_1.SchemaFactory.createForClass(PersonalExpense);
