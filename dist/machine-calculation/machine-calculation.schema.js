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
exports.MachineCalculationSchema = exports.MachineCalculation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let NozzleCalculation = class NozzleCalculation {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "nozzleNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Staff" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NozzleCalculation.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: "Creditor" }], default: [] }),
    __metadata("design:type", Array)
], NozzleCalculation.prototype, "creditIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: "PumpExpense" }], default: [] }),
    __metadata("design:type", Array)
], NozzleCalculation.prototype, "pumpExpenseIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Types.ObjectId, ref: "PersonalExpense" }],
        default: [],
    }),
    __metadata("design:type", Array)
], NozzleCalculation.prototype, "personalExpenseIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: "Prepaid" }], default: [] }),
    __metadata("design:type", Array)
], NozzleCalculation.prototype, "prepaidIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Types.ObjectId, ref: "NonFuelProduct" }],
        default: [],
    }),
    __metadata("design:type", Array)
], NozzleCalculation.prototype, "nonFuelProductIds", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "fuelSaleAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "creditTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "expenseTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "prepaidTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "lubricantTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "finalAmount", void 0);
NozzleCalculation = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], NozzleCalculation);
let MachineCalculation = class MachineCalculation extends mongoose_2.Document {
};
exports.MachineCalculation = MachineCalculation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], MachineCalculation.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Machine", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], MachineCalculation.prototype, "machineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], MachineCalculation.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MachineCalculation.prototype, "shiftNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [NozzleCalculation], default: [] }),
    __metadata("design:type", Array)
], MachineCalculation.prototype, "nozzles", void 0);
exports.MachineCalculation = MachineCalculation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MachineCalculation);
exports.MachineCalculationSchema = mongoose_1.SchemaFactory.createForClass(MachineCalculation);
