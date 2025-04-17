import connection from './connection.js';

async function runMigration() {
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS admin_token (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS karyawan (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nip VARCHAR(20) NOT NULL UNIQUE,
                nama VARCHAR(255) NOT NULL,
                photo LONGTEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status INT DEFAULT 1
            )
        `);

        console.log('Migration completed.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

runMigration();