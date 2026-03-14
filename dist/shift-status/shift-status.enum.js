"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftStatusEnum = exports.ClosedBy = void 0;
var ClosedBy;
(function (ClosedBy) {
    ClosedBy["MANAGER"] = "manager";
    ClosedBy["OWNER"] = "owner";
})(ClosedBy || (exports.ClosedBy = ClosedBy = {}));
var ShiftStatusEnum;
(function (ShiftStatusEnum) {
    ShiftStatusEnum["ACTIVE"] = "active";
    ShiftStatusEnum["PENDING"] = "pending";
    ShiftStatusEnum["COMPLETED"] = "completed";
})(ShiftStatusEnum || (exports.ShiftStatusEnum = ShiftStatusEnum = {}));
