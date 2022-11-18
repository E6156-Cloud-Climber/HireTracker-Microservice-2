const express = require('express')
const conn = require('../db_conn')

var api_position = express.Router()

api_position.use(express.json())


api_position.get('/positions', (req, res) => {
    let company_id = req.query.company_id ?? 0;
    // let position_id = req.query.position_id ?? 0
    let search_string = req.query.search_string ?? "";
    let position_type = req.query.position_type ?? "";
    let year = req.query.year ?? 0;
    let active = req.query.active ?? 1;
    let offset = Number(req.query.offset ?? 0)
    let limit = Number(req.query.limit ?? 25)

    var count = 0;
    let sql = `select * from positions`
    let sql_total = `select count(*) from positions`
    if (company_id || search_string || position_type || year || active) sql += ` where`

    if (search_string) {
        sql +=  ` name like '%${search_string}%'`;
        sql_total +=  ` name like '%${search_string}%'`;
        count += 1
    }

    if (position_type) {
        if (count) {
            sql += ` and position_type = '${position_type}'`
            sql_total += ` and position_type = '${position_type}'`
        } else {
            sql += ` position_type = '${position_type}'`
            sql_total += ` position_type = '${position_type}'`
            count+= 1
        }
    }

    if (company_id) {
        if (count) {
            sql += ` and company_id = ${company_id}`
        } else {
            sql += ` company_id = ${company_id}`
            count+= 1
        }
    }
    if (year) {
        if (count) {
            sql += ` and year = ${year}`
        } else {
            sql += ` year = ${year}`
            count+= 1
        }
    }


    if (count) {
        sql += ` and active = ${active}`
    } else {
        sql += ` active = ${active}`
        count+= 1
    }


    //sql += ` order by id desc`
    sql += ` limit ${limit} offset ${offset}`;

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else {
            rows.forEach(
                (row) => {
                    row["links"] = {
                    "company": `/companies/${row.company_id}`
                    };
                }
            )

            conn.query(sql_total, (err1, totals, fields) => {
                if (err1) {
                    res.status(500).json({error: err1})
                    return
                }

                let total = totals[0].total

                res.json({
                    positions: rows,
                    links: {
                        next: offset + limit < total ? `/positions?offset=${offset + limit}&limit=${limit}` : '',
                        prev: offset > 0 ? `/positions?offset=${Math.max(offset - limit, 0)}&limit=${limit}` : ''
                    }
                })
            })
        }
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
                values (${company_id}, '${name}', '${position_type}', ${active}, ${year}, '${link}')`;

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json({ position_id: rows.insertId })
    });
})



api_position.get('/positions/:position_id', (req, res) => {
    let position_id = req.params.position_id

    let sql = `select * from positions where id = ${position_id}`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else if (rows.length === 0)
            res.status(400).json({ error: "id not exist" })
        else {
            let position = rows[0]
            position.links = {
                company: `/companies/${position.company_id}`
            }
            res.json(position)
        }
    })
})


api_position.put('/positions/:position_id', (req, res) => {
    let position_id = req.params.position_id;

    let company_id = req.body.company_id ?? 0;
    let name  = req.body.name ?? '';
    let position_type = req.body.position_type ?? '';
    let active = req.body.active ?? null;

    let year = req.body.year ?? null;
    let link = req.body.link ?? '';

    let sql = `update positions set company_id = COALESCE(NULLIF(${company_id}, 0), company_id), 
                name = COALESCE(NULLIF('${name}', ''), name), 
                position_type = COALESCE(NULLIF('${position_type}', ''), position_type), 
                active = COALESCE(${active}, active), year = COALESCE(${year}, year), 
                link = COALESCE(NULLIF('${link}', ''), link) where id=${position_id}`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.status(200).json({error : 'Successfully updated'})
    })
})


module.exports = api_position;