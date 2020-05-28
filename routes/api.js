const express = require('express');
const router = express.Router();
const company = require('./controller/company');
const product = require('./controller/product');


router.get('/', (req, res) => {
  res.json(5750);
});


/****************************************************
  ******************* Divider APIS ***************
*****************************************************/
 router.use('/company', company);
 router.use('/product', product);





module.exports = router;