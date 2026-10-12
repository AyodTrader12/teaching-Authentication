import { Router } from "express";
import { createAccount, loginAccount, verifyOTP } from "../controller/auth.controller";

const router =  Router()

router.post("/register",createAccount)
router.post("/verify-account",verifyOTP)
router.post("/login",loginAccount)

export default router