const express = require('express')
const conn = require('../db_conn')

var api_company = express.Router()

api_company.use(express.json())

api_company.get('/companies', (req, res) => {
    let search_string = req.query.search_string ?? ""
    let offset = Number(req.query.offset ?? 0);
    let limit = Number(req.query.limit ?? 25);
    let sql = `select * from companies where name like '%${search_string}%' limit ${limit} offset ${offset}`

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            res.status(500).json({ error: err })
            return
        } else if (rows.length == 0)
            res.status(400).json({ error: "no results matched" })
        else {
        // total count
            let sql_total = `select count(*) as total from companies`

            conn.query(sql_total, (err1, totals, fields) => {
                if (err1) {
                    res.status(500).json({ error: err1 })
                    return
                }

                let total = totals[0].total

                res.json({
                    companies: rows,
                    links: {
                        next: offset + limit < total ? `/companies?offset=${offset + limit}&limit=${limit}` : '',
                        prev: offset > 0 ? `/companies?offset=${Math.max(offset - limit, 0)}&limit=${limit}` : ''
                    }
                })
            })
        }
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