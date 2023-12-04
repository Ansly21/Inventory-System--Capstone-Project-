const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: {type: String},
    type: {type: String},
    isActive: {type: Boolean, default: true}
},
{collection: 'system-users'}
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model