// Json structure
// Layer 1: prize： year category laureatu
// Layer 2: Laureatu:  category/   first/last name/ motivation 
// Sample navigation:  prize.year ===2017    prize.laureates.


// Code: request(data) - subdata - response cycle
// data: subdata.forEach(function(prize)){}
// request.params.category  request.query.name  



const express = require('express')
const exphbs = require('express-handlebars')
const log = require('./middleware/log.js')
const debug = require('express-debug')
const app = express()


app.engine('handlebars', exphbs()) // Register handlebars as a possible view/template engine
app.set('view engine', 'handlebars')    // Set handlebars as the default view/template engine

// Register some "early" middleware
app.use(express.static('public')) // Serve static files from the 'public' folder
app.use(log) // Log every request with our logger middleware
app.use(function (req, res, next) {
    console.log('ip:', req.ip)
    next()
    
})

// Base route (localhost:5000)
app.get('/greet', function (request,response) {
    const name = request.query.name
    response.send("Hello, "+name+"!")
    
})

app.get('/nobel/category/:category', function (request,response) {
    const cat = request.params.category
    const allprizes = require(`${__dirname}/prizes.json`)
    const categoryjson = allprizes.prizes.filter(function (prize) {
        return  prize.category == cat
    })
    var winners = []
    categoryjson.forEach(function(prize){winners = winners.concat(prize.laureates)})
    var result={}
    result[cat+' winners'] = winners
    response.send(result)
})

// Nobel Winner List of 2017
// Winners 2017 list: category + first/last name + motivation

// Step1: request to filter for year 2017
// Step2: loop laureate, store laureate[firstname, lastname, motivation] to temp
// Step3: response.render return result


app.get('/nobel',function (request,response){
    const allprizes = require(`${__dirname}/prizes.json`)
    const prize2017 = allprizes.prizes.filter(function (prize) {
        return prize.year == 2017
    })

    var winners2017 = []
    prize2017.forEach(function (prize) {
        var category = prize.category
        var laureates = prize.laureates
        var winnerOneGroup = laureates.map(
            function(laureate){
                var temp = {}
                temp["category"] = category
                temp["firstname"] = laureate.firstname
                temp["lastname"] = laureate.surname
                temp["motivation"] = laureate.motivation
                return temp
            }) 
    })
    // response.send(winners2017)
    result = {}
    result['winners'] =  winners2017
    response.render('nobel',result)
})

app.get('/nobel/search', function (request,response) {
    const year = request.query.year
    console.log(year)
    const category = request.query.category
    const firstname = request.query.firstname
    const lastname = request.query.surname
    const allprizes = require(`${__dirname}/prizes.json`)

    categories = allprizes.prizes.filter(function (prize) {
        if (category === undefined && year === undefined){
            return(true)
        }else if(category === undefined) {
            return (prize.year == year)
        }else{
            return (prize.category == category)
        }

    })

    winners = []
    categories.forEach(function(oneCategory){
        oneGroup = oneCategory.laureates.filter(function (onelaureate) {
            if (firstname === undefined && lastname === undefined){
                return(true)
            }else if(firstname == undefined){
                return(onelaureate.surname==lastname)
            }else{
                return(onelaureate.firstname == firstname)
            }
        })
        winners = winners.concat(oneGroup)
    })

    response.send(winners)
})


app.post('/', function (request, response) {
    response.send('Got it')
})


/* Catch-all */
app.use(function (request, response) {
    response.status(404).send('Nothing to see here.')
})
process.env.MODE= 'development'
if (process.env.MODE === 'development') {
    debug(app, {})
}

/* Listen for the port */
app.listen(5000, function(){
    console.log('First server running on part 5000')
})