import UserRepository from "../repository/user.respository.js";
import registerSchema from "../validations/auth/register.js"
import loginSchema from "../validations/auth/login.js"
import dotenv from 'dotenv';
import UnprocessableEntity from '../exceptions/unporcessable.entitiy.js';
import UnauthorizedError from '../exceptions/unauthorized.js';
import BadRequest from '../exceptions/bad.request.js';
import AES from '../utils/aes.js';
import TokenRepository from '../repository/admin.token.respository.js';
dotenv.config();

export default class AuthController {
  constructor() {
    this.userRepository = new UserRepository();
    this.aes = new AES();
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.tokenRepository = new TokenRepository();  
  }

  async login(req, res, next) {
    try {
      const { error } = await loginSchema.validate(req.body);

      if (error) throw new UnprocessableEntity(error.details[0].message)

      const { username, password } = req.body

      const user = await this.userRepository.findByUsername(username)

      if (!user) throw new UnauthorizedError("Username not found")

      const isPasswordValid = await this.userRepository.comparePassword(password, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          code: 401,
          status: "Unauthorized",
          message: "Password not valid"
        });
      }
      console.log(`User ${user.username} logged in successfully.`);

      const { username: usr, password: pass } = user

      const token = this.aes.encrypt(`${usr}|${pass}`)

      await this.tokenRepository.create(user.id, token)

      res.status(200)
        .json({
          success: true,
          code: 200,
          status: "OK",
          message: "Login Success",
          data: {
            token
          }
        })
    } catch (error) {
      next(error)
    }
  }

  async register(req, res, next) {
    try {
      const { error } = await registerSchema.validate(req.body);

      if (error) throw new UnprocessableEntity(error.details[0].message)

      const { username, password } = req.body

      const user = await this.userRepository.findByUsername(username)

      if (user) throw new BadRequest("Username already taken")

      await this.userRepository.create(username, password)
 
      const { id } = await this.userRepository.findByUsername(username)

      return res.status(201)
        .json({
          success: true,
          code: 201,
          status: "Created",
          message: "User Created",
          data: {
            id,
            username
          }
        })
    } catch (error) {
      next(error)
    }
  }
}