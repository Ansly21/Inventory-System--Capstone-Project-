const mongoose = require('mongoose') 


const SchemaTypes = mongoose.Schema.Types;


const Schema = mongoose.Schema;

const inventorySchema = new Schema({

    productName:{
        type: String,
        required: true
    },

    startingInventory:{
        type: Number,
        required: true

    },

    numOfPurchased:{
        type: Number,
        required: true
    },

    numOfSold:{
        type: Number,
        required: true
    },

    closingInventory:{
        type: Number,
        required: true
    },

    inventoryValue:{
        type: Number,
        required:true
    },

    inventoryCost:{
        type: Number,
        required: true
    },

    date:{
        type: Date,
        required:true
    }

},  {timestamps: true});


const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;