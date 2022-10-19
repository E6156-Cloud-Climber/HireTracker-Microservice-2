const express = require('express')
const conn = require('../db_conn')

var api_position = express.Router()

api_position.use(express.json())


api_position.get('/positions', (req, res) => {
    let company_id = req.query.company_id ?? 0
    // let position_id = req.query.position_id ?? 0
    let position_type = req.query.position_type ?? ""
    let year = req.query.year ?? 0
    let active = req.query.active ?? true
    let offset = req.query.offset ?? 0
    let limit = req.query.limit ?? 25


    let sql = `select * from positions`
    // active status must have a value
    if (active) sql += ` and active = ${active}`

    if (company_id) sql += ` where company_id = ${company_id}`
    if (position_type) sql += ` and position_type = ${position_type}`
    if (year) sql += ` and year = ${year}`


    //sql += ` order by id desc`
    sql += ` limit ${limit} offset ${offset}`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json(rows)
    })
})


api_position.post('/positions', (req, res) => {


    let company_id = req.body.company_id;
    let name = req.body.name;
    let position_type = req.body.position_type;

    let year = req.body.year;
    let link = req.body.link ?? "";

    let active = req.body.active;
    let sql = `insert into positions (company_id, name, position_type, active, year, link) 
                values (${company_id}, ${name}, ${position_type}, ${active}, "${year}", ${link})`;

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json({ position_id: rows.insertId })
    });
})



api_position.get('/positions/:position_id', (req, res) => {
    let position_id = req.params.position_id

    let sql = `select * from posts where id = ${position_id}`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else if (rows.length == 0)
            res.status(400).json({ error: "id not exist" })
        else
            res.json(rows[0])
    })
})


api_position.put('/positions/:position_id', (req, res) => {
    let position_id = req.params.position_id;

    let company_id = req.body.company_id;
    let name  = req.body.name ?? null;
    let position_type = req.body.position_type ?? null;
    let active = req.body.active ?? null;

    let year = req.body.year ?? null;
    let link = req.body.link ?? null;

    let sql = `update positions set let company_id = COALESCE(${company_id}, company_id), 
                name = COALESCE(${position_id}, name), 
                position_type = COALESCE(${position_type}, position_type), 
                active = COALESCE(${active}, active), year = COALESCE(${year}, year), 
                link = COALESCE(${link}, link) where id=${position_id}`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json()
    })
})


module.exports = api_position;