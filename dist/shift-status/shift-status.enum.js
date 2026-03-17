"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpStatusEnum = exports.ShiftStatusEnum = void 0;
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
