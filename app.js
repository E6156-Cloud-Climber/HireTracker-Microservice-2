const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use('/api', require('./controllers/company'));
app.use('/api', require('./controllers/position'));


app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})