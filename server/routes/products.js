const { use } = require('sv-nex')
const expres = require('express');
const productControllers = require('../controllers/products.controllers')
const router = expres.Router();
router.get('/getproduct', use(productControllers.getProduct_controller));


module.exports ={

    router
} 


    