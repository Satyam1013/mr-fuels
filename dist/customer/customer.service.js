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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_schema_1 = require("./customer.schema");
let CustomerService = class CustomerService {
    constructor(customerModel) {
        this.customerModel = customerModel;
    }
    async create(adminId, dto) {
        return this.customerModel.create({
            ...dto,
            adminId,
        });
    }
    async findAll(adminId) {
        return this.customerModel.find({
            adminId,
        });
    }
    async findOne(id) {
        const customer = await this.customerModel.findById(id);
        if (!customer)
            throw new common_1.NotFoundException("Customer not found");
        return customer;
    }
    async update(id, dto) {
        const customer = await this.customerModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
        if (!customer)
            throw new common_1.NotFoundException("Customer not found");
        return customer;
    }
    async remove(id) {
        const customer = await this.customerModel.findByIdAndDelete(id);
        if (!customer)
            throw new common_1.NotFoundException("Customer not found");
        return { message: "Customer deleted successfully" };
    }
    async findCustomerById(adminId, customerId) {
        const customer = await this.customerModel.findOne({
            _id: new mongoose_2.Types.ObjectId(customerId),
            adminId,
        });
        if (!customer) {
            throw new common_1.BadRequestException("Customer not found. Pehle customer create karo.");
        }
        return customer;
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CustomerService);
