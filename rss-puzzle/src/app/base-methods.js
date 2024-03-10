'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isNull = exports.IsUndefinedType = void 0;
function IsUndefinedType(value) {
    if (typeof value === 'undefined') {
        throw Error('Element is undefined');
    }
}
exports.IsUndefinedType = IsUndefinedType;
function isNull(value) {
    if (value === null) {
        throw Error('Element is null');
    }
}
exports.isNull = isNull;
