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
exports.MachineService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const machines_schema_1 = require("./machines.schema");
const fuel_product_schema_1 = require("../fuel-product/fuel-product.schema");
let MachineService = class MachineService {
    constructor(machineModel, fuelProductDetailsModel) {
        this.machineModel = machineModel;
        this.fuelProductDetailsModel = fuelProductDetailsModel;
    }
    async createMachines(adminId, machines) {
        const docs = machines.map((m) => ({
            ...m,
            adminId,
            nozzle: m.nozzle.map((n) => ({
                ...n,
                fuelProductId: new mongoose_2.Types.ObjectId(n.fuelProductId),
                tankId: new mongoose_2.Types.ObjectId(n.tankId),
            })),
        }));
        return this.machineModel.insertMany(docs);
    }
    async getMachines(adminId) {
        const [machines, fuelProductDetails] = await Promise.all([
            this.machineModel.find({ adminId }).lean(),
            this.fuelProductDetailsModel.findOne({ adminId }).lean(),
        ]);
        return machines.map((machine) => ({
            ...machine,
            nozzle: machine.nozzle.map((nozzle) => {
                const product = fuelProductDetails?.products.find((p) => p._id.toString() ===
                    nozzle.fuelProductId.toString());
                return {
                    ...nozzle,
                    fuelType: product?.fuelType,
                    price: product?.price,
                    purchasingPrice: product?.purchasingPrice,
                };
            }),
        }));
    }
    async getMachineById(machineId) {
        const machine = await this.machineModel.findById(machineId).lean();
        if (!machine)
            return null;
        const fuelProductDetails = await this.fuelProductDetailsModel
            .findOne({ adminId: machine.adminId })
            .lean();
        return {
            ...machine,
            nozzle: machine.nozzle.map((nozzle) => {
                const product = fuelProductDetails?.products.find((p) => p._id.toString() ===
                    nozzle.fuelProductId.toString());
                return {
                    ...nozzle,
                    fuelType: product?.fuelType,
                    price: product?.price,
                    purchasingPrice: product?.purchasingPrice,
                };
            }),
        };
    }
    async updateMachine(machineId, dto) {
        if (dto.nozzle) {
            const nozzles = dto.nozzle.map((n) => ({
                ...n,
                fuelProductId: new mongoose_2.Types.ObjectId(n.fuelProductId),
                tankId: new mongoose_2.Types.ObjectId(n.tankId),
            }));
            return this.machineModel.findByIdAndUpdate(machineId, { ...dto, nozzle: nozzles }, { new: true });
        }
        return this.machineModel.findByIdAndUpdate(machineId, dto, { new: true });
    }
    async deleteMachine(machineId) {
        return this.machineModel.findByIdAndDelete(machineId);
    }
};
exports.MachineService = MachineService;
exports.MachineService = MachineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(machines_schema_1.Machine.name)),
    __param(1, (0, mongoose_1.InjectModel)(fuel_product_schema_1.FuelProductDetails.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MachineService);
