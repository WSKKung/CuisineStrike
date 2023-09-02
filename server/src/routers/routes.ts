import * as accounts from "../middlewares/account"
import { Router } from "express"

const router = Router()

router.get("/profile", accounts.authorize, accounts.fetchProfile)
router.post("/register", accounts.register)
router.post("/login", accounts.authenticate)

export default router