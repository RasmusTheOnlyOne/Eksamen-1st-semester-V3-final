const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')

router.get('/', (req, res) => {
   const { cookies } = req;
   res.render('edit-profile', {
      username: cookies.username
   })
})

module.exports = router