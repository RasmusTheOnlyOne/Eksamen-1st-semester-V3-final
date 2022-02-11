const express = require('express')
const router = express.Router()

const fs = require('fs')
const path = require("path")


router.get('/', (req, res) => {

   res.render('opret-produkt');

})

router.post('/opret', (req, res) => {

   // Cookie USERID
   const { cookies } = req;
   const userid = cookies.userid;

   // Få data fra form fields
   const title = req.body.title;
   const desc = req.body.desc;
   const price = req.body.price; // name fra input fields
   const image = req.body.image;
   let categories = req.body.cat;

   //Her splitter jeg kategorierne i tekstfelterne ad ved ","
   categories = categories.split(',').map(item => item.trim());

   // Nye produkt object
   const newProduct = {
      "title": title,
      "desc": desc,
      "price": price,
      "image": image,
      "userid": userid,
      "categories": categories,
   }

   // Send til json fil produkter.json
   var produkterData = fs.readFileSync('./model/produkter.json');
   var produkter = JSON.parse(produkterData);

   produkter.push(newProduct);
   const newProdukterData = JSON.stringify(produkter);

   fs.writeFile('./model/produkter.json', newProdukterData, err => {
      if ( err ) throw err;
   });

   // Redirect til mine produkter siden.
   res.redirect('/mine-produkter');
})

module.exports = router