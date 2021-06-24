const express=require("express");
const app=express();
const mongoose= require('mongoose');
const bodyParser= require("body-parser");
const methodOverride= require("method-override"); 
const Article= require('./models/articledb')

const articleRouter = require('./router/articles')

const env=require("dotenv");
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({ extended: true }));
env.config();

mongoose.connect(`${process.env.MONGO_URI}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(()=> console.log("CONNECTED TO DATABASE"))
    .catch(err => console.error("An error has occured", err));
    
app.get("/", async (request,response)=>{
    const article = await Article.find().sort({createdat: 'desc'})
    response.render('articles/index',{ articles: article})
})

app.use('/articles',articleRouter);

app.listen(
    process.env.PORT || 2000, 
    console.log("Server started")
);
