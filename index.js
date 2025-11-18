const express = require('express')
const env = require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const shortid = require('shortid')
const { short } = require('webidl-conversions')
const Url = require('./models/url')

const PORT = 3000


//middlewares
app.use(express.urlencoded({extended : true}))
app.use(logger)

//view engine
app.set("view engine",'ejs')
app.set('views', path.join(__dirname, 'views'));

function logger(req,res,next){
    console.log("Someone visited",req.url)
    next()
}















app.get('/', (req,res) => {
    res.render('index')
})
app.post('/shorten', async (req,res) => {
    try{
        const longUrl = req.body.longUrl
        const shortCode = shortid.generate() 
        const newUrl = await Url.create({longUrl,shortCode})
        const shortUrl = `${req.protocol}://${req.get('host')}/${newUrl.shortCode}`

        res.render('index', {shortUrl : shortUrl})
    }catch(err){
        console.log(err)
    }
})

app.get('/:shortCode', async (req,res) => {
    try{
        const reqCode = req.params.shortCode
        const dbFind = await Url.findOne({shortCode : reqCode})
        if(dbFind){
            res.redirect(dbFind.longUrl)
        }else{
            res.status(404).send("nahh we dont have it")
        }
    }catch(err){
        console.log(err)
    }
})












mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log(`Mongodb connected`);
}).catch((err) => {
    console.log(`Error`,err);
    
})
app.listen(PORT,() => {
    console.log(`Server is running`)
})