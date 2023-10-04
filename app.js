require('dotenv').config();
const express = require('express')
const app = express();
const path = require ('path');
const mongoose = require('mongoose');



const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const JWT_SECRET = 'asy7ejh09uads0uj'
const Product = require('./models/products');
const User = require('./models/user');
const { MongoDBCollectionNamespace } = require('mongodb');

//Set EJS as the View engine
app.set('view engine', 'ejs');


//IMPORT ROUTES(/routes/)sdsd

//const pagesRoute = require('./routes/pages')



app.use(express.static(path.join('public'))) //USE files in 'public' folder






//ESTABLISHING MONGODB NODESERVER CONNECTION(CHECK .env file). Enter "npm start" or "node app" to run app.js
//mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true} )
//connect to mongodb
 const dburi = 'mongodb+srv://dababies:letsgo123@six7twoinventorysystem.lij0pnd.mongodb.net/Six7TwoInventorySystem?retryWrites=true&w=majority';
mongoose.connect(dburi, {useNewUrlParser: true, useUnifiedTopology: true} )
    .then((result)=> console.log ('connected na sa db'))
    .catch((err) => console.log(err));
 


 
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
app.use(express.json()); // Parse JSON request bodies
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
        status: 1

    });

    product.save()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        });
})
*/
/*
app.get('/products', (req,res) =>{
    const product = new Product({
        productName:'Mongol Pencil#2',
        unitCost: 3.00,
        unitPrice: 8.00,
        lowStockThreshold: 20,
        startingInventory: 30,
        status: 1
    });

    product.save()
        .then((result)=>{
            res.send(result);
            console.log("saved na");
        })
        .catch((err)=>{
            console.log(err);
        });
}) */

/*
app.get('/products', (req,res) =>{
    const product = new Product({
        productName:'Pasig Science Uniform',
        unitCost: 150.00,
        unitPrice: 450.00,
        lowStockThreshold: 10,
        startingInventory: 40,
        status: 1
    });

    product.save()
        .then((result)=>{
            res.send(result);
            console.log("saved na");
        })
        .catch((err)=>{
            console.log(err);
        });
})
*/
/*
app.get('/products', (req,res) =>{
    const product = new Product({
        productName:'Cattleya Math Notebook',
        unitCost: 20.00,
        unitPrice: 50.00,
        lowStockThreshold: 20,
        startingInventory: 50,
        status: 1
    });

    product.save()
        .then((result)=>{
            res.send(result);
            console.log("saved na");
        })
        .catch((err)=>{
            console.log(err);
        });
})
*/
/*
app.get('/products', (req,res) =>{
    const product = new Product({
        productName:'HP Laser Printer',
        unitCost: 10000,
        unitPrice: 12000,
        lowStockThreshold: 3,
        startingInventory: 10,
        status: 0
    });

    product.save()
        .then((result)=>{
            res.send(result);
            console.log("saved na");
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


app.post('/', async(req, res)=>{ 
    const {email, password} = req.body
    const user = await User.findOne({email}).lean()

    if(!user) {
        return res.json({status: 'error', error: "Invalid email/password"})
    }

    if(await bcrypt.compare(password, user.password)) {

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            type: user.type
        }, 
        JWT_SECRET
    )
        return res.json({status: 'ok', data: token})
    }
    res.json({status: 'error', error: "Invalid email/password"})
}) 


//ACCOUNT MGT
app.get('/account', async(req, res)=>{
    try {
        const users = await User.find({})
        res.render('AccManagement(admin)', {users, title: 'Account Management'});
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal server error')
    }
 })


 app.post('/account', async(req,res) => {
    const email = req.body.email;
    const plainTextPassword = req.body.password;
    const type = req.body.type;
    
    if(plainTextPassword.length < 5) {
        return res.json({status: 'error', error:"Password too short"})
    }

    const password = await bcrypt.hash(plainTextPassword, 3)

    try {
        const response = await User.create({
            type,
            email,
            password
        })
        console.log("User created successfully", response)
    } catch(error) {
        if(error.code === 11000) {
            return res.json({status: 'error', error: "Email already in use"})
        }
        throw error
    }

    try {
        const userData = await User.find({});
        
        res.json({status: 'ok', userData: userData});
      } catch (error) {
        console.log(error);
        res.json({status: 'error', error: error});
      }

})

app.delete('/account/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log(userId)
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.json({status: 'error', error: 'User not found'});
      }
  
  
      // Delete the user with userId from User collection
      await user.deleteOne();
      console.log('User deleted successfully', user);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }   
    res.json({status: 'ok'});
  });



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

    Product.find()
        .then((result)=>{
            res.render('Products(admin)', { title: 'Products', products: result });
        })
        .catch((err)=>{
            console.log(err);
        })
    
    
    
 });

 
 app.post('/products', async (req, res) =>{



    if(req.body.action === 'addProduct'){


            console.log("nasa save product ka");
            console.log(req.body);
            res.redirect('/products');
            
            try{
                const code = req.body.code;
                const productName = req.body.productName;
                const unitCost = req.body.unitCost;
                const unitPrice = req.body.unitPrice;
                const lowStockThreshold = req.body.lowStockThreshold;
                const startingInventory = req.body.startingInventory;
                const status = req.body.status;


                    for(let i = 0; i < code.length; i++){

                        const newData = new Product({
                            code: code[i],
                            productName: productName[i],
                            unitCost: unitCost[i],
                            unitPrice: unitPrice[i],
                            lowStockThreshold: lowStockThreshold[i],
                            startingInventory: startingInventory[i],
                            status: status[i]
                        });

                        await newData.save();
                        

                    }

                    console.log("added na sa db");
                  //  res.redirect('/products');

                } catch(err){
                    console.log(err);
                }

    }else if (req.body.action === 'saveEditedRow'){
        console.log("nasa save edited row ka");
        console.log(req.body);

       
        /*
        const code = req.body.code;
        const productName = req.body.productName;
        const unitCost = req.body.unitCost;
        const unitPrice = req.body.unitPrice;
        const lowStockThreshold = req.body.lowStockThreshold;
        const startingInventory = req.body.startingInventory;
        const status = req.body.status;*/

        const code = req.body.code[0]; // Get the first (and only) element of the array
        const productName = req.body.productName[0];
        const unitCost = parseFloat(req.body.unitCost[0]); // Convert to a number
        const unitPrice = parseFloat(req.body.unitPrice[0]);
        const lowStockThreshold = parseInt(req.body.lowStockThreshold[0]); // Convert to an integer
        const startingInventory = parseInt(req.body.startingInventory[0]);
        const status = req.body.status[0];


        try{
            const product = await Product.findOne({ code: code});
               

           

            if (!product){
                return res.status(404).json({message: 'product not found'});
            }
            
           //product.code= code;
            product.productName = productName;
            product.unitCost = unitCost;
            product.unitPrice = unitPrice;
            product.lowStockThreshold = lowStockThreshold;
            product.startingInventory = startingInventory;
            product.status = status;

        
                            

            const updatedProduct = await product.save();
           // res.json(updatedProduct);


        } catch(err){
            console.error(err);
            res.status(500).json({message: 'Server error'});
        }



        res.redirect('/products');
       // console.log(req.body);
    }
 });

  //Reports
  app.get('/reports', (req, res)=>{

 
    res.render('Reports(admin)', { title: 'Reports' });
 
 })

 /*
 app.use((req,res) =>{

    res.status(404).render('errorpage');
 })*/














//app.use('/', pagesRoute) //USE PAGES ROUTE




