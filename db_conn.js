const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPWD,
    database: process.env.DBNAME
})

conn.connect()

module.exports = conn