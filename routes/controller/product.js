const express = require('express');
const router = express.Router();
const Product = require('../../models/product.js');



//*************************************************************************************************** 
// Create new product
//*************************************************************************************************** 
router.post('/', (req, res, next) => {
    if (!req.body.title || !req.body.type || !req.body.company || !req.body.productionDate) {
        return next({status: 400, msgEn: "Empty feilds"});
    };

    Company.findOne({_id: req.body.company}, (err, company) => {
        if (err) {
            return next({status: 500, msgEn: 'Something went wrong in create new product'});
        };
        if (!company) {
            return next({status: 400, msgEn: "Company not found"});
        };

        new Product({
            title: req.body.title,
            type: req.body.type,
            company: req.body.company,
            productionDate: req.body.productionDate,
        }).save((err, newProduct) => {
            if (err) return next({status: 500, msgEn: 'Something went wrong in create new product'});

            return res.json(newProduct);
        });
    });
});



//*************************************************************************************************** 
// Edit product
//*************************************************************************************************** 
router.put('/', (req, res, next) => {
    if (!req.body.productId) {
        return next({status: 400, msgEn: "Empty feilds"});
    };

    Product.findOne({_id: req.body.productId}, (err, product) => {
        if (err) {
            return next({status: 500, msgEn: 'Something went wrong in edit product'});
        };
        if (!company) {
            return next({status: 404, msgEn: 'Product not found'});
        };

        // Check product title
        if (req.body.title !== undefined && (typeof(req.body.title) !== "string" || req.body.title.trim() === "")) {
            return next({status: 404, msgEn: "Bad value for product title"});
        };
    
        // Check product type
        if (req.body.type !== undefined && (typeof(req.body.type) !== "string" || req.body.type.trim() === "")) {
            return next({status: 404, msgEn: "Bad value for product type"});
        };

        // Check production date
        if (req.body.productionDate !== undefined && productionDate instanceof Date) {
            return next({status: 404, msgEn: "Bad value for production date"});
        };
    
        req.body.title && (company.title = req.body.title);
        req.body.type && (company.type = req.body.type);
        req.body.productionDate && (company.productionDate = req.body.productionDate);
        
        product.save((err, product) => {
            if (err) {
                return next({status: 500, msgEn: 'Something went wrong in edit product'});
            };

            return res.json(product);
        });
    });
});



//*************************************************************************************************** 
// Delete product
//*************************************************************************************************** 
router.delete('/:productId', (req, res, next) => {

    if (!req.params.productId) {
        return next({status: 400, msgEn: "Empty feilds"});
    };

    Product.findOneAndDelete({_id: req.params.productId}, {_v: 0}, async (err, product) => {
        if (err) {
            return next({status: 500, msgEn: 'Something went wrong in delete product'});
        };

        if (!product) {
            return next({status: 404, msgEn: 'Product not found'});
        };

        return res.json(product);
    });
});



//*************************************************************************************************** 
// Get all companies with their products
//*************************************************************************************************** 
router.get('/:companyId', (req, res, next) => {
    if (!req.params.companyId) {
        return next({status: 400, msgEn: "Empty feilds"});
    };

    Company.findOne({_id: req.params.companyId}, (err, company) => {
        if (err) {
            return next({status: 500, msgEn: 'Something went wrong in get products'});
        };
        if (!company) {
            return next({status: 400, msgEn: "Company not found"});
        };

        Product.find({company: req.params.companyId}, {_v: 0}, (err, products) => {
            if (err) {
                return next({status: 500, msgEn: 'Something went wrong in get products'});
            };

            return res.json(products);
        });
    });
});



module.exports = router;