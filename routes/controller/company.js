const express = require('express');
const router = express.Router();
const Company = require('../../models/company');
const Product = require('../../models/product');



//*************************************************************************************************** 
// Create new company
//*************************************************************************************************** 
router.post('/', (req, res, next) => {
    if (!req.body.name || !req.body.phoneNumber) {
        return next({status: 400, msgEn: "Empty feilds"});
    };

    Company.findOne({name: req.body.name.trim()}, (err, existCompany) => {
        if (err) {
            return next({status: 500, msgEn: 'Something went wrong in create new company'});
        };
        if (existCompany) return next({status: 406, msgEn: 'Company name already exist'});

        new Company({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber
        }).save((err, newCompany) => {
            if (err) return next({status: 500, msgEn: 'Something went wrong in create new company'});

            return res.json(newCompany);
        });
    });
});



module.exports = router;