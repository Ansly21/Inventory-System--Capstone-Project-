const mongoose = require('mongoose') 


const SchemaTypes = mongoose.Schema.Types;


const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    
    supplierName:{
        type: String
    },

    brandName:{
        type: String


    },

    supplierContact:{
        type: String

    },

    

},  {timestamps: true});


const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;