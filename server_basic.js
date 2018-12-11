

// Code: 
// 1. Purpose:
// * request(data) - query database - response cycle
// Default Set up work env
//     express package: app, handerbars, log, debug
//     Register handerbars with engine, set as default view/engine

// 2. Skills 
// * Database
//     * Regular dependencies
//     * Register middleware
//     * Use query to extract data: db.query
// * Coding
//     * forEach:  subdata.forEach(function(prize)){} 
//     * 
// * Engine related
//     * 端口： app.listen() 
//     * 地址: app.get(request, response)  
//     * 使用本地文件： app.use
//     * 在view engine 使用handlebar: app.engine, app.set


require('dotenv').config()
const express = require('express')
const exphbs = require('express-handlebars')
const log = require('./middleware/log.js')
const debug = require('express-debug')
const app = express()

app.engine('handlebars', exphbs()) // Register handlebars as a possible view/template engine
app.set('view engine', 'handlebars')    // Set handlebars as the default view/template engine
const DB_user='root'
const DB_name='AGORA'
const mysql = require('mysql');
const db = mysql.createConnection({
	host: 'localhost',		// local database server
	port: 3306,
	user: DB_user,			// e.g. 'app'
    password: 'dream',
    database: DB_name
    // process.env
	// database: process.env.AGROA.books
});

// Register some "early" middleware
app.use(express.static('public')) // Serve static files from the 'public' folder
app.use(log) // Log every request with our logger middleware

// Base route (localhost:5000)
app.get('/', function (request, response) {
    const q = 'SELECT * FROM books'
    db.query(q, function (err, results, fields) {
        if (err) { throw err; } 	// crash server with message
        response.render('index', { 'articles': results }); 		// results is an array
    });
})

/* Catch-all */
app.use(function (request, response) {
    response.status(404).send('Nothing to see here.')
})
process.env.MODE = 'development'
if (process.env.MODE === 'development') {
    debug(app, {})
}

/* Listen for the port */
app.listen(5000, function () {
    console.log('First server running on part 5000')
})