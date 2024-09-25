const mongoose = require('../db');
const Category = require('./Category');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    sku: {
        type: String,
        required: true,
        unqiue: true
    },
    category_id: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: Category
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;