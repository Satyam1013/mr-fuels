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
exports.PumpExpenseSchema = exports.PumpExpense = void 0;
// src/pump-expense/pump-expense.schema.ts
const mongoose_1 = require("@nestjs/mongoose");
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
Entry = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Entry);
const EntrySchema = mongoose_1.SchemaFactory.createForClass(Entry);
let PumpExpense = class PumpExpense {
};
exports.PumpExpense = PumpExpense;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], PumpExpense.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [EntrySchema], required: true, default: [] }),
    __metadata("design:type", Array)
], PumpExpense.prototype, "entries", void 0);
exports.PumpExpense = PumpExpense = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PumpExpense);
exports.PumpExpenseSchema = mongoose_1.SchemaFactory.createForClass(PumpExpense);
