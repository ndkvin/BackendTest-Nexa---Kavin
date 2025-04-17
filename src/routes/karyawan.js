import { Router } from "express";
import KaryawanController from "../controller/karyawan.controller.js";
import AuthMiddleware from "../middleware/auth.js";

const router = Router();
const authMiddleware = new AuthMiddleware();

const karyawanController = new KaryawanController(); 

router.post("/", authMiddleware.isLogin, karyawanController.createKaryawan);
router.get("/", authMiddleware.isLogin, karyawanController.getAllKaryawan);
router.put('/:nip', authMiddleware.isLogin, karyawanController.updateKaryawan);
router.post('/:nip/nonaktif', authMiddleware.isLogin, karyawanController.nonaktifKaryawan);
export default router;
