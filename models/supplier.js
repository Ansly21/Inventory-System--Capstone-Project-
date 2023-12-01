const mongoose = require('mongoose') 


const SchemaTypes = mongoose.Schema.Types;


const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    
    supplierName:{
        type: String,
        required: true
    },

    brandName:{
        type: String,
        required: true

    },

    supplierContact:{
        type: String,
        required: false
    },

    

},  {timestamps: true});


const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;