const express = require('express')
const router = express.Router()

const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const path = require("path")
const cookieParser = require('cookie-parser')


// Get users
router.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, './../model/users.json'))
})


// Create user
router.post('/', (req, res) => {
//users.json bliver hentet som users
   var userData = fs.readFileSync('./model/users.json');
   var users = JSON.parse(userData);
//Username og password hentes via body-parse, samt bruger-ID kreeres.
   const username = req.body.username;
   const pwd = req.body.password;
   const id = uuidv4()
//Komponenterne til den nye bruger sættes sammen som newUser
   const newUser = {
      "name": username,
      "password": pwd,
      "id": id
   }
//newUser bliver tilføjet til users.json, og findes nu i storage
   users.push(newUser);
   const newUserData = JSON.stringify(users); //Her laver 

   fs.writeFile('./model/users.json', newUserData, err => {
      if ( err ) throw err;
   });

   res.cookie('username', username); //Her opdatere jeg mine cookies med de nye værdier
   res.cookie('userid', id);

   res.redirect('/forside'); //og brugeren er nu logget ind på sin nye profil

})


// Login user
router.post('/login', (req, res) => {
   const username = req.body.username;
   const password = req.body.password;

   var userData = fs.readFileSync('./model/users.json');
   var users = JSON.parse(userData);
   let user = false;

   users.forEach(user => {
      if ( user.name == username && user.password == password ) {
         res.cookie('username', username);
         res.cookie('userid', user.id);
         res.redirect('/forside');
         user = true;
         return
      }
   });

   if(user) {
      res.redirect('/forside');
   } else {
      res.redirect('/');
   }

});

// Logout user, hvor cookies updateres til ''
router.post('/logout', (req, res) => {
   res.cookie('username', '');
   res.cookie('userid', '');
   res.redirect('/');
})


// Edit user
router.put('/edit/:username', (req, res) => {

   const { cookies } = req;
   const userid = cookies.userid;

   var userData = fs.readFileSync('./model/users.json');
   var users = JSON.parse(userData);
//De nye oplysninger erstatter de gamle
   var newUsername = req.body.new_username;
   var newPassword = req.body.new_password;

   console.log(userid);
//users bliver opdateret med de nye oplysinger
   users.forEach(user => {
      if ( user.id == userid) {
         user.name = newUsername;
         user.password = newPassword;
         res.cookie('username', newUsername);
      }
   });
//users vender tilbage til at være json
   const newUserData = JSON.stringify(users);

   fs.writeFile('./model/users.json', newUserData, err => {
      if ( err ) throw err; //dette er så jeg ved at noget er gået galt
   });

   res.redirect('/forside');

})

// Delete user
router.delete('/delete/:username', (req, res) => {
   const username = req.params.username;
   const { cookies } = req;
   const userid = cookies.userid;
   
   var userData = fs.readFileSync('./model/users.json');
   var users = JSON.parse(userData);
//Her bliver user'rens string splice'et til ''
   for(let i = 0; i < users.length; i++) {
      if(users[i].name == username && users[i].id == userid) {
         users.splice(i, 1);
         res.cookie('username', '');
         res.cookie('userid', '');
      }
   }

   const newUserData = JSON.stringify(users);

   fs.writeFile('./model/users.json', newUserData, err => {
      if ( err ) throw err; //her bliver en err sendt afsted, hvis err opstår
   });

   res.send('Profile deleted');
});

module.exports = router