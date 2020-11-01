require('dotenv').config()
const express=require('express')
const app=express()
const ejs=require('ejs')
const path=require('path')
const expressLayout=require('express-ejs-layouts')
const PORT=process.env.PORT||3300;
const mongoose=require('mongoose')
const session=require('express-session')
const flash=require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
//DATABASE CONNECTION

mongoose.connect("mongodb+srv://test:test@demo.vedqt.mongodb.net/pizza?retryWrites=true&w=majority",{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true}
);
const connection=mongoose.connection;
connection.once('open',()=>{
console.log('Database connected...');    
}).catch(err=>{
    console.log('connection failed...');
});

// Session store
let mongoStore = new MongoDbStore({
    uri: 'mongodb+srv://test:test@demo.vedqt.mongodb.net/pizza?retryWrites=true&w=majority',
    collection: 'sessions'
})
//session config
app.use(session({
    secret:process.env.COOKIE-SECRET,
    resave:false,
    saveUninitialized:false,
    store:mongoStore,
    cookie:{maxAge:1000*60*60*24}
}))
app.use(flash())

//ASSETS
app.use(express.static('public'))

//set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')
require('./routes/web')(app)


app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})