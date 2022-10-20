const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPW,
    database: "microservice2"
})

conn.connect()

module.exports = conn