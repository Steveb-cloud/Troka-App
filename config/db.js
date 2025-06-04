import sql from 'mssql';

const dbConfig = {
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_HOST || '',
    database: process.env.DB_DATABASE || 'TrokaDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    port: parseInt(process.env.DB_PORT) || 1433
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('🟢 Conectado a SQL Server');
        return pool;
    })
    .catch(err => console.error('❌ Error de conexión:', err));

export { sql, poolPromise };
