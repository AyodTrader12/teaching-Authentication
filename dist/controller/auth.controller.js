"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.loginAccount = exports.createAccount = void 0;
const auth_model_1 = __importDefault(require("../model/auth.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const mail_service_1 = require("../services/mail.service");
dotenv_1.default.config();
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        //       const existing = await authModel.findOne({ email });
        //   if (existing) {
        //     const message =
        //       existing.email === email ? "Email already in use" : "Username already taken";
        //     throw new Error( message);
        //   }
        const salt = yield bcrypt_1.default.genSalt(9);
        const passwordHash = yield bcrypt_1.default.hash(password, salt);
        const GenerateOtp = crypto_1.default.randomInt(100000, 999999).toString();
        const newUser = yield auth_model_1.default.create({
            name,
            email,
            password: passwordHash,
            otp: GenerateOtp
        });
        res.status(201).json({
            message: "account created successfully",
            data: newUser,
            status: 201
        });
        yield (0, mail_service_1.createAccountEmail)(newUser);
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
            status: 404
        });
    }
});
exports.createAccount = createAccount;
const loginAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield auth_model_1.default.findOne({
            email,
        });
        if (user) {
            const check = yield bcrypt_1.default.compare(password, user.password);
            if (check) {
                if (user.password && user.otp === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRESIN,
                    });
                    return res.status(201).json({
                        message: "account logged in succesful",
                        data: token,
                        status: 201,
                    });
                }
                else {
                    return res.status(404).json({
                        message: "please verify your account",
                        status: 404,
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "error with email",
                    status: 404,
                });
            }
        }
        else {
            return res.status(404).json({
                message: "error with password",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error loggging in Account",
            status: 404
        });
    }
});
exports.loginAccount = loginAccount;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        if (!otp) {
            return res.status(404).json({ message: "OTP is required" });
        }
        const user = yield auth_model_1.default.findOne({ otp });
        if (!user) {
            return res.status(404).json({ message: "Invalid OTP" });
        }
        yield (0, mail_service_1.verifyAccountEmail)(user);
        user.isVerified = true;
        user.otp = "";
        yield user.save();
        return res.status(201).json({
            message: "account verified",
            status: 201,
        });
    }
    catch (error) {
        return error;
    }
});
exports.verifyOTP = verifyOTP;
