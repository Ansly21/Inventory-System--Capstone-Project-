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

    wholesalePrice:{
        type: Number,
        required: true
    },

    retailPrice:{
        type: Number,
        required: true
    },

    lowStockThreshold:{
        type: Number,
        required: true
    }


},  {timestamps: true});


const Product = mongoose.model('Product', productsSchema);
module.exports = Product;