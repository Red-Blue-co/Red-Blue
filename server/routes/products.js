const { use } = require('sv-nex')
const expres = require('express');
const productControllers = require('../controllers/products.controllers')
const router = expres.Router();
router.get('/getproduct', use(productControllers.getProduct_controller));
router.get('/getproducts', use(productControllers.getProducts_controller));
router.get('/getbanners', use(productControllers.getBannerDetails_controllers));
router.get('/getcategories', use(productControllers.getCategories_controller));


module.exports ={

    router
} 


    