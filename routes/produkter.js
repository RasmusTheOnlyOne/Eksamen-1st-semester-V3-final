const express = require('express')
const router = express.Router()

const fs = require('fs')
const path = require("path")


router.get('/', (req, res) => {

   // Hent produkter fra JSON
   var productsData = fs.readFileSync('./model/produkter.json');
   var products = JSON.parse(productsData);

   let categories = [];
//Finder de gældende varer gennem loop
   products.forEach(function(product) {
      product.categories.forEach(function(cat) {
         if ( !categories.includes(cat) ) {
            categories.push(cat);
         }
      })
   })
//Hvis Kategorien ikke passer, bliver de splice'et væk
   if ( req.query.kategori ) {
      for(let i = 0; i < products.length; i++) {
         if ( !products[i].categories.includes(req.query.kategori) ) {
            products.splice(i, 1);
         }
      }
   }

   // Render siden produkter.ejs (HTML)
   res.render('produkter', {
      produkter: products, // Variable fra JavaScript, som kan bruges i .ejs (HTML)
      kategorier: categories
   });

})

module.exports = router