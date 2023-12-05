const mongoose = require('mongoose') 


const SchemaTypes = mongoose.Schema.Types;


const Schema = mongoose.Schema;

const productsSchema = new Schema({
    
    code:{
        type:String
    },

    brandName:{
        type: String
    },

    productName:{
        type: String
    },

    category:{
        type: String
    },

    wholesalePrice: {
        type: Number,

        get: (v) => parseFloat(v).toFixed(2),
        set: (v) => parseFloat(v).toFixed(2),
    },

    retailPrice: {
        type: Number,
        get: (v) => parseFloat(v).toFixed(2),
        set: (v) => parseFloat(v).toFixed(2),
    },

    totalRetail: {
        type: Number,
        default: 0
    },

    isActive: {
        type: String,
        default: "Active"
    },

    lowStockThreshold:{
        type: Number
    },

    currentInv:{
        type: Number,
        default: 0,
        min: 0
       
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