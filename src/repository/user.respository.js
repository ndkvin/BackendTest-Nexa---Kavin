import connection from "../database/connection.js";
import Bcrypt from "../utils/bcrypt.js";

export default class UserRepository {
  constructor() {
    this.connection = connection;
    this.bcyrpt = new Bcrypt();

    this.findByEmail = this.findByEmail.bind(this)
    this.findByUsername = this.findByUsername.bind(this)
    this.create = this.create.bind(this)
    this.comparePassword = this.comparePassword.bind(this)

  }
  async findById(id) {
    const [results] = await this.connection.query(
      `SELECT * FROM users where id = ?`, 
      [id]);
    return results[0]
  }

  async findByEmail(email) {
    const [results] = await this.connection.query(
      `SELECT * FROM users where email = ?`, 
      [email]);
    return results[0]
  }

  async findByUsername(username) {
    const [results] = await this.connection.query(
      `SELECT * FROM users where username = ?`, 
      [username]);
    return results[0]
  }

  async create(username, password) {
    password = await this.bcyrpt.hash(password);

    const [result] = await this.connection.query(
      `INSERT INTO users (username, password) VALUES (?, ?)`, 
      [username, password]);
    
    return result.affectedRows;
  }

  async comparePassword(password, hash) {
    return await this.bcyrpt.compare(password, hash);
  }
}