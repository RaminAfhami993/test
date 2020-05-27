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



//*************************************************************************************************** 
// Edit company
//*************************************************************************************************** 
router.put('/', (req, res, next) => {
    if (!req.body.companyId && (!req.body.name || !req.body.phoneNumber)) {
        return next({status: 400, msgEn: "Empty feilds"});
    };

    Company.findOne({_id: req.body.companyId}, (err, company) => {
        if (err) {
            return next({status: 500, msgEn: 'Something went wrong in edit company'});
        };
        if (!company) {
            return next({status: 404, msgEn: 'Company not found'});
        };

        // Check company name
        if (req.body.name !== undefined && (typeof(req.body.name) !== "string" || req.body.name.trim() === "")) {
            return next({status: 404, msgEn: "Bad value for company name"});
        };
    
        // Check Company phone number
        if (req.body.name !== undefined && (typeof(req.body.name) !== "string" || req.body.name.trim() === "")) {
            return next({status: 404, msgEn: "Bad value for phone number"});
        };
    
        Company.findOne(
            {
                $and: [
                    {
                        $or: [{
                            name: req.body.name,
                        }],
                        $or: [{
                            phoneNumber: req.body.phoneNumber,
                        }]
                    },
                    {
                        _id: {$ne: company._id}
                    }
                ]
            }, (err, existCompany) => {

            if (err) {
                return next({status: 500, msgEn: 'Something went wrong in edit company'});
            };
            if (existCompany) {
                return next({status: 406, msgEn: 'Company name or phone number already exist'});
            };

            if (req.body.name) company.name = req.body.name;
            if (req.body.phoneNumber) company.phoneNumber = req.body.phoneNumber;
            
            company.save((err, company) => {
                if (err) {
                    return next({status: 500, msgEn: 'Something went wrong in edit company'});
                };

                return res.json(company);
            });
        });
    });
});




//*************************************************************************************************** 
// Get all companies with their products
//*************************************************************************************************** 
router.get('/all', (req, res) => {
    Company.find({}, {_v: 0}).lean().exec(async (err, companies) => {
        if (err) {
            return next({status: 500, msgEn: 'Something went wrong in get companies'});
        };

        try {
            for (let i = 0, companiesLength = companies.length; i < companiesLength; i++) {
                companies[i].products = await Product.find({company: companies[i]._id}, {_v: 0});
            };
        } catch (err) {
            return next({status: 500, msgEn: 'Something went wrong in get companies pruducts'});
        };

        return res.json(companies);
    });
});




//*************************************************************************************************** 
// Delete company
//*************************************************************************************************** 
router.delete('/:companyId', (req, res) => {

    if (!req.params.companyId) {
        return next({status: 400, msgEn: "Empty feilds"});
    };

    Company.findOneAndDelete({_id: req.params.companyId}, {_v: 0}, async (err, company) => {
        if (err) {
            return next({status: 500, msgEn: 'Something went wrong in delete company'});
        };

        if (!company) {
            return next({status: 404, msgEn: 'Company not found'});
        };

        Product.deleteMany({company: company._id}, err => {
            if (err) {
                return next({status: 500, msgEn: 'Something went wrong in delete company'});
            };

            return res.json(company);
        });
    });
});




module.exports = router;