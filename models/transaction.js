const mongoose = require('mongoose') 


const SchemaTypes = mongoose.Schema.Types;


const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    
    user:{
        type:String,


    },

    userLogsOnly:{
        type: String,
 

    },

    action:{
        type: String,

    },

    brand:{
        type: String
    },

    productName:{
        type: String

    },

    stockIn:{
        type: Number,

    },

    stockOut:{
        type: Number,

    },


    wholesalePrice: {
        type: Number,
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
    }



},  {timestamps: true});


const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;