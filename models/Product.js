const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProductSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true
    },
    productionDate: {
        type: Date,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now   
    }
});


module.exports = mongoose.model('Product', ProductSchema);