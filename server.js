const express = require('express')
const fs = require('fs')
const path = require("path")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/assets'));
app.use(methodOverride('_method'))
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(cookieParser());

/*--------- Start --------*/

//Jeg starter med "GET"
app.get('/', (req, res) => {
   const { cookies } = req;
      // Tjekker om der er cookies sat
      if ( cookies.username && cookies.username.length > 0 ) {
         console.log(req.cookies);
         // Sender respons om at redirecte til forside
         res.redirect('/forside');
      // Hvis ikke cookies sat
      } else {
         // Sender respons om at render (vise) index.html
         res.render('index');
      }
})

/* ROUTERS / SIDER / ENDPOINTS */
const userRouter = require('./routes/users')
app.use('/users', userRouter)

const registerRouter = require('./routes/register');
app.use('/register', registerRouter)

const forsideRouter = require('./routes/forside');
app.use('/forside', forsideRouter);

const editProfileRouter = require('./routes/edit-profile');
app.use('/edit-profile', editProfileRouter);

const produkterRouter = require('./routes/produkter');
app.use('/produkter', produkterRouter);

const mineProdukterRouter = require('./routes/mine-produkter');
app.use('/mine-produkter', mineProdukterRouter);

const opretProduktRouter = require('./routes/opret-produkt');
app.use('/opret-produkt', opretProduktRouter);


/*---------- End ---------*/

app.listen(port, () => {
   console.log(`App listening on port ${port}`)
})