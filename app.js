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
const Inventory = require('./models/inventory');
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

   // res.render('Inventory(admin)');
        
      

  
    // res.render('Inventory(admin)', { title: 'Inventory' });

    // const query = req.query.query;
    // console.log(query);
 
     //if(typeof query === 'undefined'){
        // console.log("walang laman");
    

     Product.find()
         .then((result)=>{
             res.render('Inventory(admin)', { title: 'Inventory', products: result});
         })
         .catch((err)=>{
             console.log(err);
         })
 
    // }
     
     /*else{
 
         const searchTerm = query;
         const regexPattern = new RegExp(searchTerm, "i"); // "i" for case-insensitive search
 
         Product.find({ 
             
             $or:[
             {productName: { $regex: regexPattern } },
             {code: { $regex: regexPattern } },
             ],
             
             })
             
 
           .then((result) => {
 
             res.render('Inventory(admin)', { title: 'Inventory', products: result });
            // console.log("query result: ", result); // Use the results as needed
             // Respond to the client or perform further actions here
           })
           .catch((error) => {
             // Handle any errors that occurred during the query
             console.error(error);
             // Respond to the client with an error message or handle the error appropriately
           })
           
           ;
 
 
 
           
        
         
 
         console.log("may laman");*/
 
 
 
         const targetDate = req.query.date; // Get the selected date from the query parameter
           
         console.log(targetDate)
         //res.json({ startingInventory: targetDate });
/*
         Product.find({ dateField: targetDate })
            .then((result) => {
                if (result.length === 0) {
                // Handle the case where no matching documents were found
                res.render('NoResultView', { title: 'No Results' });
                } else {
                // Render the view with the found document
                res.render('Inventory(admin)', { title: 'Inventory', inventory: result });
                }
            })
            .catch((err) => {
                console.log(err);
            });*/

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

/*
           Inventory.find({ date: oneDayBefore })
            .then((result) => {
                if (result.length === 0) {
                // Handle the case where no matching documents were found
                //res.json('NoResultView', { title: 'No Results' });
                docuYesterdayExists = false;
                console.log("walang ganyang docu");
                } else {
                // Render the view with the found document and use "inventory" as the key
                
                resClosingInv = result[0].closingInventory;
                docuYesterdayExists = true;
               // res.json({ startingInventory: result[0].closingInventory});
            
               // console.log(result[0].startingInventory);
                //console.log(resClosingInv);
                console.log("tama ka jan");
                }
            })
            .catch((err) => {
                console.log(err);
            });


            Inventory.find({ date: targetDate })
            .then((result) => {
                if (result.length === 0) {
                // Handle the case where no matching documents were found
                //res.json('NoResultView', { title: 'No Results' });
                docuTodayExists = false;
                console.log("walang ganyang docu");
                } else {
                // Render the view with the found document and use "inventory" as the key
                
                docuTodayExists = true;
                
                
               // res.json({ startingInventory: result[0].closingInventory});
            
               // console.log(result[0].startingInventory);
               
                }
                res.json({ startingInventory: resClosingInv, docuTodayExists: docuTodayExists, docuYesterdayExists : docuYesterdayExists});
                console.log(resClosingInv);

                console.log(docuExists);
                console.log("tama ka jan");
            })
            .catch((err) => {
                console.log(err);
            });
*/



//working na pero may ttry lang 

/*
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
    
    // Now you have both resClosingInv and docuTodayExists available
    res.json({
      startingInventory: resClosingInv,
      docuTodayExists: docuTodayExists,
      docuYesterdayExists: docuYesterdayExists
    });
    console.log(resClosingInv);
    console.log("tama ka jan");
  })
  .catch((err) => {
    console.log(err);
  });
      
  */


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

            
        /*
            const productName = req.body.productName;
            const startingInventory = req.body.startingInventory;
            const qtyPurchased = req.body.qtyPurchased;
            const qtySold = req.body.qtySold;
            const closingInv = req.body.closingInv;
            const invValue = req.body.invValue;
            const invCost = req.body.invCost;
            const selectedDate = req.body.selectedDate;
        */


 //Products


 app.get('/products', (req, res)=>{

    const query = req.query.query;
    console.log(query);

    if(typeof query === 'undefined'){
        console.log("walang laman");
   
    Product.find()
        .then((result)=>{
            res.render('Products(admin)', { title: 'Products', products: result});
        })
        .catch((err)=>{
            console.log(err);
        })

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
  /*
  app.get('/reports', (req, res)=>{

   
    Product.countDocuments({})
  .then(count => {
    console.log(`Number of documents in the collection: ${count}`);
    res.render('Reports(admin)', { title: 'Reports' , totalProducts: count});
  })
  .catch(error => {
    console.error(error);
  });


    


  
 
 });*/
 app.get('/reports', async (req, res) => {

  //Try block na nagcocontain ng lahat ng ipapasa sa reports page through res.render
  try {

    //TotalProducts
    const totalProducts = await getProductCount();
    console.log(`Number of documents in the collection: ${totalProducts}`);

  
    


    //LowStock
    const mostRecentAttributeValue = await getMostRecentAttributeValue('closingInventory');
    console.log('Array of closingInv of the recent date',mostRecentAttributeValue);

    const allAttributeValues = await getAllAttributeValues('lowStockThreshold');
    console.log('Array of their low stock threshold', allAttributeValues);

    const lowStockProductNames = await getMostRecentAttributeValue('productName');

    let count = 0;
    let indexesArray = []; // Array to store indexes when the condition is true

    if (mostRecentAttributeValue.length === allAttributeValues.length) {
      for (let i = 0; i < mostRecentAttributeValue.length; i++) {
        if (mostRecentAttributeValue[i] < allAttributeValues[i]) {
          count++;
          indexesArray.push(i); // Add the index to the array
        }
      }
    }
    
    console.log('Count of values where closingInv < low stock threshold:', count);
    console.log('Indexes where closingInv < low stock threshold:', indexesArray);

    const selectedLowStock = getValuesAtIndices(allAttributeValues, indexesArray);
    const selectedClosingInv = getValuesAtIndices(mostRecentAttributeValue, indexesArray);
    const selectedNameStock = getValuesAtIndices(lowStockProductNames, indexesArray);

    console.log(selectedNameStock);
    console.log(selectedLowStock);
    console.log(selectedClosingInv);






    //StockValue
    const allstockValue = await getMostRecentAttributeValue('inventoryValue');
    console.log('Array of their inventoryValue', allstockValue);
      let sumVariable;
            // Ensure allstockValue is an array of numbers
        if (Array.isArray(allstockValue) && allstockValue.every(value => typeof value === 'number')) {
          const sum = allstockValue.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

          console.log(`Sum of all values in allstockValue: ${sum}`);

          // Assign the sum to a variable if needed
          sumVariable = sum;
         // console.log('Value of sumVariable:', sumVariable);
        } else {
          console.log('allstockValue is not a valid array of numbers');
        }

        console.log('Value of sumVariable:', sumVariable);





    //StockCost
    const allstockCost = await getMostRecentAttributeValue('inventoryCost');
    console.log('Array of their inventoryValue', allstockCost);
      let totalStockCost;
            // Ensure allstockValue is an array of numbers
        if (Array.isArray(allstockCost) && allstockCost.every(value => typeof value === 'number')) {
          const sum = allstockCost.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

          console.log(`Sum of all values in allstockCost: ${sum}`);

          // Assign the sum to a variable if needed
          totalStockCost = sum;
         // console.log('Value of sumVariable:', sumVariable);
        } else {
          console.log('allstockCost is not a valid array of numbers');
        }

        console.log('Value of allstockCost:', totalStockCost);


  //BEST SELLER (BAR CHART)
        const totalArrayValues = await getTotalArrayValues1('numOfSold');
        console.log('Total sum of array values at the same index across all documents:', totalArrayValues); 


      
        // Find the indices with the top 5 highest values
        
        const topIndices = getTopIndices(totalArrayValues, 5);

        console.log('Top 5 indices with the highest values:', topIndices);

        function getTopIndices(array, count) {
          const indicesWithValues = array.map((value, index) => ({ value, index }));
          indicesWithValues.sort((a, b) => b.value - a.value); // Sort in descending order
          const topIndices = indicesWithValues.slice(0, count).map(item => item.index);
          return topIndices;
        }


        const allProductNames = await getMostRecentAttributeValue('productName');
        console.log('array of productNames', allProductNames);
        

                // Get values from totalArrayValues at the specified indices
        const selectedValuesSold = getValuesAtIndices(totalArrayValues, topIndices);
        const selectedValuesName = getValuesAtIndices(allProductNames, topIndices);


        // Output the selected values
        console.log(selectedValuesName);
        console.log(selectedValuesSold);

        function getValuesAtIndices(array, indices) {
          return indices.map(index => array[index]);
}


//LowStockThreshold


//Top Revenue

const allUnitPrices = await getAllAttributeValues('unitPrice');
console.log('Array of their unit prices', allUnitPrices);


console.log(totalArrayValues);

const revenue = multiplyArrays(allUnitPrices, totalArrayValues );

console.log('unit price * numOfSold (revenue)', revenue);

// Create an array of objects with value and index
const indexedArray = revenue.map((value, index) => ({ value, index }));

// Sort the array based on values in descending order
indexedArray.sort((a, b) => b.value - a.value);

// Extract the indices of the top 5 highest values
const top5Indices = indexedArray.slice(0, 5).map(item => item.index);

console.log('index of top 5 revenue', top5Indices);


const revenueProductName = getValuesAtIndices(allProductNames, top5Indices);
const revenueValue = getValuesAtIndices(revenue, top5Indices);


console.log("Total Revenue composes of:");
console.log(revenueProductName);
console.log(revenueValue);



function multiplyArrays(arr1, arr2) {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have the same length for element-wise multiplication');
  }

  // Perform element-wise multiplication
  const resultArray = arr1.map((value, index) => value * arr2[index]);

  return resultArray;

}


// LEAST SELLER (BAR CHART)
const leastTotalArrayValues = await getTotalArrayValues1('numOfSold');
console.log('Total sum of array values at the same index across all documents:', leastTotalArrayValues);

// Find the indices with the bottom 5 values
const leastBottomIndices = getLeastBottomIndices(leastTotalArrayValues, 5);
console.log('Bottom 5 indices with the lowest values:', leastBottomIndices);

function getLeastBottomIndices(array, count) {
  const indicesWithValues = array.map((value, index) => ({ value, index }));
  indicesWithValues.sort((a, b) => a.value - b.value); // Sort in ascending order
  const leastBottomIndices = indicesWithValues.slice(0, count).map(item => item.index);
  return leastBottomIndices;
}

const leastProductNames = await getMostRecentAttributeValue('productName');
console.log('Array of productNames', leastProductNames);

// Get values from leastTotalArrayValues at the specified indices
const leastSelectedValuesSold = getValuesAtIndices(leastTotalArrayValues, leastBottomIndices);
const leastSelectedValuesName = getValuesAtIndices(leastProductNames, leastBottomIndices);

// Output the selected values
console.log(leastSelectedValuesName);
console.log(leastSelectedValuesSold);

function getValuesAtIndices(array, indices) {
  return indices.map(index => array[index]);
}


// LEAST Revenue

const leastAllUnitPrices = await getAllAttributeValues('unitPrice');
console.log('Array of their unit prices', leastAllUnitPrices);

console.log(leastTotalArrayValues);

const leastRevenue = multiplyArrays(leastAllUnitPrices, leastTotalArrayValues);

console.log('unit price * numOfSold (revenue)', leastRevenue);

// Create an array of objects with value and index
const leastIndexedArray = leastRevenue.map((value, index) => ({ value, index }));

// Sort the array based on values in ascending order
leastIndexedArray.sort((a, b) => a.value - b.value);

// Extract the indices of the bottom 5 lowest values
const leastBottom5Indices = leastIndexedArray.slice(0, 5).map(item => item.index);

console.log('index of bottom 5 revenue', leastBottom5Indices);

const leastRevenueProductName = getValuesAtIndices(leastProductNames, leastBottom5Indices);
const leastRevenueValue = getValuesAtIndices(leastRevenue, leastBottom5Indices);

console.log("Least Revenue composes of:");
console.log(leastRevenueProductName);
console.log(leastRevenueValue);

function multiplyArrays(arr1, arr2) {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have the same length for element-wise multiplication');
  }

  // Perform element-wise multiplication
  const resultArray = arr1.map((value, index) => value * arr2[index]);

  return resultArray;
}

  //CODE OF PRODUCT IN LOW STOCK
  let productNamesString = selectedNameStock;
  const lowstockProductCode = await Product.find({ productName: { $in: productNamesString } })
  .select('code -_id');
  const lowStockCodes = lowstockProductCode.map(obj => obj.code);
  

    //CODE OF PRODUCT IN BEST SELLER
    let bestSellerString = selectedValuesName;
    const bestSellerProductCode = await Product.find({ productName: { $in: bestSellerString } })
    .select('code -_id');
    const bestSellerCodes = bestSellerProductCode.map(obj => obj.code);

      //CODE OF PRODUCT IN LEAST SELLER
      let leastSellerString = leastSelectedValuesName;
      const leastSellerProductCode = await Product.find({ productName: { $in: leastSellerString } })
      .select('code -_id');
      const leastSellerCodes = leastSellerProductCode.map(obj => obj.code);


    // Now, render the view with the required values
    res.render('Reports(admin)', {
      title: 'Reports',
      totalProducts: totalProducts,
      lowStock : count,
      stockValue: sumVariable,
      stockCost: totalStockCost,

      //TopSellerBarChart
      topSellerName: selectedValuesName,
      topSellerValue: selectedValuesSold,

      
      //LowStockChart
      lowStockName: selectedNameStock,
      closingInv: selectedClosingInv,
      lowStockThreshold : selectedLowStock,
      lowStockCodes: [lowStockCodes],
      bestSellerCodes: bestSellerCodes,
      leastSellerCodes: leastSellerCodes,

      //RevenueChart
      revenueProductName: revenueProductName,
      revenueValue: revenueValue,

      //LeastSellerChart
      leastSelectedValuesSold: leastSelectedValuesSold,
      leastSelectedValuesName: leastSelectedValuesName,

      //LeastRevenueChart
      leastRevenueProductName: leastRevenueProductName,
      leastRevenueValue: leastRevenueValue


      
    //  mostRecentDocument: mostRecentDocument,
      // Add other values here
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


/*
async function getAllAttributeValues2(attributeName) {
  try {
    const documents = await Inventory.find({}); // Retrieve all documents

    // Extract the values of the specified attribute from each document
    const attributeArray = documents.map(document => document[attributeName]);

    return attributeArray;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error to the caller
  }
}*/



 /*
 app.use((req,res) =>{

    res.status(404).render('errorpage');
 })*/














//app.use('/', pagesRoute) //USE PAGES ROUTE




