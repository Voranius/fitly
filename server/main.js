// Project: Fitly Application, NUS-ISS Full Stack Foundation coursework
// Server-side code
// Consists of server-side API calls
//
// === ALL users ===
// 1. Sign in a user                POST /signin
// 2. Sign out a user               GET /signout
//
// === CLIENT ===
// 1. Register (add) client         POST /api/clients
// 2. View client profile           GET /api/clients/:clientId
// 3. Update client profile         PUT /api/clients/:clientId
// 4. Display all classes/search    GET /api/classes
// 5. View a class                  GET /api/classes/:classId
// 6. Book a class                  POST /api/clients/booking/:classId
// 7. View booked classes           PUT /api/clients/booking
// 8. Cancel a class                DELETE /api/clients/booking/:runId
//
// === TRAINER ===
// 1. Register (add) trainer        POST /api/trainers/register
// 2. View trainer profile          GET /api/trainers/:trainerId
// 3. Update trainer profile        PUT /api/trainers/:trainerId
// 4. View upcoming classes         PUT /api/trainers/classes
// 5. View a class                  GET /api/classes/:classId
// 6. Update a class                PUT /api/classes/:classId
// 7. Delete a class                DELETE /api/classes/:classId
// 8. Add a class                   POST /api/classes

'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const $q = require('q');

// database requirements & dependencies
const sequelize = require('sequelize'); // npm install sequelize and mysql2

// authentication requirements & dependencies
const session = require('express-session'); // for session management
const passport = require('passport'); //  authentication
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// var FacebookStrategy = require('passport-facebook').Strategy;

const app = express();

// set up connection to fitness database
const MYSQL_USERNAME = 'fred';
const MYSQL_PASSWORD = 'fred';
var fitnessDb = new sequelize(
    'fitlydb',        // database name
    MYSQL_USERNAME, // login ID
    MYSQL_PASSWORD, // login password
    {
        host: 'localhost',
        logging: console.log,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
);

// load tables required: User, Qualification and to link both, Userqualify
var Person = require('./models/person')(fitnessDb, sequelize);
var Class = require('./models/class')(fitnessDb, sequelize);
var Transaction = require('./models/transaction')(fitnessDb, sequelize);

// A User has a few qualifications, tracked in Userqualify under 'user_id'
// This is linked via 'id' in User
Person.hasMany(Transaction);
Person.hasMany(Class);
Class.hasMany(Transaction);
// Userqualify exists solely to match to Qualifications
// It uses 'qualify_id' to point to correspoding 'qid' in Qualification
// Userqualify.belongsTo(Qualification, {foreignKey: 'qualify_id'});

// Section to implement authentication strategies and to manage lifecycle of those strategies
// For our Fitly app, we'll start with passport-local


// Second port of call for passport-local
// To define how we will be authenticating the user locally
// hardcoded an authenticate user "ken@ken.com" into done(null, "ken@ken.com")
function authenticateUser(username, password, done) {
    console.log('1. In authenticateUser');
    console.log('Whoami: ', username);

    // locate user in database based on supplied email address
    Person.findOne({
        where: {
            email: username
        }
    })
        .then(function(user) {
            // if user does not exist in system, 'user' is invalid 
            if (!user) {
                return done(null, false);
            } else {
                // determine if passwords match
                if (bcrypt.compareSync(password, user.dataValues.password)) {
                    // when passwords match, user is authenticated . Pass user details out                 
                    return done(null, user);
                } else {
                    // if passwords don't match, user is not authenticated  
                    return done(null, false);
                }
            }
        }).catch(function(err) {
            // any other errors, user is not authenticated 
            return done(err, false);
        });
};

// First port of call for passport-local
// map incoming 'email' to username, incoming 'password' to password
// call authenticateUser() for next step
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, authenticateUser));

// serializer saves user id to session (req.session.passport.user)
// NOTES from scotchmedia.com
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing,
//   and finding the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    console.log('2. In serializeUser');
    console.log('Whoami: ', user.dataValues.email);

    // passing user.id out for deserializer to search database by ID
    done(null, user.dataValues.id);
});

// deserializer follows by using the id being passed in to confirm user exists in db
passport.deserializeUser(function(userId, done) {
    console.log('3. In deserializeUser');
    console.log('Whoami: ', userId);

    Person.findById(userId, {
        attributes: ['id', 'firstname', 'lastname', 'email']
    })
        .then(function(user) {
            if (user) {
                done(null, user);
            }
        }).catch(function(err) {
            done(null, false);
        });
});

// set up body-parser to read JSON data during PUT, with preventive size limit
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({limit: '10mb'}));

// set up session & inialise passport
// can use SHA256 to even create and use a hash within a secret
// http://www.xorbin.com/tools/sha256-hash-calculator
app.use(session({
    secret:"c5e3847e3f1f3712e035fa1d381061389bc04eebf7536f6bd89b32e9aafdc5f1",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize()); // set up passport interceptions at express level
app.use(passport.session());    // passport now integrates with newly-declared session

// ADD a user
app.post("/api/users", function (req, res) {
    // hash up the password before storing
    var hashPassword = bcrypt.hashSync(req.body.user.password, bcrypt.genSaltSync(8), null);
    
    console.log("value of req.body", req.body);
    
    // version 2 - using sequelize's feature of findOrCreate
    Person.findOrCreate({
        where: {
            email: req.body.user.email
        },
        defaults: {
            email: req.body.user.email,
            password: hashPassword, // store the hashed-up password for security
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            role: req.body.user.role,
            // qualification_id: req.qualification_id,
            status: req.body.user.status
        }})
            .spread(function(user, created) {
                // if user is successfully created
                if(created) {
                    // good security practise dictates that we reset the password
                    user.password = "";
                    res.status(201);                // From RESTful Web APIs: Created
                    res.type("application/json");
                    res.end();
                } else {
                    // if email already exists and user was not created, return an error
                    user.password = "";
                    res.status(409);                // From Restful Web APIs: Conflict
                    res.type("application/json");
                    res.json(null);                 // Anything else we can return?
                };
            }).error(function(err){
                // else if a database error occurred instead
                res.status(500);                    // From Restful Web APIs: Server error
                res.type("application/json");
                res.json(err);
            });

    // version 1 - just a simple create
    // Person.create({
    //         email: req.body.email,
    //         password: req.body.password,
    //         role: req.body.role,
    //         firstname: req.body.firstname,
    //         lastname: req.body.lastname,
    //         qualification_id: req.qualification_id,
    //         status: req.body.status
    //     }).then(function(result) {
    //         res.status(200);
    //         res.type("application/json");
    //         res.end();
    //     });
});

// RETRIEVE a list of users
app.get("/api/users", function (req, res) {
    // manipulate variables by setting defaults as well
    var keyword = ""; // use "he" as dummy data to test
    // var keyword = req.query.keyword;
    // var searchBy = req.query.searchBy || "firstname";
    // var sortBy = req.query.sortBy || "firstname";
    // var sortOrder = req.query.sortOrder || "ASC";

    console.log('Getting a list of users...');
    Person.findAll({
        attributes: ['id', 'firstname', 'lastname', 'email'],
        // where: { firstname: {$like: '%'+keyword+'%'}},
        where: {$or: [
            {firstname: {$like: '%' + keyword + '%'}},
            {lastname: {$like: '%' + keyword + '%'}},
            {email: {$like: '%' + keyword + '%'}}
        ]},
        //order: [[sortBy, sortOrder]],
        limit: 20
    })
        .then(function(users){
            res.status(200);
            res.type("application/json");
            res.json(users);
        }).catch(function(err){
            res.status(404);
            res.type("application/json");
            res.json(err);
        });
});

// RETRIEVE one user
app.get("/api/users/:userId", function (req, res) {
    var userId = parseInt(req.params.userId);
    
    Person.findById(userId, {
        attributes: ['id', 'firstname', 'lastname', 'email', 'status']
    })
        .then(function(result){
            console.log(result.dataValues);
            res.status(200);
            res.type("application/json");
            res.json(result.dataValues);
        }).catch(function(err){
            res.status(404);
            res.type("application/json");
            res.json(err);
        });
});

// UPDATE one user
app.put("/api/users/:userId", function (req, res) {
    var userId = parseInt(req.params.userId);
    console.log("value of UsedId: ", userId);
    console.log("value of user details", req.body.user);
    
    Person.update(
        {
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            status: parseInt(req.body.user.status)
            // testing hard-coded values
            // firstname: 'Jack',
            // lastname: 'Ng',
            // status: 1
        },{
            where: {id: userId}
        })
            .then(function(result){
                res.status(200);
                res.type("application/json");
                res.end();
            }).catch(function(err){
                res.status(500);
                res.type("application/json");
                res.json(err);
            });
});

// DELETE one user
app.delete("/api/users/:userId", function (req, res) {
    var userId = parseInt(req.params.userId);

    Person.destroy({
        // soft delete; check deleteAt column for timestamp
        where: {id: userId}
    })
        .then(function(result){
            res.status(200);
            res.type("application/json");
            res.end();
        }).catch(function(err){
            res.status(404);
            res.type("application/json");
            res.json(err);
        });
});

// SIGN-IN one user
// userProfile being received (email & password) is automatically handled by passport
app.post("/api/users/auth",
    function(req, res, next) {
        passport.authenticate('local',
            // passport is server-side execution. De-coupling server-side redirects removes
            // conflict with client-side handling. Just return success/fail to client
            // {
            //     successRedirect: "/#!/list",    // pointing to $state defined URL: /#!/list
            //     failureRedirect: "/#!/login"    // pointing to $state defined URL: /#!/login
            // }
            //
            // passport Documentation
            // If an exception occurred, 'err' will be set.
            // If authentication failed, 'user' will be set to false
            // 'info' contains optional details provided by strategy verify callback
            function(err, user, info) {
                // general server-side exception error
                if (err) {
                    return next(err);
                };
                // if authentication failed: invalid email or password
                if (!user) {
                    return res.status(401).json({err: info});
                };
                // passport login() call to establish a login session.
                // authenticate() invokes req.login() automatically
                // Primarily used when users sign up, during which req.login() can be invoked
                // to automatically log in newly registered user.
                req.login(user, function(err) {
                    if (err) {
                        return res.status(500).json({err: 'Could not log in user'});
                    } else {
                        // values of 'user' will be assigned to req.user
                        res.status(200).json({status: 'Login successful!'});
                    };
                });
            })(req, res, next);
});

// Set up endpoint to check authenticated status of user
app.get('/api/users/status', function(req, res, next) {
    
    if (req.user) {
        next();
    } else {
        return res.status(500).json({err: 'User not logged in.'});  
    }
});

// SIGN-OUT one user
app.get("/signout", function (req, res) {
    console.log("Logging user out at server");
    req.logout();
    req.session.destroy();
    res.status(200);
    // res.send(req.user);
    res.end();
});

// Re-route all invalid URLs to login page
// app.use(function(req, res, next) {
//     if (req.user == null) {
//         res.redirect('/#!/signin');
//     };
//     next();
// });

// define paths to required static files 
// app.use('/libs', express.static(path.join(__dirname,'../client/bower_components')));
app.use(express.static(path.join(__dirname,'../client')));

// set up port and start server
const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, function() {
    console.log('Fitly App started on port: ', APP_PORT);
});