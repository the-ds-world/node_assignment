const router = require('express').Router();
const Category = require('../models/Category');
const authMiddleWare = require('../middleware/auth');
const catFun = require('../functions/category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../uploads/category'));
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({storage});

router.get('/', authMiddleWare, async (req, res) => {
    const cats = await catFun.getAll();
    return res.render('category', {categories: cats, error: null});
})

router.post('/add', authMiddleWare, upload.single('image'), async (req, res)=>{
    try {
        const {name} = req.body;
        const image = req.file;

        const category = new Category();
        category.name = name;
        category.image = image.filename;
        await category.save();

        return res.redirect('/category');
    } catch (error) {
        const cats = await catFun.getAll();
        return res.render('category', {categories: cats, error: error});
    }
});
router.get('/get/:id',authMiddleWare, async(req, res)=>{
    try {
        const cat = await catFun.getById(req.params.id);
        return res.status(200).json(cat);
    } catch (error) {
        return res.status(500).json({error});
    }
})
router.post('/update', authMiddleWare,upload.single('image'), async(req, res)=>{
    try {
        const {name, id} = req.body;
        const category = await catFun.getById(id);
        category.name = name;
        if(req.file)
        {
            const image = req.file;
            fs.unlinkSync(path.join(__dirname, '../uploads/category/' + category.image));
            category.image = image.filename;
        }
        await category.save();
        return res.redirect('/category'); 
    } catch (error) {
        const cats = await catFun.getAll();
        return res.render('category', {categories: cats, error: error});
    }
})
router.get('/delete/:id', async(req, res)=>{
    try {
        const id = req.params.id;

        const category = await Category.findByIdAndDelete(id);
        fs.unlinkSync(path.join(__dirname, '../uploads/category/' + category.image));
        return res.status(200).json({})
    } catch (error) {
        return res.status(500).json({error});
    }
})

module.exports = router;