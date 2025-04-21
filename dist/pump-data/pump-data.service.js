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
exports.PumpDataService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const machine_schema_1 = require("../machine/machine.schema");
const fuel_price_schema_1 = require("../fuel-price/fuel-price.schema");
const pump_data_dto_1 = require("./pump-data.dto");
let PumpDataService = class PumpDataService {
    constructor(machineModel, fuelPriceModel) {
        this.machineModel = machineModel;
        this.fuelPriceModel = fuelPriceModel;
    }
    async getPumpData(date, type) {
        const targetDate = new Date(date);
        const start = new Date(targetDate);
        const end = new Date(targetDate);
        if (type === pump_data_dto_1.PumpDataType.DAILY) {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        }
        else if (type === pump_data_dto_1.PumpDataType.MONTHLY) {
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            end.setHours(23, 59, 59, 999);
        }
        const fuelPrices = await this.fuelPriceModel
            .findOne()
            .sort({ createdAt: -1 });
        const machines = await this.machineModel.find();
        const moneyGeneratedByMachine = [];
        let totalMoneyGenerated = 0;
        for (const machine of machines) {
            const readings = machine.readings
                .filter((r) => r.date >= start && r.date <= end)
                .sort((a, b) => a.date.getTime() - b.date.getTime());
            if (readings.length >= 2) {
                const litersDispensed = readings[readings.length - 1].reading - readings[0].reading;
                const rate = fuelPrices
                    ? fuelPrices[machine.fuelType.toLowerCase()] || 0
                    : 0;
                const amount = litersDispensed * rate;
                moneyGeneratedByMachine.push({
                    machineNo: machine.machineNo,
                    nozzleNo: machine.nozzleNo,
                    fuelType: machine.fuelType,
                    amount,
                });
                totalMoneyGenerated += amount;
            }
        }
        return {
            sellAmount: totalMoneyGenerated,
            amountCollected: 0,
            amountToCollect: totalMoneyGenerated,
            amountDeposit: 0,
            moneyGeneratedByMachine,
            totalMoneyGenerated,
            testingExpenses: [],
            totalTestingExpenses: 0,
            pumpExpenses: [],
            totalPumpExpenses: 0,
            personalExpenses: [],
            totalPersonalExpenses: 0,
            creditorsAndLenders: [],
            totalCreditorsLenders: 0,
            digitalPayments: {
                phonePe: 0,
                cardSwipe: 0,
                total: 0,
            },
            moneyCollected: [],
            totalMoneyCollected: 0,
        };
    }
};
exports.PumpDataService = PumpDataService;
exports.PumpDataService = PumpDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(machine_schema_1.Machine.name)),
    __param(1, (0, mongoose_1.InjectModel)(fuel_price_schema_1.FuelPrice.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PumpDataService);
//# sourceMappingURL=pump-data.service.js.map