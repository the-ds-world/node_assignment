const router = require('express').Router();
const Product = require('../models/Product');
const ProductImages = require('../models/ProductImages');
const authMiddleWare = require('../middleware/auth');
const catFun = require('../functions/category');
const prodFun = require('../functions/product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../uploads/products'));
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({storage});

router.get('/', authMiddleWare, async(req, res)=>{
    const category = await catFun.getAll();
    const products = await prodFun.getAll();

    return res.render('product', {category: category, products: products, error: null});
});

router.post('/add', authMiddleWare, upload.array('image'), async(req, res)=>{
    try {
        const {name, price, quantity, sku, category_id} = req.body;

        const product = new Product();
        product.name = name;
        product.price = price;
        product.quantity = quantity;
        product.sku = sku;
        product.category_id = category_id;

        await product.save();

        req.files.forEach(element => {
            const prodImg = new ProductImages();
            prodImg.file = element.filename;
            prodImg.product_id = product._id;
            prodImg.save();
        });

        return res.redirect('/product');
    } catch (error) {
        const category = await catFun.getAll();
        const products = await prodFun.getAll();

        return res.render('product', {category: category, products: products, error: error});
    }
})

router.get('/get/:id', authMiddleWare, async(req, res)=>{
    try {
        const product = await prodFun.getById(req.params.id);
        return res.status(200).json(product);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
})

router.post('/update', authMiddleWare, upload.array('image'), async (req, res) => {
    try {
        const { name, price, quantity, sku, category_id, id } = req.body;
        const product = await Product.findById(id);
        product.name = name;
        product.price = price;
        product.quantity = quantity;
        product.sku = sku;
        product.category_id = category_id;
        await product.save();
        if (req.files.length > 0) {
            const images = await ProductImages.find({ product_id: product.id });
            for (const element of images) {
                fs.unlinkSync(path.join(__dirname, '../uploads/products/' + element.file));
                await ProductImages.findByIdAndDelete(element._id);
            }
            for (const file of req.files) {
                const prodImg = new ProductImages({
                    file: file.filename,
                    product_id: product._id
                });
                await prodImg.save();
            }
        }

        return res.redirect('/product');
    } catch (error) {
        const category = await catFun.getAll();
        const products = await prodFun.getAll();

        return res.render('product', { category: category, products: products, error: error });
    }
});

router.get('/delete/:id', authMiddleWare, async(req, res)=>{
    try {
        await ProductImages.deleteMany({product_id: req.params.id});
        await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({});
    } catch (error) {
        return res.status(500).json(error);
    }
})

module.exports = router;