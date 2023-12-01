const mongoose = require('mongoose') 


const SchemaTypes = mongoose.Schema.Types;


const Schema = mongoose.Schema;

const productsSchema = new Schema({
    
    code:{
        type:String,
        required: true
    },

    brandName:{
        type: String,
        required: true
    },

    productName:{
        type: String,
        required: true
    },

    wholesalePrice: {
        type: Number,
        required: true,
        get: (v) => parseFloat(v).toFixed(2),
        set: (v) => parseFloat(v).toFixed(2),
    },

    retailPrice: {
        type: Number,
        required: true,
        get: (v) => parseFloat(v).toFixed(2),
        set: (v) => parseFloat(v).toFixed(2),
    },

    totalRetail: {
        type: Number,
        
        get: (v) => parseFloat(v).toFixed(2),
        set: (v) => parseFloat(v).toFixed(2),
    },

    lowStockThreshold:{
        type: Number,
        required: true
    },

    currentInv:{
        type: Number,
        default: 0
       
    }



},  {timestamps: true});


const Product = mongoose.model('Product', productsSchema);
module.exports = Product;