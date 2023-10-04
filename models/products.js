const mongoose = require('mongoose') 


const SchemaTypes = mongoose.Schema.Types;


const Schema = mongoose.Schema;

const productsSchema = new Schema({
    
    code:{
        type:String,
        required: true

    },
    productName:{
        type: String,
        required: true
    },

    unitCost:{
        type: Number,
        required: true

    },

    unitPrice:{
        type: Number,
        required: true
    },

    lowStockThreshold:{
        type: Number,
        required: true
    },

    startingInventory:{
        type: Number,
        required: true
    },

    status:{
        type: Number,
        required: true
    }


},  {timestamps: true});


const Product = mongoose.model('Product', productsSchema);
module.exports = Product;