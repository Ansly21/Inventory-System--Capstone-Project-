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

        get: (v) => parseFloat(v).toFixed(2),
        set: (v) => parseFloat(v).toFixed(2),
    },

    retailPrice: {
        type: Number
    },

    totalRetail: {
        type: Number,
        default: 0
    },

    lowStockThreshold:{
        type: Number,
        required: true
    },

    currentInv:{
        type: Number,
        default: 0
       
    },

    prevQtyStockIn: {
        type: Number
    },

    prevQtyStockOut: {
        type: Number
    },

    prevTotalRetail: {
        type: Number,
        default: 0
    },



},  {timestamps: true});


const Product = mongoose.model('Product', productsSchema);
module.exports = Product;