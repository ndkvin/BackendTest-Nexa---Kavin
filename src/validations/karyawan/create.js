import Joi from "joi"

const schema = Joi.object({
  nama: Joi.string()

    .required(),

  photo: Joi.string()
    .required(),
})

export default schema