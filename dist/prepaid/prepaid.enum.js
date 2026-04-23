"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrepaidProductTypeEnum = exports.PrepaidModeEnum = exports.ShiftStatus = void 0;
var ShiftStatus;
(function (ShiftStatus) {
    ShiftStatus["OPEN"] = "open";
    ShiftStatus["CLOSED"] = "closed";
})(ShiftStatus || (exports.ShiftStatus = ShiftStatus = {}));
var PrepaidModeEnum;
(function (PrepaidModeEnum) {
    PrepaidModeEnum["DEPOSIT"] = "deposit";
    PrepaidModeEnum["TRANSIT"] = "transit";
})(PrepaidModeEnum || (exports.PrepaidModeEnum = PrepaidModeEnum = {}));
var PrepaidProductTypeEnum;
(function (PrepaidProductTypeEnum) {
    PrepaidProductTypeEnum["FUEL"] = "fuelType";
    PrepaidProductTypeEnum["NON_FUEL"] = "nonFuelType";
})(PrepaidProductTypeEnum || (exports.PrepaidProductTypeEnum = PrepaidProductTypeEnum = {}));
