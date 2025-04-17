import Joi from "joi"

const schema = Joi.object({
    nama: Joi.string(),
    photo: Joi.string(),
    alamat: Joi.string(),
    gender: Joi.string()
        .valid('L', 'P'),
    tanggal_lahir: Joi.date()
})

export default schema