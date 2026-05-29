import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ShiftAllotment } from "./shift-allotment.schema";
import {
  CreateShiftAllotmentDto,
  UpdateShiftAllotmentDto,
} from "./shift-allotment.dto";
import { ShiftAllotmentResult } from "./shift-allotment.types";

@Injectable()
export class ShiftAllotmentService {
  constructor(
    @InjectModel(ShiftAllotment.name)
    private shiftAllotmentModel: Model<ShiftAllotment>,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateShiftAllotmentDto) {
    const existing = await this.shiftAllotmentModel.findOne({
      adminId,
      shiftId: dto.shiftId,
    });

    if (existing) {
      throw new ConflictException(
        `Shift allotment for shiftId "${dto.shiftId}" already exists`,
      );
    }

    return this.shiftAllotmentModel.create({
      ...dto,
      adminId,
      managers: dto.managers.map((id) => new Types.ObjectId(id)),
      machines: dto.machines.map((m) => ({
        ...m,
        nozzles: m.nozzles.map((n) => ({
          ...n,
          staffId: new Types.ObjectId(n.staffId),
          inactiveStatus: n.inactiveStatus ?? null,
        })),
      })),
    });
  }

  async findAll(adminId: Types.ObjectId) {
    return this.shiftAllotmentModel.aggregate<ShiftAllotmentResult>([
      { $match: { adminId } },
      ...this.populatePipeline(),
    ]);
  }

  async findOne(adminId: Types.ObjectId, id: string) {
    const result =
      await this.shiftAllotmentModel.aggregate<ShiftAllotmentResult>([
        { $match: { _id: new Types.ObjectId(id), adminId } },
        ...this.populatePipeline(),
      ]);

    if (!result.length)
      throw new NotFoundException("Shift allotment not found");
    return result[0];
  }

  private populatePipeline() {
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

  async update(
    adminId: Types.ObjectId,
    id: string,
    dto: UpdateShiftAllotmentDto,
  ) {
    const existing = await this.shiftAllotmentModel.findOne({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) throw new NotFoundException("Shift allotment not found");

    if (dto.managers) {
      existing.managers = dto.managers.map((m) => new Types.ObjectId(m));
    }

    if (dto.machines) {
      existing.machines = dto.machines.map((m) => ({
        machineId: m.machineId,
        nozzles: m.nozzles.map((n) => ({
          nozzleId: n.nozzleId,
          staffId: new Types.ObjectId(n.staffId),
          nozzleStatus: n.nozzleStatus,
          inactiveStatus: n.inactiveStatus ?? null,
        })),
      }));
    }

    if (dto.shiftId) existing.shiftId = dto.shiftId;

    return existing.save();
  }

  async remove(adminId: Types.ObjectId, id: string) {
    const doc = await this.shiftAllotmentModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!doc) throw new NotFoundException("Shift allotment not found");
    return { deleted: true };
  }
}
