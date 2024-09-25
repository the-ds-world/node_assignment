const Category = require('../models/Category');
const Product = require('../models/Product');
const ProductImages = require('../models/ProductImages');

const getAll = async() => {
    const products = await Product.find().populate('category_id');
    for (let product of products) {
        const images = await ProductImages.find({ product_id: product._id });
        product.images = images;
    }
    return products;
}

const getById = async (id) => {
    const products = await Product.findById(id).populate('category_id');
    return products;
}

module.exports = {getAll, getById};