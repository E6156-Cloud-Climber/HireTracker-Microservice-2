const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
// const mw_notify = require('./middleware/notify')

app.use(express.json());
// app.use(mw_notify())
app.use('/api', require('./controllers/company'));
app.use('/api', require('./controllers/position'));


app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})