const mongoose = require('mongoose') 


const SchemaTypes = mongoose.Schema.Types;


const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    
    user:{
        type:String,
        required: true

    },
    brand:{
        type: String,
        required: true
    },

    productName:{
        type: String,
        required: true

    },

    stockIn:{
        type: number,

    },

    stockOut:{
        type: number,

    },


    wholesalePrice: {
        type: Number,
        required: true,
        get: (v) => parseFloat(v).toFixed(2),
        set: (v) => parseFloat(v).toFixed(2),
    },

    totalWholesale: {
        type: Number,
        
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


    

    remarks: {
        type: String,
        required: true,
    }



},  {timestamps: true});


const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;