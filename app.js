require('dotenv').config();
const express = require('express')
const app = express();
const path = require ('path');
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')




//ESTABLISHING MONGODB NODESERVER CONNECTION(CHECK .env file). Enter "npm start" or "node app" to run app.js
mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true} )
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('MongoDB Server Database Connection Established...')
})

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// END OF ESTABLISHING MONGODB CONNECTION






