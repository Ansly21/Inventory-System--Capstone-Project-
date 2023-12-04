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
const User = require('./models/user');
const Product = require('./models/products');
const Inventory = require('./models/inventory');
const Supplier = require('./models/supplier');
const Transaction = require('./models/transaction');

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
mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true} )
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


//INDEX
app.get('/', (req, res)=>{

   // res.send();
    res.render('index', {title: 'Six7Two Inventory System'});

})


app.post('/', async (req, res) => { 
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();

  if (!user) {
      return res.json({ status: 'error', error: 'Invalid email/password' });
  }

  if (user.isActive && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({
          id: user._id,
          email: user.email,
          type: user.type
      }, JWT_SECRET);

      return res.json({ status: 'ok', data: token });
  }

  res.json({ status: 'error', error: 'Invalid email/password' });
});



//ACCOUNT MGT
app.get('/account', async (req, res) => {
  try {
      const users = await User.find({ isActive: true }); // Fetch users where isActive is true
      const products = await Product.find({ isActive: 'Active' });
      res.render('AccManagement(admin)', { products, users, title: 'Account Management' });
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
  }
});

 app.post('/account', async(req,res) => {
    const email = req.body.email;
    const plainTextPassword = req.body.password;
    const type = req.body.type;
    const isActive = req.body.isActive;
    
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (plainTextPassword.length < 5 || !hasSpecialCharacter.test(plainTextPassword)) {
        return res.json({ status: 'error', error: 'Password too short or missing a special character' });
    }
    const password = await bcrypt.hash(plainTextPassword, 3)

    try {
        const response = await User.create({
            type,
            email,
            password,
            isActive
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


  app.put('/account/:userId', async (req, res) => {
    const userId = req.params.userId;
    const isActive = req.body.isActive;
  
    console.log(userId);
  
    try {
      const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
  
      if (!user) {
        return res.json({ status: 'error', error: 'User not found' });
      }
  
      console.log('User updated successfully', user);
      res.json({ status: 'ok', user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
  


 //HOME
app.get('/home', (req, res)=>{ 
    res.render('Home(admin)', { title: 'Home' });
 })


 app.get('/logs', async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    const products = await Product.find({ isActive: 'Active' });

    // Check if transactions exist
    if (!transactions || transactions.length === 0) {
   
    }

    res.render('Logs', { title: 'Logs', transactions, products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});



//ARCHIVE
app.get('/archive', async(req, res)=>{
  
  try {
    const users = await User.find({ isActive: false }); // Fetch users where isActive is true
    const products = await Product.find({ isActive: 'Active' });
    const inactiveProducts = await Product.find({ isActive: 'Inactive' });


    res.render('Archives', {title: 'Archives', products, users, inactiveProducts});
} catch (err) {
    console.error(err)
    res.status(500).send('Internal server error')
}
})


//SUPPLIER
app.get('/supplier', async(req, res) => {
 

    try {
      const products = await Product.find({ isActive: 'Active' });
      const suppliers = await Supplier.find({})

      res.render('Supplier', {title: 'Supplier', suppliers, products})
  } catch (err) {
      console.error(err)
      res.status(500).send('Internal server error')
  }
})

app.post('/supplier', async(req,res) => {
  const supplierName = req.body.supplierName;
  const brandName = req.body.brandName;
  const supplierContact = req.body.supplierContact;
  

  try {
      const response = await Supplier.create({
        supplierName,
        brandName,
        supplierContact
      })
      console.log("Supplier added", response)
  } catch(error) {
      if(error.code === 11000) {
          return res.json({status: 'error', error: "Supplier already exist"})
      }
      throw error
  }

  try {
      const supplierData = await Supplier.find({});
      
      res.json({status: 'ok', supplierData: supplierData});
    } catch (error) {
      console.log(error);
      res.json({status: 'error', error: error});
    }
})


// Handle the PUT request for updating a product
app.post('/supplier/:supplierId', async (req, res) => {
  const supplierId = req.params.supplierId; // Get the product ID from the URL parameter

  // Retrieve the updated data from the request body
  const updatedData = req.body;

  try {
      // Find the product by ID in your database (assuming you're using a database like MongoDB)
      const supplier = await Supplier.findById(supplierId);

      if (!supplier) {
          return res.status(404).json({ message: 'SupplierProduct not found PUT' });
      }

      // Update the product fields with the new values
      // Modify these lines according to your schema and update logic
      supplier.supplierName = updatedData.supplierName;
      supplier.brandName = updatedData.brandName;
      supplier.supplierContact = updatedData.supplierContact;

      // Save the updated product in the database
      await supplier.save();

      // Respond with a success message or the updated product
      res.redirect('/supplier');
    } catch (err) {
      console.error('Error updating supplier:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
});


 //Inventory
 app.get('/inventory', async(req, res)=>{
  try {
    const result = await Product.find({ isActive: 'Active' });
    res.render('Inventory(admin)', { title: 'Inventory', products: result });
} catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
}
 
         const targetDate = req.query.date; // Get the selected date from the query parameter
           
         console.log(targetDate)
})


app.get('/inventoryData', (req, res)=>{

           const targetDate = req.query.date; // Get the selected date from the query parameter
           
           // Convert the targetDate to a Date object
            const targetDateObject = new Date(targetDate);

            // ADD one day from the targetDate
            targetDateObject.setDate(targetDateObject.getDate() - 1);

            // Format the new date as 'YYYY-MM-DD' and store it in a new variable
            const oneDayBefore = targetDateObject.toISOString().split('T')[0];
            

           //const targetDate = [1,2,3,4]
           
           console.log(oneDayBefore)
            var resClosingInv;
            var docuTodayExists;
            var docuYesterdayExists;


  Inventory.find({ date: oneDayBefore })
  .then((result) => {
    if (result.length === 0) {
      docuYesterdayExists = false;
      console.log("walang ganyang docu");
    } else {
      resClosingInv = result[0].closingInventory;
      docuYesterdayExists = true;
      console.log("tama ka jan");
    }

    // Chain the second find operation here
    return Inventory.find({ date: targetDate });
  })
  .then((result) => {
    if (result.length === 0) {
      docuTodayExists = false;
      console.log("walang ganyang docu");
    } else {
      docuTodayExists = true;
    }

    // Now, add a Product.find operation here
    return Product.find(); // You can add conditions if needed
  })
  .then((products) => {
    // Assuming products is an array of Product documents
    // Extract the startingInventory from the products as needed
    const productStartingInventory = products.map(product => product.startingInventory);

    // Now you have both resClosingInv, docuTodayExists, and productStartingInventory available
    res.json({
      startingInventory: resClosingInv,
      docuTodayExists: docuTodayExists,
      docuYesterdayExists: docuYesterdayExists,
      productStartingInventory: productStartingInventory
    });
    console.log(resClosingInv);
    console.log("tama ka jan");
  })
  .catch((err) => {
    console.log(err);
  });
});


app.post('/inventory', async (req, res) =>{

        console.log("nasa save inventory ka");
        console.log(req.body);

        const invData = req.body;

        // Selectively extract the attributes you want to save
        const { productName, 
                startingInventory,
                numOfPurchased,
                numOfSold,
                closingInventory,
                inventoryValue,
                inventoryCost,
                date } = invData;
      
        // Create a new Product instance with the selected attributes and save it to the database
        const inventory = new Inventory({  productName, 
                                           startingInventory, 
                                           numOfPurchased, 
                                           numOfSold,
                                           closingInventory,
                                           inventoryValue,
                                           inventoryCost,
                                           date});
                    console.log(inventory);
        
                                           try {
                                            // Save the document and handle the result with Promises
                                            await inventory.save();
                                            res.redirect("/inventory");
                                          } catch (error) {
                                            console.error('Error saving product data:', error);
                                            res.status(500).send('Error saving data');
                                          }
});



//STOCK IN ROUTE
app.post('/stockInInventory/:productId', async (req, res) => {
  const productId = req.params.productId; // Get the product ID from the URL parameter

  // Retrieve the updated data from the request body
  const updatedData = req.body;

    try {
        // Find the product by ID in your database (assuming you're using a database like MongoDB)
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found PUT' });
        }

        // Update the product fields with the new values
        // Modify these lines according to your schema and update logic
        product.code = updatedData.code;
        product.brandName = updatedData.brandName;
        product.productName = updatedData.productName;
        product.lowStockThreshold = updatedData.lowStockThreshold;
        product.prevTotalRetail = updatedData.prevTotalRetail;
        product.currentInv = updatedData.currentInv;
        product.prevQtyStockIn = updatedData.prevQtyStockIn;
  

        // Save the updated product in the database
        await product.save();

        // Respond with a success message or the updated product
        res.redirect('/Inventory(admin)');
      } catch (err) {
        console.error('Error stocking in inventory:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//STOCK OUT ROUTE
app.post('/stockOutInventory/:productId', async (req, res) => {
  const productId = req.params.productId; // Get the product ID from the URL parameter

  // Retrieve the updated data from the request body
  const updatedData = req.body;

    try {
        // Find the product by ID in your database (assuming you're using a database like MongoDB)
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found PUT' });
        }

        // Update the product fields with the new values
        // Modify these lines according to your schema and update logic
        product.code = updatedData.code;
        product.brandName = updatedData.brandName;
        product.productName = updatedData.productName;
        product.lowStockThreshold = updatedData.lowStockThreshold;
        product.currentInv = updatedData.currentInv;
        product.totalRetail = updatedData.totalRetail;
        product.prevTotalRetail = updatedData.prevTotalRetail;
        product.prevQtyStockOut = updatedData.prevQtyStockOut;
  

        // Save the updated product in the database
        await product.save();

        // Respond with a success message or the updated product
        res.redirect('/Inventory(admin)');
      } catch (err) {
        console.error('Error stocking in inventory:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
            


 // GET Products
 app.get('/products', async(req, res)=>{
  const query = req.query.query;
  console.log(query);

  if (typeof query === 'undefined') {
      console.log("walang laman");
      const suppliers = await Supplier.find({});
      const filteredProducts = await Product.find({ isActive: 'Active', category: 'WS' });
      const filteredProductsOS = await Product.find({ isActive: 'Active', category: 'OS' });
      const filteredProductsPS = await Product.find({ isActive: 'Active', category: 'PSS' });

      try {
          const result = await Product.find({ isActive: 'Active' });
          res.render('Products(admin)', { title: 'Products', products: result, suppliers, filteredProducts, filteredProductsOS, filteredProductsPS });
      } catch (err) {
          console.log(err);
          res.status(500).send('Internal server error');
      }

    }else{

        const searchTerm = query;
        const regexPattern = new RegExp(searchTerm, "i"); // "i" for case-insensitive search

        Product.find({ 
            
            $or:[
            {productName: { $regex: regexPattern } },
            {code: { $regex: regexPattern } },
            ],
            
            })
            

          .then((result) => {

            res.render('Products(admin)', { title: 'Products', products: result });
            console.log("query result: ", result); // Use the results as needed
            // Respond to the client or perform further actions here
          })
          .catch((error) => {
            // Handle any errors that occurred during the query
            console.error(error);
            // Respond to the client with an error message or handle the error appropriately
          })
          
          ;
        console.log("may laman");
    }
 });


// POST Products
 app.post('/products', async (req, res) =>{
    if(req.body.action === 'addProduct'){

            console.log("nasa save product ka");
            console.log(req.body);
            res.redirect('/products');
            
            try{
                const brandName = req.body.brandName;
                const code = req.body.code;
                const productName = req.body.productName;
                const category = req.body.category;
                const wholesalePrice = req.body.wholesalePrice;
                const retailPrice = req.body.retailPrice;
                const lowStockThreshold = req.body.lowStockThreshold;
                const isActive = req.body.isActive;
                const startingInventory = req.body.startingInventory;
                const status = req.body.status;

                        const newData = new Product({
                            brandName: brandName,
                            code: code,
                            isActive: isActive,
                            category, category,
                            productName: productName,
                            wholesalePrice: wholesalePrice,
                            retailPrice: retailPrice,
                            lowStockThreshold: lowStockThreshold
                        });

                       newData.save();
                        

                
                    console.log("added na sa db");
                  //  res.redirect('/products');

                } catch(err){
                    console.log(err);
                }

    }else if (req.body.action === 'saveEditedRow'){
        console.log("nasa save edited row ka");
        console.log(req.body);

        const brandName = req.body.brandName[0]; // Get the first (and only) element of the array
        const code = req.body.code[0]; // Get the first (and only) element of the array
        const productName = req.body.productName[0];
        const wholesalePrice = parseFloat(req.body.wholesalePrice[0]); // Convert to a number
        const retailPrice = parseFloat(req.body.retailPrice[0]);
        const lowStockThreshold = parseInt(req.body.lowStockThreshold[0]); // Convert to an integer
       


        try{
            const product = await Product.findOne({ code: code});
    

            if (!product){
                return res.status(404).json({message: 'product not found'});
            }
            
           //product.code= code;
            product.brandName = brandName;
            product.productName = productName;
            product.wholesalePrice = wholesalePrice;
            product.retailPrice = retailPrice;
            product.lowStockThreshold = lowStockThreshold;           
            

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



// Import necessary modules and set up your app

// Handle the PUT request for updating a product
app.post('/products/:productId', async (req, res) => {
  const productId = req.params.productId; // Get the product ID from the URL parameter

  // Retrieve the updated data from the request body
  const updatedData = req.body;

  try {
      // Find the product by ID in your database (assuming you're using a database like MongoDB)
      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ message: 'Product not found PUT' });
      }

      // Update the product fields with the new values
      // Modify these lines according to your schema and update logic
      product.code = updatedData.code;
      product.brandName = updatedData.brandName;
      product.productName = updatedData.productName;
      product.wholesalePrice = updatedData.wholesalePrice;
      product.isActive = updatedData.isActive;
      product.retailPrice = updatedData.retailPrice;
      product.lowStockThreshold = updatedData.lowStockThreshold;
      product.isActive = updatedData.isActive;
 

      // Save the updated product in the database
      await product.save();

      // Respond with a success message or the updated product
      res.redirect('/products');
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Handle the POST request for restoring a product (activating)
app.post('/products/:productId/restore', async (req, res) => {
  const productId = req.params.productId;

  try {
      // Find the product by ID in your database
      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Update only the isActive field to "Active"
      product.isActive = 'Active';

      // Save the updated product in the database
      await product.save();

      // Respond with a success message or the updated product
      res.json({ status: 'ok', message: 'Product restored successfully' });
  } catch (err) {
      console.error('Error restoring product:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
});




// TRANSACTION BY ID
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    const products = await Product.find({ isActive: 'Active' });

    // Check if transactions exist
    if (!transactions || transactions.length === 0) {
   
    }

    res.render('Transactions', { title: 'All Transactions', transactions, products});
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


// Assuming you have initialized Express and set up your routes
app.post('/transactions', async(req,res) => {
  const user = req.body.user;
  const code = req.body.code;
  const userLogsOnly = req.body.userLogsOnly;
  const productName = req.body.productName;
  const stockIn = req.body.stockIn;
  const stockOut = req.body.stockOut;
  const wholesalePrice = req.body.wholesalePrice
  const retailPrice = req.body.retailPrice
  const remarks = req.body.remarks
  const action = req.body.action
  const totalSales = req.body.totalSales

 
  try {
      const response = await Transaction.create({
          user,
          code,
          userLogsOnly,
          productName,
          stockIn,
          stockOut,
          wholesalePrice,
          retailPrice,
          remarks,
          action,
          totalSales
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




 app.get('/reports', async (req, res) => {

  //Try block na nagcocontain ng lahat ng ipapasa sa reports page through res.render
  try {
    const products = await Product.find({ isActive: 'Active' });
    const transactions = await Transaction.find({});
    res.render('Reports(admin)', {
      title: 'Reports',
      products,
      transactions

    });
   


  } catch (error) {
    console.error(error);
    // Handle errors appropriately
    return res.status(500).send('Internal Server Error');
  }
});



// Function to get product count
async function getProductCount() {
  try {
    const count = await Product.countDocuments({ status: 1 });
    return count;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
}

// Function to get the most recent document for Inv Table
async function getMostRecentAttributeValue(attributeName) {
  try {
    const mostRecentDocument = await Inventory.findOne({})
      .sort({ date: -1 })
      .exec();

    if (mostRecentDocument) {
      const attributeValue = mostRecentDocument[attributeName];
      return attributeValue;
    } else {
      // Handle the case where no documents are found
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
}


//Function to get all values of an attribute for productTable
async function getAllAttributeValues(attributeName) {
  try {
    const documents = await Product.find({}); // Retrieve all documents

    // Extract the values of the specified attribute from each document
    const attributeArray = documents.map(document => document[attributeName]);

    return attributeArray;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
}



async function getTotalArrayValues(arrayAttributeName) {
  try {
    const documents = await Inventory.find({}); // Replace 'YourModel' with the actual name of your Mongoose model

    if (documents.length > 0) {
      const totalArray = Array.from({ length: documents[0][arrayAttributeName].length }, () => 0);

      documents.forEach(doc => {
        doc[arrayAttributeName].forEach((value, index) => {
          totalArray[index] += value;
        });
      });

      return totalArray;
    } else {
      // Handle the case where no documents are found
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
}

async function getTotalArrayValues1(arrayAttributeName) {
  try {
    const documents = await Inventory.find({}); // Replace 'YourModel' with the actual name of your Mongoose model

    if (documents.length > 0) {
      // Find the maximum length among all arrays
      const maxLength = Math.max(...documents.map(doc => doc[arrayAttributeName].length));

      // Initialize totalArray with zeros
      const totalArray = Array.from({ length: maxLength }, () => 0);

      documents.forEach(doc => {
        const docArray = doc[arrayAttributeName];

        // Add the corresponding elements, padded with zeros if necessary
        docArray.forEach((value, index) => {
          totalArray[index] += value;
        });
      });

      return totalArray;
    } else {
      // Handle the case where no documents are found
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
}

async function getTotalArrayValuesN(arrayAttributeName, startDate, endDate) {
  try {
    const salesDocuments = await Inventory.find({
      // Add date range query here
      date: { $gte: startDate, $lte: endDate },
    });

    if (salesDocuments.length > 0) {
      // Find the maximum length among all arrays
      const maxSalesLength = Math.max(...salesDocuments.map(doc => doc[arrayAttributeName].length));

      // Initialize totalSalesArray with zeros
      const totalSalesArray = Array.from({ length: maxSalesLength }, () => 0);

      salesDocuments.forEach(doc => {
        const docSalesArray = doc[arrayAttributeName];

        // Add the corresponding elements, padded with zeros if necessary
        docSalesArray.forEach((value, index) => {
          totalSalesArray[index] += value;
        });
      });

      return totalSalesArray;
    } else {
      // Handle the case where no documents are found
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
}



