const express = require('express');
const router = express.Router();
const Product = require('../../models/product');



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



module.exports = router;