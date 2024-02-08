
//http://localhost:5000/?name=iheb&age=24 `

/*app.get('/hi',(req,res)=>{
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

const app = express();
// ejs 
app.use(expressLayouts);
app.set('view engine' , 'ejs')
// Routes 
app.use('/',require('./routes/index'));

app.use('/users',require('./routes/users'));


const PORT = process.env.PORT || 5000 ; 

app.listen(PORT,console.log(`server strated on port ${PORT}`));
