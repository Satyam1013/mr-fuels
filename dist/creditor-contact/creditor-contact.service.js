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
exports.CreditorContactService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const creditor_contact_schema_1 = require("./creditor-contact.schema");
let CreditorContactService = class CreditorContactService {
    constructor(contactModel) {
        this.contactModel = contactModel;
    }
    async create(dto, pumpId) {
        return this.contactModel.create({ ...dto, pumpId });
    }
    async findAll(pumpId) {
        const contacts = await this.contactModel
            .find({ pumpId })
            .select("name number")
            .lean();
        return { contacts };
    }
    async getById(id) {
        const contact = await this.contactModel.findById(id);
        if (!contact)
            throw new common_1.NotFoundException("Creditor contact not found");
        return contact;
    }
    async update(id, dto) {
        const updated = await this.contactModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
        if (!updated)
            throw new common_1.NotFoundException("Contact not found");
        return updated;
    }
    async delete(id) {
        const deleted = await this.contactModel.findByIdAndDelete(id);
        if (!deleted)
            throw new common_1.NotFoundException("Contact not found");
        return { message: "Contact deleted successfully" };
    }
};
exports.CreditorContactService = CreditorContactService;
exports.CreditorContactService = CreditorContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(creditor_contact_schema_1.CreditorContact.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CreditorContactService);
