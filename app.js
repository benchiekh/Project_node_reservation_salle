
//http://localhost:5000/?name=iheb&age=24 `

/*
const express = require('express');
const app = express();
app.get('/hi',(req,res)=>{
    res.send(`hello i'm ${req.query.name} ages est ${req.query.age}`)
})
app.get('/',(req,res)=>{
res.send('hello world')
//res.json({message:'hello'})
//res.sendFile(__dirname +'/index.html')
//res.redirect('http/google.com')
})
*/



const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require ('connect-flash');
const session = require('express-session');

const app = express();



const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// ejs 
app.use(expressLayouts);
app.set('view engine' , 'ejs')

// bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

// Express Session 
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
// connect flash
app.use(flash());

//global vargs
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg'); 
  next();
});

// Routes 
app.use('/',require('./routes/index'));

app.use('/users',require('./routes/users'));


const PORT = process.env.PORT || 5000 ; 

app.listen(PORT,console.log(`server strated on port ${PORT}`));
