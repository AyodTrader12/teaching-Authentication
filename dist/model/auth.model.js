"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mongoose_1 = require("mongoose");
const authModel = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20
    },
    email: {
        type: String,
        unoque: true,
        required: true,
    },
    password: {
        type: String,
        require: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: ""
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("users", authModel);
exports.user = (0, mongoose_1.model)("user", authModel);
