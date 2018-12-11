const express = require('express'); // Import Express
const app = express(); // Instantiate Express

/*****************************************
* REGULAR (non-middleware) DEPENDENCIES  *
*****************************************/
const moment = require('moment');
const mysql = require('mysql');
const DB_USER='root'
const DB_NAME='AGORA'
const bcrypt = require('bcryptjs');

// Set up database connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: DB_USER,  // Environment variable. Start app like: 'DB_USER=app DB_PASS=test nodemond index.js'
    password: 'dream',
    database: DB_NAME
});

/*******************************************
*   IMPORT MIDDLEWARE AND EXPRESS HELPERS  *
*******************************************/

const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars'); 
// Set up handlebars with a simple date formatting helper
const hbs = exphbs.create({
    helpers: {
        formatDate: function (date) {
            return moment(date).format('MMM DD, YYYY');
        }
    }
})
const logger = require('./middleware/log.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');


/************************
*  REGISTER MIDDLEWARE  *
*************************/

app.use(logger); // Log all the things
// Initialize and configure Express sessions
// These settings are OK for us
app.use(session({ 
    secret: 'ha8hWp,yoZF',  // random characters for secret
    cookie: { maxAge: 60000 }, // cookie expires after some time
    saveUninitialized: true,
    resave: true
}))
app.use(flash()); // Allow messages to be saved in req object for use in templates when rendering
app.use(bodyParser.urlencoded({ extended: false })); // Parse form submissions
app.use(bodyParser.json()); // parse application/json
app.use(express.static('public')); // Static files will use the 'public' folder as their root
app.engine('handlebars', hbs.engine); // Register the handlebars templating engine
app.set('view engine', 'handlebars'); // Set handlebars as our default template engine

/************************
*    PASSPORT CONFIG    *
*************************/
app.use(passport.initialize()); // Needed to use Passport at all
app.use(passport.session()); // Needed to allow for persistent sessions with passport

// Configure authentication using username and password
// In all callback functions that we use with passport we will expect a last argument, 'done'
// 'done' is analagous to 'next' in middleware (and of course we could name it 'next')
passport.use(new LocalStrategy({
        passReqToCallback: true // Passes req to the callback function, so we can put messages there if needed
    },
    function (req, username, password, done) {
        // Find the user based off their username
        const q = `SELECT * FROM users WHERE username = ?;`
        db.query(q, [username], function (err, results, fields) {
            if (err) return done(err);
            // User, if it exists, will be the first row returned
            // There should also only _be_ one row, provided usernames are unique in the app (and they should be!)
            const user = results[0]

            // 'done' here is looking for the following arguments: error, user, and a message or callback
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'User not found')); // req.flash stores a temporary key/value
            }

            // User exists, check password against hash
            const userHash = user.hash; // Grab the hash of the user
            // Hash and compare the provided password with the stored hash.
            // This is an async function, so we have to use a callback to receive the results and continue
            bcrypt.compare(password, userHash, function(err, matches) {
                if (!matches) {
                    return done(null, false, req.flash('loginMessage', 'Incorrect username and/or password'));
                }
                // Otherwise, they match -- success! -- send passport the user (see: serializeUser)
                return done(null, user);
            });
        })
    }
))

// Tells passport what information to include in the session
// This will be run after authentication
// Just need ID for lookup later
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Tells passport how to get user from information in session
// This will run on every request for which session data exists in a cookie.
passport.deserializeUser(function(id, done) {
    const q = `SELECT * FROM users WHERE id = ?;`
    db.query(q, [id], function (err, results, fields) {
        done(err, results[0]) // results[0] will be stored _in req.user_ for use in later middleware
    });
})


/************************
*        ROUTES         *
*************************/
// Homepage
app.get('/', function (req, res) {
    const q = `SELECT * FROM books ORDER BY id desc limit 15`;
    db.query(q, function (err, results, fields) {
        if (err) {
            console.error(err);
        }
        const templateData = {
            articles: results
        };

        res.render('homepage', templateData);
    });
    
});
app.get('/price', function (req, res) {
    const q = `SELECT price FROM books ORDER BY price desc LIMIT 10`;
    db.query(q, function (err, results, fields) {
        if (err) {
            console.error(err);
        }
        const templateData = {
            books: results
        };
        res.json(templateData.books);
    });
    
});

app.get('/greet', function (request,response) {
    const name = request.query.name
    response.send("Hello, "+name+"!")
})
// Individual blog post
// app.get('/blog/post/:postid', function (req, res) {
app.get('/books/:bookid', function (req, res) {
    const book_id = req.params.bookid;
    const q = `SELECT * FROM books WHERE id = `; 
    db.query(q, [book_id], function (err, results, fields) {
        if (err) {
            console.error(err);
        }
        // error_
        const templateData = {
            article: results[0]
        }
        res.render('singlePost', templateData);
    });
});



//
// ACCOUNT MANAGEMENT

app.get('/login', function (req, res) {
    const user = req.user;
    if (user) {
        // If we already have a user, don't let them see the login page, just send them to the admin!
        res.redirect('/admin');
    } else {
        res.render('login', { loginMessage: req.flash('loginMessage') })
    }
});

app.post('/login', 
    // In this case, invoke the local authentication strategy.
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })
);

app.get('/register', function (req, res) {
    const user = req.user;
    if (user) {
        res.redirect('/admin');
    } else {
        res.render('register', { registerMessage: req.flash('registerMessage') })
    }
});

app.post('/register', function (req, res) {
    const username = req.body.username;
    const pass = req.body.password;

    if (!username || !pass) {
        req.flash('registerMessage', 'Username and password are required.')
        return res.redirect('/register');
    }
    // Check if user exists, first
    const checkExists = `SELECT * FROM users WHERE username = ?`
    db.query(checkExists, [username], function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).send('Something bad happened...'); // Important: Don't execute other code
        }
        if (results[0]) {
            req.flash('registerMessage', 'That username is already taken.');
            return res.redirect('/register');
        }

        bcrypt.genSalt(10, function (err, salt) {
            if (err) throw err;
            bcrypt.hash(pass, salt, function (err, hash) {
                if (err) throw err;
                // Add user to database with username and hash
                const q = `INSERT INTO users(id, username, hash) VALUES (null, ?, ?)`;
                db.query(q, [username, hash], function (err, results, fields) {
                    if (err) console.error(err);
                    req.flash('registerMessage', 'Account created successfully.');
                    res.redirect('/register');
                })
            })
        });
    })
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// Logged In Functionality
// All arguments after the route path ('/admin') are middleware – we can actually have multiple defined for one route!
app.get('/admin', requireLoggedIn, function (req, res) {
    const user = req.user;
    res.render('admin', { user: user, adminMessage: req.flash.adminMessage } )
});

// Add new post
app.post('/books', requireLoggedIn, function (req, res) {
    // One style of escaping
    const book_name = req.body.title;
    const conditions = req.body.summary;
    const price = req.body.full_text;
    const image = req.body.image;
    // error_ null cannot insert
    const q = `INSERT INTO books(id, book_name, price,conditions, image,post_time) VALUES (null, ?, ?, ?, ?,NOW())`
    db.query(q, [book_name, conditions, price, image], function (err, results, fields) {
    // db.query(q, [book_name, condition, price, image, req.user.id], function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed. Oops.');
        } else {
            req.flash('adminMessage', 'Post added successfully!');
            return res.redirect('/admin');
        }
    })
});

function requireLoggedIn(req, res, next) {
    const user = req.user;
    if (!user) {
        return res.status(401).redirect('/login')
    }
    next();
}

// 404 handler
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

// Listen in on a port to handle requests
const listener = app.listen(process.env.PORT || 5000, function () {
    console.log(`BLOG APP listening on port ${listener.address().port}`);
});
