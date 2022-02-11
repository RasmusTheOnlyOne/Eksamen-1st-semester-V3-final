const express = require('express');
const req = require('express/lib/request');
const router = express.Router()

const fs = require('fs')
const path = require("path")

const getProducts = require('./../model/productsModel');
const products = getProducts();
//Dette er middleware der bliver kørt hver gang mine-produkter.js køres
router.use( function( req, res, next ) {
   if ( req.query._method == 'DELETE' ) {
       req.method = 'DELETE';
       req.url = req.path;
   }       
   next(); 
});


router.get('/', (req, res) => {
//User ID hentes
   const { cookies } = req;
   const userid = cookies.userid;

   let myProducts = [];
//Alle varer scannes, om de matcher User ID, hvis de gør bliver de pushet
   products.forEach(function(product) {
      if ( product.userid == userid ) {
         myProducts.push(product);
      }
   })

   res.render('mine-produkter', {
      produkter: myProducts
   });

})
//Her vises et enkelt product
router.get('/:title', (req, res) => {

   let currentProduct = {
      title: '',
      desc: '',
      price: '',
      image: '',
      categories: [],
   };

   products.forEach(function(product) {
      if(product.title == req.params.title) {
         currentProduct = product;
      }
   })

   res.render('rediger-produkt', {
      title: currentProduct.title,
      desc: currentProduct.desc,
      price: currentProduct.price,
      image: currentProduct.image,
      categories: currentProduct.categories,
   });

})
//Nu er jeg inde på varen, og kan erstatte de gamle oplysningerne med de nye
router.put('/:title', (req, res) => {
   
   products.forEach(function(product) {
      if ( product.title == req.params.title ) {
         product.title = req.body.title;
         product.desc = req.body.desc;
         product.price = req.body.price;
         product.image = req.body.image;
         let categories = req.body.categories.split(',').map(item => item.trim());
         product.categories = categories
      }
   })

   const newProductData = JSON.stringify(products);

   fs.writeFile('./model/produkter.json', newProductData, err => {
      if ( err ) throw err;
   });

   res.redirect('/mine-produkter');
   
})
//Delete vare
router.delete('/:title', (req, res) => {
   for(let i = 0; i < products.length; i++) {
      if ( products[i].title == req.params.title ) {
         products.splice(i, 1);
      }
   }

   const newProductData = JSON.stringify(products);

   fs.writeFile('./model/produkter.json', newProductData, err => {
      if ( err ) throw err;
   });

   res.redirect('/mine-produkter');
})

module.exports = router