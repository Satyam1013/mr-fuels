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
let Entry = class Entry {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Entry.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Entry.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Entry.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Entry.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Entry.prototype, "paymentMode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Entry.prototype, "imageUrl", void 0);
Entry = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Entry);
const EntrySchema = mongoose_1.SchemaFactory.createForClass(Entry);
let PersonalExpense = class PersonalExpense {
};
exports.PersonalExpense = PersonalExpense;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], PersonalExpense.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PersonalExpense.prototype, "pumpId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [EntrySchema], required: true, default: [] }),
    __metadata("design:type", Array)
], PersonalExpense.prototype, "entries", void 0);
exports.PersonalExpense = PersonalExpense = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PersonalExpense);
exports.PersonalExpenseSchema = mongoose_1.SchemaFactory.createForClass(PersonalExpense);
