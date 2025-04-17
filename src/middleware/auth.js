import UnauthorizedError from "../exceptions/unauthorized.js";
import TokenRepository from "../repository/admin.token.respository.js";
import UserRepository from "../repository/user.respository.js";

export default class AuthMiddleware {
  constructor() {
    this.isLogin = this.isLogin.bind(this);
    this.tokenRepository = new TokenRepository();
    this.userRepository = new UserRepository();
  }

  async isLogin(req, res, next) {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return res.status(401).json({
        success: false,
        code: 401,
        status: "Unauthorized",
        errors: "Bearer Token is required"
      });
    }
    const token = bearerToken.split(' ')[1];

    try {
      const { user_id } = await this.tokenRepository.findByToken(token);

      if (!user_id) {
        throw new UnauthorizedError ("Token not found");
      }

      const user = await this.userRepository.findById(user_id);

      req.user = user;
      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        code: 401,
        status: "Unauthorized",
        errors: "Invalid Token"
      });
    }
  }
}