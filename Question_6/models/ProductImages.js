const mongoose = require('../db');
const Product = require('./Product');

const productImageSchema = mongoose.Schema({
    file: {
        type: String,
        required: true
    },
    product_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: Product
    }
});

const ProductImages = mongoose.model('ProductImages', productImageSchema);

module.exports = ProductImages;