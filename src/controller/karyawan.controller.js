import dotenv from 'dotenv';
import karyawanRepository from "../repository/karyawan.repository.js";
import createKaryawanSchema from "../validations/karyawan/create.js"
import updateKaryawanSchema from "../validations/karyawan/update.js"
import UnprocessableEntity from '../exceptions/unporcessable.entitiy.js';
import NotFoundError from '../exceptions/not.found.js';
import BadRequest from '../exceptions/bad.request.js';

dotenv.config();

export default class AuthController {
    constructor() {
        this.karyawanRepository = new karyawanRepository();

        this.getAllKaryawan = this.getAllKaryawan.bind(this);
        this.createKaryawan = this.createKaryawan.bind(this);
        this.updateKaryawan = this.updateKaryawan.bind(this);
        this.nonaktifKaryawan = this.nonaktifKaryawan.bind(this);
    }

    async nonaktifKaryawan(req, res, next) {
        try {
            const { nip } = req.params;

            let karyawan = await this.karyawanRepository.getKaryawanByNIP(nip);

            if (!karyawan) {
                throw new NotFoundError("Data not found");
            }

            const result = await this.karyawanRepository.nonaktifkanKaryawan(nip);

            if (result.affectedRows === 0) throw new BadRequest("Gagal menonaktifkan karyawan"); 
            karyawan = await this.karyawanRepository.getKaryawanByNIP(nip);
            return res.status(200).json({
                success: true,
                code: 200,
                status: "OK",
                message: "Karyawan nonaktif successfully",
                data: karyawan
            });

        } catch (error) {
            next(error);
        }
    }

    async updateKaryawan(req, res, next) {
        try {
            const { nip } = req.params; 
            const updateData = req.body;

            const { error } = await updateKaryawanSchema.validate(req.body);

            if (error) throw new UnprocessableEntity(error.details[0].message);


            const updatedKaryawan = await this.karyawanRepository.updateKaryawan(nip, updateData);

            return res.json({
                success: true,
                code: 200,
                status: "OK",
                message: "Karyawan updated successfully",
                data: updatedKaryawan
            });

        } catch (error) {
            next(error);
        }
    }

    async getAllKaryawan(req, res, next) {
        try {
            const { keyword = '', start = 0, count = 10 } = req.query;

            if (isNaN(start) || isNaN(count)) {
                throw new UnprocessableEntity('start dan count harus berupa angka');
            }

            const data = await this.karyawanRepository.getAllKaryawan(keyword, start, count);

            if (data.length === 0) {
                throw new NotFoundError("Data not found");
            }

            return res.json({
                success: true,
                code: 200,
                status: "OK",
                message: "Karyawan data",
                data
            });

        } catch (error) {
            next(error);
        }
    }


    async createKaryawan(req, res, next) {
        try {
            const { error } = await createKaryawanSchema.validate(req.body);

            if (error) throw new UnprocessableEntity(error.details[0].message);

            const { affectedRows, nip } = await this.karyawanRepository.create(req.body);

            if (affectedRows === 0) {
                throw new Error("Failed to create karyawan");
            }

            const data = await this.karyawanRepository.getKaryawanByNIP(nip);
            res.status(201).json({
                success: true,
                code: 201,
                status: "Created",
                message: "Karyawan created successfully",
                data
            });
        } catch (error) {
            next(error)
        }
    }
}