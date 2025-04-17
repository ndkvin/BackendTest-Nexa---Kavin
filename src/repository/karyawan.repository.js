import connection from "../database/connection.js";

export default class karyawanRepository {

    constructor() {
        this.connection = connection;

        this.crate = this.create.bind(this);  
        this.getLatestNIP = this.getLatestNIP.bind(this);
        this.getKaryawanByNIP = this.getKaryawanByNIP.bind(this);
        this.getAllKaryawan = this.getAllKaryawan.bind(this);
        this.updateKaryawan = this.updateKaryawan.bind(this);
        this.nonaktifkanKaryawan = this.nonaktifkanKaryawan.bind(this);
    }

    async getAllKaryawan(keyword = '', start = 0, count = 10) {
        const searchKeyword = `%${keyword}%`;
        const [rows] = await this.connection.query(
            `SELECT * FROM karyawan WHERE nama LIKE ? ORDER BY created_at ASC LIMIT ?, ?`,
            [searchKeyword, parseInt(start), parseInt(count)]
        );

        return rows;
    }

    async create(nama, photo) {
        const data = await this.getLatestNIP(new Date().getFullYear());

        let nip = `${new Date().getFullYear()}0001`

        if (data) {
            const lastXXXX = parseInt(data.nip.slice(4), 10); // Ambil 4 digit terakhir
            nip = `${new Date().getFullYear()}${String(lastXXXX + 1).padStart(4, '0')}`;
        }

        const [result] = await this.connection.query(
            `INSERT INTO karyawan (nip, nama, photo) VALUES (?, ?, ?)`, 
            [nip, nama, photo]);
        
        return { affectedRows: result.affectedRows, nip };
    }

    async updateKaryawan(nip, updateData) {
        try {
            // Create SET clause dynamically
            const fields = Object.keys(updateData);
            const values = Object.values(updateData);
            
            if (fields.length === 0) {
                throw new Error('No fields to update');
            }
            
            // Create placeholders for the SET clause
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            
            // Add updated_at timestamp
            const queryString = `
                UPDATE karyawan 
                SET ${setClause}
                WHERE nip = ?
            `;
            
            // Add the NIP as the last parameter
            values.push(nip);
            
            const [result] = await this.connection.query(queryString, values);
            
            if (result.affectedRows === 0) {
                throw new NotFoundError(`Failed to update karyawan with NIP ${nip}`);
            }
            
            // Fetch and return the updated record
            const [updatedRow] = await this.connection.query(
                'SELECT * FROM karyawan WHERE nip = ?', 
                [nip]
            );
            
            return updatedRow[0];
        } catch (error) {
            // Log the error and rethrow
            console.error('Error updating karyawan:', error.message);
            throw error;
        }
    }
    
    async nonaktifkanKaryawan(nip) {
        const [result] = await this.connection.query(
            `UPDATE karyawan SET status = 9 WHERE nip = ?`, 
            [nip]);
        
        return result.affectedRows;
    }

    async getLatestNIP(year) {
        const [results] = await this.connection.query(
            `SELECT nip FROM karyawan WHERE nip LIKE ? ORDER BY nip DESC LIMIT 1`, 
            [`${year}%`]);
        
        return results[0]
    }

    async getKaryawanByNIP(nip) {
        const [results] = await this.connection.query(
            `SELECT * FROM karyawan WHERE nip = ?`, 
            [nip]);
        
        return results[0]
    }
}