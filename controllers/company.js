const express = require('express')
const conn = require('../db_conn')

var api_company = express.Router()

api_company.use(express.json())

api_company.get('/companies', (req, res) => {
    let search_string = req.query.search_string ?? ""
    let offset = req.query.offset ?? 0
    let limit = req.query.limit ?? 25

    conn.query(`select * from companies where name like '%${search_string}%' limit ${limit} offset ${offset}`, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else if (rows.length == 0)
            res.status(400).json({ error: "no results matched" })
        else
            res.json(rows)
    })
})

api_company.post('/companies', (req, res) => {
    let name = req.body.name

    if (!name) return res.status(400).json({ error: "name must be non-empty" })

    conn.query(`insert into companies (name) values ('${name}')`, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json({ company_id: rows.insertId })
    })
})

api_company.get('/companies/:company_id', (req, res) => {
    let company_id = req.params.company_id

    conn.query(`select * from companies where id = ${company_id}`, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else if (rows.length == 0)
            res.status(400).json({ error: "Invalid Company ID" })
        else
            res.json(rows[0])
    })
})

api_company.put('/companies/:company_id', (req, res) => {
    let company_id = req.params.company_id
    let name = req.body.name

    if (!name) return res.status(400).json({ error: "name must be non-empty" })

    conn.query(`update companies set name = '${name}' where id = ${company_id}`, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.status(200).json()
    })
})

module.exports = api_company;