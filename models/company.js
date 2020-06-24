const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CompanySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now   
    }
});


module.exports = mongoose.model('Company', CompanySchema);