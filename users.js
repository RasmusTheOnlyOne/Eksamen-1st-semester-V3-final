const express = require('express')
const router = express.Router()

const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const path = require("path")
const cookieParser = require('cookie-parser')


// Get all users
router.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, './../model/users.json'))
})


// Create user
router.post('/', (req, res) => {

   var userData = fs.readFileSync('./model/users.json');
   var users = JSON.parse(userData);

   const username = req.body.username;
   const pwd = req.body.password;
   const id = uuidv4()

   const newUser = {
      "name": username,
      "password": pwd,
      "id": id
   }

   users.push(newUser);
   const newUserData = JSON.stringify(users);

   fs.writeFile('./model/users.json', newUserData, err => {
      if ( err ) throw err;
   });

   res.cookie('username', username);
   res.cookie('userid', id);

   res.redirect('/forside');

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

// Logout user
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

   var newUsername = req.body.new_username;
   var newPassword = req.body.new_password;

   console.log(userid);

   users.forEach(user => {
      if ( user.id == userid) {
         user.name = newUsername;
         user.password = newPassword;
         res.cookie('username', newUsername);
      }
   });

   const newUserData = JSON.stringify(users);

   fs.writeFile('./model/users.json', newUserData, err => {
      if ( err ) throw err;
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

   for(let i = 0; i < users.length; i++) {
      if(users[i].name == username && users[i].id == userid) {
         users.splice(i, 1);
         res.cookie('username', '');
         res.cookie('userid', '');
      }
   }

   const newUserData = JSON.stringify(users);

   fs.writeFile('./model/users.json', newUserData, err => {
      if ( err ) throw err; //what is this?
   });

   res.send('Profile deleted');
});


// router.param('id', (req, res, next, id) => {
//    req.userVariable = users[id]
//    next();
// })


module.exports = router