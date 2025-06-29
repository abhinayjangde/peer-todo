
import express from "express"
import { forgotPassword, login, logout, me, register, resetPassword, verifyEmail } from "../controllers/user.controller.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/register", register)
router.get("/verify/:token", verifyEmail)
router.post("/login", login)
router.get("/me", isLoggedIn, me)
router.get("/logout", isLoggedIn, logout)
router.post("/forget-password", forgotPassword)
router.put("/reset-password/:token", resetPassword)

export default router