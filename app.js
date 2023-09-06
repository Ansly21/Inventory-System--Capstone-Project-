require('dotenv').config();
const express = require('express')
const app = express();
const path = require ('path');
const mongoose = require('mongoose');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const Product = require('./models/products');

//Set EJS as the View engine
app.set('view engine', 'ejs');


//IMPORT ROUTES(/routes/)

//const pagesRoute = require('./routes/pages')



app.use(express.static(path.join('public'))) //USE files in 'public' folder






//ESTABLISHING MONGODB NODESERVER CONNECTION(CHECK .env file). Enter "npm start" or "node app" to run app.js
mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true} )
//connect to mongodb
/* const dburi = 'mongodb+srv://dababies:letsgo123@six7twoinventorysystem.lij0pnd.mongodb.net/Six7TwoInventorySystem?retryWrites=true&w=majority';
mongoose.connect(dburi, {useNewUrlParser: true, useUnifiedTopology: true} )
    .then((result)=> console.log ('connected na sa db'))
    .catch((err) => console.log(err));
 */
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
// END OF ESTABLISHING MONGODB CONNECTION


// Port to listen(AUTOMATIC) OR localhost:3000/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Server running at port ${PORT}`)
})



//mongoose test
/*
app.get('/products', (req,res) =>{
    const product = new Product({
        productName:'HBW Ballpen',
        unitCost: 5.00,
        unitPrice: 10.00,
        lowStockThreshold: 20,
        startingInventory: 50,
        numOfPurchased: 40,
        numOfSold: 30


    });

    product.save()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        });
})*/




//INDEX
app.get('/', (req, res)=>{

   // res.send();
    res.render('index', {title: 'Six7Two Inventory System'});

})



//ACCOUNT MGT
app.get('/account', (req, res)=>{

    // res.send();
    res.render('AccManagement(admin)', {title: 'Account Management'});
 
 })



 //HOME
app.get('/home', (req, res)=>{

   
    res.render('Home(admin)', { title: 'Home' });
 
 })


 //Inventory
 app.get('/inventory', (req, res)=>{

  
     res.render('Inventory(admin)', { title: 'Inventory' });
 
 })

 //Products
 app.get('/products', (req, res)=>{

  
    res.render('Products(admin)', { title: 'Products' });
 
 })

  //Reports
  app.get('/reports', (req, res)=>{

 
    res.render('Reports(admin)', { title: 'Reports' });
 
 })

 /*
 app.use((req,res) =>{

    res.status(404).render('errorpage');
 })*/














//app.use('/', pagesRoute) //USE PAGES ROUTE




