import connection from "../database/connection.js";
import Bcrypt from "../utils/bcrypt.js";

export default class TokenRepository {
  constructor() {
    this.connection = connection;
    this.bcyrpt = new Bcrypt();

    this.findByToken = this.findByToken.bind(this)
    this.create = this.create.bind(this)
  }
  async findByToken(token) {
    const [results] = await this.connection.query(
      `SELECT * FROM admin_token where token = ?`, 
      [token]);
    return results[0]
  }

  async create(userId, token) {
    const [result] = await this.connection.query(
      `INSERT INTO admin_token (user_id, token) VALUES (?, ?)`, 
      [userId, token]);
    
    return result.affectedRows;
  }
}