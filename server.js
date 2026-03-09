require('dotenv').config()
var express = require('express')
var app = express()
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
var path = require('path')

mongoose.connect(process.env.MONGO_URI).then(function () {
  console.log('db connected')
}).catch(function (err) {
  console.log('db connection error', err)
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

var indexRoute = require('./routes/index')
var authRoute = require('./routes/auth')
var qrRoute = require('./routes/qr')

app.use('/', indexRoute)
app.use('/auth', authRoute)
app.use('/qr', qrRoute)

var serverPort = process.env.PORT || 3000
app.listen(serverPort, function () {
  console.log("listening on port " + serverPort)
})
