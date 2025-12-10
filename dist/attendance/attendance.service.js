"use strict";
// /* eslint-disable prefer-const */
// import { Injectable, NotFoundException } from "@nestjs/common";
// import dayjs from "dayjs";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";
// import { Attendance, AttendanceDocument } from "./attendance.schema";
// import { getDateRange } from "../utils/date";
// import { FilterType } from "../home/home.dto";
// import { Admin, AdminDocument } from "../admin/admin.schema";
// import { Employee } from "../common/types";
// import { AttendanceStatus } from "./attendance.dto";
// @Injectable()
// export class AttendanceService {
//   constructor(
//     @InjectModel(Attendance.name)
//     private attendanceModel: Model<AttendanceDocument>,
//     @InjectModel(Admin.name)
//     private adminModel: Model<AdminDocument>,
//   ) {}
//   async getEmpData(
//     pumpId: string,
//     role: "admin" | "manager",
//     date: string,
//     mode: "day" | "week" | "month" = "day",
//   ) {
//     // 1. Calculate date range
//     let { startDate, endDate } = getDateRange(
//       mode.toUpperCase() as FilterType,
//       date,
//     );
//     const today = dayjs().endOf("day").toDate();
//     if (endDate > today) {
//       endDate = today;
//     }
//     // 2. Get admin with managers + staff
//     const admin = await this.adminModel.findById(pumpId).lean();
//     if (!admin) throw new NotFoundException("Pump not found");
//     let employees: Employee[] = [];
//     if (role === "admin") {
//       employees = [
//         ...(admin.managers as unknown as Employee[]),
//         ...(admin.staff as unknown as Employee[]),
//       ];
//     } else {
//       employees = admin.staff as unknown as Employee[];
//     }
//     // 3. Filter employees by joining date
//     employees = employees.filter((emp) => {
//       if (!emp.dateJoined) return true;
//       const joined = dayjs(emp.dateJoined).startOf("day").toDate();
//       return joined <= endDate;
//     });
//     // 4. Fetch attendance records
//     const records = await this.attendanceModel
//       .find({
//         pumpId,
//         date: { $gte: startDate, $lte: endDate },
//       })
//       .lean();
//     const recordMap = new Map<string, any>();
//     for (const r of records) {
//       const key = `${r.userId.toString()}-${new Date(r.date).toDateString()}`;
//       recordMap.set(key, r);
//     }
//     // 5. Build empData
//     const empData = employees.map((emp) => {
//       const attendance: { day: number; status: string }[] = [];
//       let loopStart = new Date(startDate);
//       let loopEnd = new Date(endDate);
//       // 🔹 Ensure loop is restricted by mode
//       if (mode === "day") {
//         loopEnd = loopStart;
//       } else if (mode === "week") {
//         loopStart = dayjs(date).startOf("week").toDate();
//         loopEnd = dayjs(date).endOf("week").toDate();
//         if (loopEnd > today) loopEnd = today; // cap at today
//       } else if (mode === "month") {
//         loopStart = dayjs(date).startOf("month").toDate();
//         loopEnd = dayjs(date).endOf("month").toDate();
//         if (loopEnd > today) loopEnd = today;
//       }
//       for (
//         let d = new Date(loopStart);
//         d <= loopEnd;
//         d.setDate(d.getDate() + 1)
//       ) {
//         const empId = emp._id.toString();
//         const key = `${empId}-${d.toDateString()}`;
//         const rec = recordMap.get(key) as { status?: string } | undefined;
//         attendance.push({
//           day: d.getDate(),
//           status: rec?.status ?? AttendanceStatus.ABSENT,
//         });
//       }
//       return {
//         name: emp.name,
//         id: emp._id,
//         attendance,
//         salary: emp.salary ?? 0,
//         salaryType: emp.salaryType ?? "N/A",
//         salaryPending: emp.salaryPending ?? false,
//         credit: emp.credit ?? 0,
//         creditLeft: emp.creditLeft ?? 0,
//         paidLeave: emp.paidLeave ?? false,
//         dateJoined: emp.dateJoined ?? null,
//         role: emp.role ?? "staff",
//         shift: emp.shift ?? 1,
//         document:
//           typeof emp.document === "object" && emp.document !== null
//             ? (emp.document as Record<string, unknown>)
//             : null,
//         pendingSalaryRecords: emp.pendingSalaryRecords || [],
//       };
//     });
//     // 6. Compute summary
//     const summary = {
//       totalSalaryDue: empData.reduce(
//         (s, e) => s + (e.salaryPending ? e.salary : 0),
//         0,
//       ),
//       totalSalaryGiven: empData.reduce(
//         (s, e) => s + (e.salaryPending ? 0 : e.salary),
//         0,
//       ),
//       totalAdvanceTaken: empData.reduce((s, e) => s + (e.credit || 0), 0),
//       totalShortageGiven: empData.reduce((s, e) => s + (e.creditLeft || 0), 0),
//     };
//     return { empData: [{ date, emp: empData, summary }], summary };
//   }
//   async updateAttendance(
//     pumpId: string,
//     empId: string,
//     role: "manager" | "staff",
//     date: string,
//     status: AttendanceStatus,
//   ) {
//     // ✅ Normalize to YYYY-MM-DD string
//     const normalizedDate = dayjs(date).format("YYYY-MM-DD");
//     const existing = await this.attendanceModel.findOne({
//       pumpId,
//       userId: empId,
//       date: normalizedDate,
//       role,
//     });
//     if (existing) {
//       existing.status = status;
//       await existing.save();
//     } else {
//       await this.attendanceModel.create({
//         pumpId,
//         userId: empId,
//         role,
//         date: normalizedDate,
//         status,
//       });
//     }
//   }
// }
