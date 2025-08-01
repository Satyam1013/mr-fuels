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
exports.CreditorContactController = void 0;
const common_1 = require("@nestjs/common");
const creditor_contact_service_1 = require("./creditor-contact.service");
const creditor_contact_dto_1 = require("./creditor-contact.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const auth_guard_1 = require("../auth/auth.guard");
let CreditorContactController = class CreditorContactController {
    constructor(contactService) {
        this.contactService = contactService;
    }
    create(dto, pumpId) {
        return this.contactService.create(dto, pumpId);
    }
    findAll(pumpId) {
        return this.contactService.findAll(pumpId);
    }
    getById(id) {
        return this.contactService.getById(id);
    }
    update(id, dto) {
        return this.contactService.update(id, dto);
    }
    delete(id) {
        return this.contactService.delete(id);
    }
};
exports.CreditorContactController = CreditorContactController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [creditor_contact_dto_1.CreateCreditorContactDto, String]),
    __metadata("design:returntype", void 0)
], CreditorContactController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CreditorContactController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CreditorContactController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, creditor_contact_dto_1.UpdateCreditorContactDto]),
    __metadata("design:returntype", void 0)
], CreditorContactController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CreditorContactController.prototype, "delete", null);
exports.CreditorContactController = CreditorContactController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)("creditor-contacts"),
    __metadata("design:paramtypes", [creditor_contact_service_1.CreditorContactService])
], CreditorContactController);
