require('dotenv').config();
const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')

// ESTABLISHING MONGODB NODESERVER CONNECTION(CHECK .env file). Enter "npm start" or "node app" to run app.js
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('MongoDB Server Database Connection Established...')
})

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Serve static files from the 'public' folder
app.use(express.static('public'))

// Set the view engine and views directory
app.set('view engine', 'ejs'); // or your preferred template engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory



app.listen(3000, () => {
    console.log("listening to port 3000")
});

//Note: PUBLIC FOLDER = CSS, JS | VIEWS FOLDER = HTML
// If nodemon app not working, try node app for temporary fix
//ROUTES
app.get('/', (req, res) => {
    res.render('index', {title: "Inventory Management | Login"}); // Renders the 'index.ejs' file in the 'views' directory
});