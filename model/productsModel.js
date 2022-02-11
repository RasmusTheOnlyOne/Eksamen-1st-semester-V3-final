const fs = require('fs')

module.exports = function getProducts() {
   var productsData = fs.readFileSync('./model/produkter.json');
   var products = JSON.parse(productsData);
   return products;
}
