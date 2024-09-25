const Category = require('../models/Category');

const getAll = async () => {
    const category = await Category.find();
    return category;
}

const getById = async (id) => {
    const category = await Category.findById(id);
    return category;
}

module.exports = {getAll, getById};