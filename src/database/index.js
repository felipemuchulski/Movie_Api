const sql = require("mssql");

async function sqlServerConnection() {
    const config = {
        server: 'localhost',
        user: 'seu_usuario',
        password: "sua_senha",
        database: "Movie_Api",
        options: {
            encrypt: false
        }
    };
    try {
        const pool = await sql.connect(config);
        console.log('SQL Server connecting...');
        return pool;
    } catch (err) {
        console.error("Erro to connect SQL Server");
        throw err;
    }
}

module.exports = sqlServerConnection;