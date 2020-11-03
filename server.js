//require('dotenv').config('/.env')
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
//const url = 'mongodb+srv://test:test@demo.vedqt.mongodb.net/pizza?retryWrites=true&w=majority';
mongoose.connect('mongodb+srv://test:test@demo1.vedqt.mongodb.net/pizza?retryWrites=true&w=majority',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true}
);
const connection=mongoose.connection;
connection.once('open',()=>{
console.log('Database connected...');    
}).catch(err=>{
    console.log('connection failed...');
});

// Session store
//var app = express();

  let mongoStore = new MongoDbStore({
     mongooseConnection: connection,
      collection: 'sessions'
 })
//session config
app.use(session({
    secret:"thisismysecretkey",
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 15}//24hours
    
}))

app.use(flash())


// //ASSETS
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//Global Middleware
app.use((req, res, next)=>{
   res.locals.session=req.session
   res.locals.user = req.user
   next()

})

//set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')
require('./routes/web')(app)


app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})