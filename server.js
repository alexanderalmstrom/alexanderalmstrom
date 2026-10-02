require('dotenv').config()

const path = require('path')
const express = require('express')
const morgan = require('morgan')

const env = process.env.NODE_ENV || 'production'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

if (env == 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

app.use(express.static(path.resolve(__dirname, 'build')))

// Express 5 uses path-to-regexp 8, which requires a named wildcard parameter
// instead of a bare '*'.
app.get('/{*splat}', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

app.listen(port, function () {
  console.log('Listening on port %s', port)
})
