import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'andyortegak',
  database: 'blog_db',
  password: 'kou12345',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
