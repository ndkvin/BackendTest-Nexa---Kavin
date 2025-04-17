import { Router } from "express";
import auth from "./auth.js"
import karyawan from "./karyawan.js"
const router = Router()

router.use("/auth", auth)
router.use("/karyawan", karyawan)
export default router