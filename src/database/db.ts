import mysql from 'mysql2/promise';

const connectionDB =  async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            password: 'password',
            user: 'root',
            database: 'biblioteca',
        });
        return connection;
    } catch (error) {
        console.log(`Erro ao conectar com o banco de dados: ${error}`)
    }
}
