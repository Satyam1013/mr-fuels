"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnPaymentModeEnum = exports.CreditStatusEnum = exports.CreditBy = void 0;
var CreditBy;
(function (CreditBy) {
    CreditBy["STAFF"] = "staff";
    CreditBy["MANAGER"] = "manager";
    CreditBy["ADMIN"] = "admin";
})(CreditBy || (exports.CreditBy = CreditBy = {}));
var CreditStatusEnum;
(function (CreditStatusEnum) {
    CreditStatusEnum["TAKEN"] = "taken";
    CreditStatusEnum["RETURNED"] = "returned";
})(CreditStatusEnum || (exports.CreditStatusEnum = CreditStatusEnum = {}));
var ReturnPaymentModeEnum;
(function (ReturnPaymentModeEnum) {
    ReturnPaymentModeEnum["UPI"] = "upi";
    ReturnPaymentModeEnum["POS"] = "pos";
    ReturnPaymentModeEnum["CASH"] = "cash";
})(ReturnPaymentModeEnum || (exports.ReturnPaymentModeEnum = ReturnPaymentModeEnum = {}));
