// Project: Fitly Application, NUS-ISS Full Stack Foundation coursework
// Server-side code
// Consists of server-side API calls

// === ALL users ===
// *1. Sign in a user                POST /signin
// *2. Sign out a user               GET /signout
// *3. Register (add) a user         POST /api/register
// *4. View my profile               GET /api/users/:userId
// *5. Update my profile             PUT /api/users/:userId

// === CLIENT ===
// 1. Display all classes/search    GET /api/classes
// 2. View a class                  GET /api/classes/:classId
// 3. Book a class                  POST /api/booking/:classId
// 4. View booked classes           GET /api/booking/:userId
// 5. Cancel a class                DELETE /api/booking/:classId

// === TRAINER ===
// 1. View upcoming classes         GET /api/booking/:userId
// 2. View a class                  GET /api/classes/:classId
// 3. Add a class                   POST /api/classes
// 4. Update a class                PUT /api/classes/:classId
// 5. Delete a class                DELETE /api/classes/:classId

// === ADMIN ===
// 1. Display all users/search      GET /api/users
// 2. Delete a user                 DELETE /api/users/:userId

'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');
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

// =============== DATABASE-RELATED SETUP & FUNCTION CALLS ===============
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

// =============== AUTHENTICATION-RELATED SETUP & FUNCTION CALLS ===============

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

// =============== AUTHENTICATION-RELATED API CALLS ===============
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

// SIGN-IN one user
// userProfile being received (email & password) is automatically handled by passport
app.post("/signin",
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

// =============== USER-RELATED API CALLS ===============
// REGISTER a user
app.post("/api/register", function (req, res) {
    // verify that confirmation password matches original password keyed in
    // otherwise return an error
    if(!(req.body.user.password === req.body.user.confirmpassword)) {
        return res.status(500).json({err: err});
    }
    // hash up the password before storing
    var hashPassword = bcrypt.hashSync(req.body.user.password, bcrypt.genSaltSync(8), null);
    
    console.log("Client registration: value of req.body", req.body.user);
    
    // version 2 - using sequelize's feature of findOrCreate
    Person.findOrCreate({
        where: {
            email: req.body.user.email
        },
        defaults: {
            email: req.body.user.email,
            password: hashPassword,             // store the hashed-up password for security
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            role: req.body.user.role,           // To validate. 0: Admin, 1: Trainer, 2: Client
            status: req.body.user.status        // To validate. 1: Active, 0: Inactive, 2: Unavailable
        }})
            .spread(function(user, created) {
                console.log("Value of user added: ", user);
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
    // var keyword = ""; // use "he" as dummy data to test
    var keyword = req.query.keyword || "";
    // var searchBy = req.query.searchBy || "firstname";
    // var sortBy = req.query.sortBy || "firstname";
    // var sortOrder = req.query.sortOrder || "ASC";

    console.log('Server: Value of keyword: ', keyword);
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
        attributes: ['id', 'email', 'firstname', 'lastname', 'gender', 'age', 'id_num', 'id_type', 'role', 'status']
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
            // cannot change email
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            gender: req.body.user.gender,               // need to perform validation ('M' or 'F')
            age: parseInt(req.body.user.age) || 0,      // need to validate range, min, max
            id_num: req.body.user.id_num,
            id_type: req.body.user.id_type,
            // role: parseInt(req.body.user.role)       // cannot change role in this version
            status: parseInt(req.body.user.status) || 1 // need to validate: 1, 0 or 2
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

// =============== CLASS-RELATED API CALLS ===============
// RETRIEVE a list of classes
app.get("/api/classes", function (req, res) {
    // manipulate variables by setting defaults as well
    var keyword = req.query.keyword || "";
    var sortBy = req.query.sortBy || "start_time";
    var sortOrder = req.query.sortOrder || "ASC";

    console.log('Server: Value of keyword: ', keyword);
    Class.findAll({
        attributes: ['id', 'name', 'details', 'start_time', 'duration', 'neighbourhood', 'category'],
        where: {$or: [
            {name: {$like: '%' + keyword + '%'}},
            {details: {$like: '%' + keyword + '%'}},
            {neighbourhood: {$like: '%' + keyword + '%'}},
            {category: {$like: '%' + keyword + '%'}}
        ]},
        order: [[sortBy, sortOrder]],
        limit: 20
    })
        .then(function(classes){
            res.status(200);
            res.type("application/json");
            // start_time in MySQL DATETIME format 2017-11-19T10:00:00.000Z. Convert to Unix time at client
            res.json(classes);
        }).catch(function(err){
            res.status(404);
            res.type("application/json");
            res.json(err);
        });
});

// RETRIEVE one class
app.get("/api/classes/:classId", function (req, res) {
    var classId = parseInt(req.params.classId);
    
    Class.findById(classId, {
        attributes: ['id', 'name', 'details', 'start_time', 'duration', 'addr_name', 'address1', 'address2', 'postcode', 'neighbourhood', 'minsize', 'maxsize', 'instructions', 'category', 'creator_id', 'backup_id', 'status'],
    })
        .then(function(result){
            console.log(result.dataValues);
            // start_time in MySQL DATETIME format 2017-11-19T10:00:00.000Z - convert to Unix time
            result.dataValues.start_time = moment(result.dataValues.start_time).unix();
            res.status(200);
            res.type("application/json");
            res.json(result.dataValues);    
        }).catch(function(err){
            res.status(404);
            res.type("application/json");
            res.json(err);
        });
});

// UPDATE one class
app.put("/api/classes/:classId", function (req, res) {
    var classId = parseInt(req.params.classId);
    console.log("value of classId: ", classId);
    console.log("value of class details", req.body.class);
    
    Class.update(
        {
            name: req.body.class.name,
            details: req.body.class.details,
            start_time: moment.unix(req.body.class.start_time).format('YYYY-MM-DD HH:mm:ss'),  // start_time in MySQL DATETIME format 2017-11-19 10:00:00
            duration: parseInt(req.body.class.duration) || 60,  // default to 60 mins
            addr_name: req.body.class.addr_name,
            address1: req.body.class.address1,
            address2: req.body.class.address2,
            postcode: req.body.class.postcode,                  // need to validate 6 char?
            neighbourhood: req.body.class.neighbourhood,
            minsize: parseInt(req.body.class.minsize) || 1,     // default to 1
            maxsize: parseInt(req.body.class.maxsize) || 1,     // default to 1
            instructions: req.body.class.instructions,
            category: req.body.class.category,
            // creator_id: parseInt(req.body.class.creator_id), // creator_id cannot change
            // backup_id: parseInt(req.body.class.backup_id),   // backup trainer not implemented
            status: parseInt(req.body.class.status) || 1        // need to validate: 1, 0 or 2
        },{
            where: {id: classId}
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

// DELETE one class
app.delete("/api/classes/:classId", function (req, res) {
    var classId = parseInt(req.params.classId);

    Class.destroy({
        // soft delete; check deleteAt column for timestamp
        where: {id: classId}
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

// ADD a class
app.post("/api/classes", function (req, res) {
    console.log("New class details: ", req.body);
    
    Class.create({
        name: req.body.name,
        details: req.body.details,
        start_time: moment.unix(req.body.start_time).format('YYYY-MM-DD HH:mm:ss'),  // start_time in MySQL DATETIME format 2017-11-19 10:00:00
        duration: parseInt(req.body.duration) || 60,  // default to 60 mins
        addr_name: req.body.addr_name,
        address1: req.body.address1,
        address2: req.body.address2,
        postcode: req.body.postcode,                  // need to validate 6 char?
        neighbourhood: req.body.neighbourhood,
        minsize: parseInt(req.body.minsize) || 1,     // default to 1
        maxsize: parseInt(req.body.maxsize) || 1,     // default to 1
        instructions: req.body.instructions,
        category: req.body.category,
        creator_id: parseInt(req.body.creator_id),
        // backup_id: parseInt(req.body.backup_id),   // backup trainer not implemented
        status: parseInt(req.body.status) || 1   
    }).then(function(result) {
        res.status(200);
        res.type("application/json");
        res.end();
    });
});

// =============== OTHER SERVER SETUP CALLS ===============

// define paths to required static files 
// app.use('/libs', express.static(path.join(__dirname,'../client/bower_components')));
app.use(express.static(path.join(__dirname,'../client')));

// error message when user visits an non-existent page
app.use(function(req, res, next) {
    res.send("<h2>Sorry, no such page.</h2>");
    next();
});

// set up port and start server
const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, function() {
    console.log('Fitly App started on port: ', APP_PORT);
});