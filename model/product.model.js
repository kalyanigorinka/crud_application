const mongoose = require('mongoose');
const product = new mongoose.Schema({
    Name:{
        type: String,
        required: true,
    },
    model:{
        type: String,
        required: true,
    },
    year:{
        type: String,
        required: true,
    },
    status:{
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: String,
    },
    updatedBy: {
        type: String,
    }
},{
    timestamps: true,
});

module.exports = mongoose.model('product',product);