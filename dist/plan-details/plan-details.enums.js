"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = exports.DurationType = exports.PlanStatus = exports.PlanName = void 0;
var PlanName;
(function (PlanName) {
    PlanName["PRO"] = "pro";
    PlanName["PREMIUM"] = "premium";
})(PlanName || (exports.PlanName = PlanName = {}));
var PlanStatus;
(function (PlanStatus) {
    PlanStatus["ACTIVE"] = "active";
    PlanStatus["INACTIVE"] = "inactive";
})(PlanStatus || (exports.PlanStatus = PlanStatus = {}));
var DurationType;
(function (DurationType) {
    DurationType["TRIAL"] = "trial";
    DurationType["MONTHLY"] = "monthly";
    DurationType["YEARLY"] = "yearly";
})(DurationType || (exports.DurationType = DurationType = {}));
var Currency;
(function (Currency) {
    Currency["INR"] = "INR";
})(Currency || (exports.Currency = Currency = {}));
