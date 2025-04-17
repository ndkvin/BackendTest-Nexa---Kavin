import Joi from "joi"

const schema = Joi.object({
  nama: Joi.string(),

  photo: Joi.string(),
})

export default schema