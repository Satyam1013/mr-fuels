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
exports.ShiftAllotmentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_allotment_schema_1 = require("./shift-allotment.schema");
let ShiftAllotmentService = class ShiftAllotmentService {
    constructor(shiftAllotmentModel) {
        this.shiftAllotmentModel = shiftAllotmentModel;
    }
    async create(adminId, dto) {
        const existing = await this.shiftAllotmentModel.findOne({
            adminId,
            shiftId: dto.shiftId,
        });
        if (existing) {
            throw new common_1.ConflictException(`Shift allotment for shiftId "${dto.shiftId}" already exists`);
        }
        return this.shiftAllotmentModel.create({
            ...dto,
            adminId,
            managers: dto.managers.map((id) => new mongoose_2.Types.ObjectId(id)),
            machines: dto.machines.map((m) => ({
                ...m,
                nozzles: m.nozzles.map((n) => ({
                    ...n,
                    staffId: new mongoose_2.Types.ObjectId(n.staffId),
                    inactiveStatus: n.inactiveStatus ?? null,
                })),
            })),
        });
    }
    async findAll(adminId) {
        return this.shiftAllotmentModel.aggregate([
            { $match: { adminId } },
            ...this.populatePipeline(),
        ]);
    }
    async findOne(adminId, id) {
        const result = await this.shiftAllotmentModel.aggregate([
            { $match: { _id: new mongoose_2.Types.ObjectId(id), adminId } },
            ...this.populatePipeline(),
        ]);
        if (!result.length)
            throw new common_1.NotFoundException("Shift allotment not found");
        return result[0];
    }
    populatePipeline() {
        return [
            // shiftStatus lookup — "shiftstatuses" not "shiftstatus"
            {
                $lookup: {
                    from: "shiftstatuses",
                    let: { sid: { $toObjectId: "$shiftId" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$sid"] } } },
                        {
                            $project: {
                                date: 1,
                                totalShifts: 1,
                                currentShift: 1,
                                shifts: 1,
                                dailyClose: 1,
                                pumpStatus: 1,
                            },
                        },
                    ],
                    as: "shiftInfo",
                },
            },
            {
                $addFields: {
                    shiftInfo: { $arrayElemAt: ["$shiftInfo", 0] },
                },
            },
            // managers
            {
                $lookup: {
                    from: "managers",
                    localField: "managers",
                    foreignField: "_id",
                    as: "managers",
                    pipeline: [{ $project: { managerName: 1, phone: 1, shift: 1 } }],
                },
            },
            // machines
            {
                $lookup: {
                    from: "machines",
                    let: { machineIds: "$machines.machineId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: [{ $toString: "$_id" }, "$$machineIds"] },
                            },
                        },
                        { $project: { machineName: 1, machineNumber: 1, nozzle: 1 } },
                    ],
                    as: "machineDetails",
                },
            },
            // staff — "staffs" not "staff"
            {
                $lookup: {
                    from: "staffs",
                    let: {
                        staffIds: {
                            $reduce: {
                                input: "$machines",
                                initialValue: [],
                                in: {
                                    $concatArrays: [
                                        "$$value",
                                        {
                                            $map: {
                                                input: "$$this.nozzles",
                                                as: "n",
                                                in: "$$n.staffId",
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    pipeline: [
                        { $match: { $expr: { $in: ["$_id", "$$staffIds"] } } },
                        { $project: { staffName: 1, staffNumber: 1, shift: 1 } },
                    ],
                    as: "staffDetails",
                },
            },
            // machines rebuild (same as before)
            {
                $addFields: {
                    machines: {
                        $map: {
                            input: "$machines",
                            as: "m",
                            in: {
                                machineId: "$$m.machineId",
                                machineInfo: {
                                    $let: {
                                        vars: {
                                            mDetail: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$machineDetails",
                                                            as: "md",
                                                            cond: {
                                                                $eq: [
                                                                    { $toString: "$$md._id" },
                                                                    "$$m.machineId",
                                                                ],
                                                            },
                                                        },
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                        in: {
                                            _id: "$$mDetail._id",
                                            machineName: "$$mDetail.machineName",
                                            machineNumber: "$$mDetail.machineNumber",
                                            nozzle: {
                                                $map: {
                                                    input: "$$mDetail.nozzle",
                                                    as: "nz",
                                                    in: {
                                                        $let: {
                                                            vars: {
                                                                allotment: {
                                                                    $arrayElemAt: [
                                                                        {
                                                                            $filter: {
                                                                                input: "$$m.nozzles",
                                                                                as: "a",
                                                                                cond: {
                                                                                    $eq: [
                                                                                        "$$a.nozzleId",
                                                                                        { $toString: "$$nz._id" },
                                                                                    ],
                                                                                },
                                                                            },
                                                                        },
                                                                        0,
                                                                    ],
                                                                },
                                                            },
                                                            in: {
                                                                _id: "$$nz._id",
                                                                nozzleNumber: "$$nz.nozzleNumber",
                                                                fuelProductId: "$$nz.fuelProductId",
                                                                isActive: "$$nz.isActive",
                                                                tankId: "$$nz.tankId",
                                                                nozzleStatus: {
                                                                    $ifNull: ["$$allotment.nozzleStatus", null],
                                                                },
                                                                inactiveStatus: {
                                                                    $ifNull: ["$$allotment.inactiveStatus", null],
                                                                },
                                                                staffId: {
                                                                    $ifNull: ["$$allotment.staffId", null],
                                                                },
                                                                staffInfo: {
                                                                    $ifNull: [
                                                                        {
                                                                            $arrayElemAt: [
                                                                                {
                                                                                    $filter: {
                                                                                        input: "$staffDetails",
                                                                                        as: "s",
                                                                                        cond: {
                                                                                            $eq: [
                                                                                                "$$s._id",
                                                                                                "$$allotment.staffId",
                                                                                            ],
                                                                                        },
                                                                                    },
                                                                                },
                                                                                0,
                                                                            ],
                                                                        },
                                                                        null,
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            { $project: { machineDetails: 0, staffDetails: 0 } },
        ];
    }
    async update(adminId, id, dto) {
        const existing = await this.shiftAllotmentModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!existing)
            throw new common_1.NotFoundException("Shift allotment not found");
        if (dto.managers) {
            existing.managers = dto.managers.map((m) => new mongoose_2.Types.ObjectId(m));
        }
        if (dto.machines) {
            existing.machines = dto.machines.map((m) => ({
                machineId: m.machineId,
                nozzles: m.nozzles.map((n) => ({
                    nozzleId: n.nozzleId,
                    staffId: new mongoose_2.Types.ObjectId(n.staffId),
                    nozzleStatus: n.nozzleStatus,
                    inactiveStatus: n.inactiveStatus ?? null,
                })),
            }));
        }
        if (dto.shiftId)
            existing.shiftId = dto.shiftId;
        return existing.save();
    }
    async remove(adminId, id) {
        const doc = await this.shiftAllotmentModel.findOneAndDelete({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!doc)
            throw new common_1.NotFoundException("Shift allotment not found");
        return { deleted: true };
    }
};
exports.ShiftAllotmentService = ShiftAllotmentService;
exports.ShiftAllotmentService = ShiftAllotmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shift_allotment_schema_1.ShiftAllotment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ShiftAllotmentService);
