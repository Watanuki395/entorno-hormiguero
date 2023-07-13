require('dotenv').config()
const express = require('express')
const http = require('http')

const app = express()
const port = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.json({status: 200,
message: "Entorno en linea, version 2"})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})