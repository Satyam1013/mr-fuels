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
exports.SalesSchema = exports.Sales = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_status_enum_1 = require("../shift-status/shift-status.enum");
let NozzleSale = class NozzleSale {
};
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], NozzleSale.prototype, "liters", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], NozzleSale.prototype, "amount", void 0);
NozzleSale = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], NozzleSale);
let SalesNozzle = class SalesNozzle {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SalesNozzle.prototype, "nozzleNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SalesNozzle.prototype, "fuelType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Staff" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SalesNozzle.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SalesNozzle.prototype, "lastReading", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SalesNozzle.prototype, "currentReading", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: NozzleSale }),
    __metadata("design:type", NozzleSale)
], SalesNozzle.prototype, "sales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: NozzleSale }),
    __metadata("design:type", NozzleSale)
], SalesNozzle.prototype, "netSales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: NozzleSale }),
    __metadata("design:type", NozzleSale)
], SalesNozzle.prototype, "testing", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], SalesNozzle.prototype, "faultTesting", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], SalesNozzle.prototype, "faultDesc", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], SalesNozzle.prototype, "faultImg", void 0);
SalesNozzle = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], SalesNozzle);
let MachineSpecific = class MachineSpecific {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Machine", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], MachineSpecific.prototype, "machineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MachineSpecific.prototype, "machineName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], MachineSpecific.prototype, "cashCollected", void 0);
MachineSpecific = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], MachineSpecific);
let MachinesData = class MachinesData {
};
__decorate([
    (0, mongoose_1.Prop)({ type: [SalesNozzle], default: [] }),
    __metadata("design:type", Array)
], MachinesData.prototype, "nozzles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [MachineSpecific], default: [] }),
    __metadata("design:type", Array)
], MachinesData.prototype, "machineSpecific", void 0);
MachinesData = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], MachinesData);
let StaffTransactions = class StaffTransactions {
};
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffTransactions.prototype, "upi", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffTransactions.prototype, "pos", void 0);
StaffTransactions = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], StaffTransactions);
let StaffSaleAmount = class StaffSaleAmount {
};
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffSaleAmount.prototype, "liters", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffSaleAmount.prototype, "amount", void 0);
StaffSaleAmount = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], StaffSaleAmount);
let SalesStaff = class SalesStaff {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Staff", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SalesStaff.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalesStaff.prototype, "staffName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Machine" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SalesStaff.prototype, "machineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number], default: [] }),
    __metadata("design:type", Array)
], SalesStaff.prototype, "assignedNozzleNumbers", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SalesStaff.prototype, "fuelType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: StaffSaleAmount }),
    __metadata("design:type", StaffSaleAmount)
], SalesStaff.prototype, "sales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: StaffSaleAmount }),
    __metadata("design:type", StaffSaleAmount)
], SalesStaff.prototype, "netSales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: StaffSaleAmount }),
    __metadata("design:type", StaffSaleAmount)
], SalesStaff.prototype, "testing", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SalesStaff.prototype, "creditors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SalesStaff.prototype, "prepaid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SalesStaff.prototype, "lubricantSales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: StaffTransactions }),
    __metadata("design:type", StaffTransactions)
], SalesStaff.prototype, "transactions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SalesStaff.prototype, "pumpExpenses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SalesStaff.prototype, "personalExpenses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SalesStaff.prototype, "cashCollected", void 0);
SalesStaff = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], SalesStaff);
let Sales = class Sales extends mongoose_2.Document {
};
exports.Sales = Sales;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Sales.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Sales.prototype, "shiftNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Sales.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Sales.prototype, "overallSales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Sales.prototype, "netSales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Sales.prototype, "testing", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Sales.prototype, "overallCreditorsAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Sales.prototype, "prepaid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Sales.prototype, "pumpExpenses", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Sales.prototype, "personalExpenses", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Sales.prototype, "lubricantSales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Sales.prototype, "transactions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: MachinesData }),
    __metadata("design:type", MachinesData)
], Sales.prototype, "machines", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SalesStaff], default: [] }),
    __metadata("design:type", Array)
], Sales.prototype, "staff", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: shift_status_enum_1.ShiftStatusEnum, default: shift_status_enum_1.ShiftStatusEnum.PENDING }),
    __metadata("design:type", String)
], Sales.prototype, "shiftStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: { upi: 0, cash: 0, accountPay: 0 } }),
    __metadata("design:type", Object)
], Sales.prototype, "returnCreditTotals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sales.prototype, "returnCreditUpi", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sales.prototype, "returnCreditCash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sales.prototype, "returnCreditAccountPay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sales.prototype, "remainingDepositedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sales.prototype, "depositAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sales.prototype, "additionalDepositAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sales.prototype, "moneyDeposited", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sales.prototype, "inHandCash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sales.prototype, "overallAmountGeneratedByPump", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Sales.prototype, "amountReceivedToPump", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            mainDifference: 0,
            overallShortage: 0,
            overallPumpSalesShortage: 0,
            overallShortageMoneyReceived: 0,
            inHandCash: 0,
            moneyDeposited: 0,
        },
    }),
    __metadata("design:type", Object)
], Sales.prototype, "differenceSummary", void 0);
exports.Sales = Sales = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Sales);
exports.SalesSchema = mongoose_1.SchemaFactory.createForClass(Sales);
