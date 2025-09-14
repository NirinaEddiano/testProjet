
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'sql7.freesqldatabase.com', 
  port:3306,
  user: 'sql7798615',     
  password: 'Fau4Ajzeag',     
  database: 'sql7798615',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
