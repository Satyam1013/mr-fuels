"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpStatusEnum = exports.ShiftStatusEnum = exports.ClosedBy = void 0;
var ClosedBy;
(function (ClosedBy) {
    ClosedBy["MANAGER"] = "manager";
    ClosedBy["ADMIN"] = "admin";
})(ClosedBy || (exports.ClosedBy = ClosedBy = {}));
var ShiftStatusEnum;
(function (ShiftStatusEnum) {
    ShiftStatusEnum["ACTIVE"] = "active";
    ShiftStatusEnum["PENDING"] = "pending";
    ShiftStatusEnum["COMPLETED"] = "completed";
})(ShiftStatusEnum || (exports.ShiftStatusEnum = ShiftStatusEnum = {}));
var PumpStatusEnum;
(function (PumpStatusEnum) {
    PumpStatusEnum["OPEN"] = "open";
    PumpStatusEnum["CLOSED"] = "closed";
    PumpStatusEnum["HOLIDAY"] = "holiday";
})(PumpStatusEnum || (exports.PumpStatusEnum = PumpStatusEnum = {}));
