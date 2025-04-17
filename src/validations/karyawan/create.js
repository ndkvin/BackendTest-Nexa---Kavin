import Joi from "joi"

const schema = Joi.object({
    nama: Joi.string()
        .required(),

    photo: Joi.string()
        .required(),

    alamat: Joi.string()
        .required(),
    gender: Joi.string()
        .valid('L', 'P')
        .required(),
    tanggal_lahir: Joi.date().required()
})

export default schema