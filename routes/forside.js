const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
const { cookie } = require('express/lib/response')

router.get('/', (req, res) => {
   const { cookies } = req;
   if ( cookies.username ) {
      res.render('forside', {
         username: cookies.username
      })
   } else {
      res.redirect('/')
   }
})

module.exports = router