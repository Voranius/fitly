// Project: Fitly Application, NUS-ISS Full Stack Foundation coursework
// Server-side code
// Consists of server-side API calls

// =============== SUMMARY OF ENDPOINTS, GROUPED BY USER FUNCTION ===============
// For ALL users
// 1. Sign in a user                POST /signin
// 2. Sign out a user               GET /signout
// 3. Register (add) a user         POST /api/users
// 4. View my profile               GET /api/users/:userId
// 5. Update my profile             PUT /api/users/:userId

// For CLIENT
// 1. Display all classes/search    GET /api/classes
// 2. View a class                  GET /api/classes/:classId
// 3. Book a class                  POST /api/bookings
// 4. View booked classes           GET /api/bookings
// 5. Cancel a class                DELETE /api/bookings

// For TRAINER
// 1. View upcoming classes         GET /api/bookings/:trainerId
// 2. View a class                  GET /api/classes/:classId
// 3. Add a class                   POST /api/classes
// 4. Update a class                PUT /api/classes/:classId
// 5. Delete a class                DELETE /api/classes/:classId

// For ADMIN
// 1. Display all users/search      GET /api/users
// 2. Delete a user                 DELETE /api/users/:userId

// =============== SUMMARY OF ENDPOINTS, GROUPED BY ENDPOINTS ===============
// POST 	/signin                     Sign in a user (all users)
// GET 	    /signout                    Sign out a user (all users)

// GET 	    /api/users                  Display all users/search (Admin)
// GET 	    /api/users/:userId          View my profile (all users)
// POST 	/api/users                  Register (add) a user (all users)
// PUT 	    /api/users/:userId          Update my profile (all users)
// DELETE 	/api/users/:userId          Delete a user (Admin)

// GET 	    /api/classes                Display all classes/search (client)
// GET 	    /api/classes/:classId       View a class (all users)
// POST 	/api/classes                Add a class (trainer)
// PUT 	    /api/classes/:classId       Update a class (trainer)
// DELETE 	/api/classes/:classId       Delete a class (trainer)

// GET 	    /api/bookings               View booked classes (client)
// GET 	    /api/bookings/:trainerId    View upcoming classes (trainer)
// POST 	/api/bookings               Book a class (client)
// DELETE 	/api/bookings               Cancel a class (client)

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

// Person.hasMany(Transaction);
Transaction.belongsTo(Person, {foreignKey: 'client_id'});

//Person.hasMany(Class);
Class.belongsTo(Person, {foreignKey: 'creator_id'});

Class.hasMany(Transaction, { foreignKey: 'class_id' });
Transaction.belongsTo(Class, {foreignKey: 'class_id'});

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
                    console.log("Server: Value of user: ", user);
                    if (err) {
                        return res.status(500).json({err: 'Could not log in user'});
                    } else {
                        // values of 'user' will be assigned to req.user
                        return res.status(200).json({user: req.user, status: 'Login successful!'});
                    };
                });
            })(req, res, next);
});

// Set up endpoint to check authenticated status of user
// app.get('/userstatus', function(req, res, next) {
//     if (req.user) {
//         next();
//     } else {
//         return res.status(500).json({err: 'User not logged in.'});  
//     }
// });

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
// Depends on client-end form to set role of trainer, client or Admin
// Used for basic/initial registration
// User completes full profile when performing an update
app.post("/api/users", function (req, res) {
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
                // console.log("Value of user added: ", user);
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
// For Admin
// User data: id, firstname, lastname, email, role, status
app.get("/api/users", function (req, res) {
    // manipulate variables by setting defaults as well
    // var keyword = ""; // use "he" as dummy data to test
    var keyword = req.query.keyword || "";
    // var searchBy = req.query.searchBy || "firstname";
    // var sortBy = req.query.sortBy || "firstname";
    // var sortOrder = req.query.sortOrder || "ASC";

    console.log('Server: Value of keyword: ', keyword);
    Person.findAll({
        attributes: ['id', 'firstname', 'lastname', 'email', 'role', 'status'],
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
// Returns full profile of user
// User data: id, email, firstname, lastname, gender, age, id_num, id_type, role, status
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
// Cannot change email & role
// User data: firstname, lastname, gender, age, id_num, id_type, status
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
// Returns preliminary/basic class details
// Class data: id, name, details, start_time, duration, neighbourhood, category
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
// Returns full class details
// Class data: id, name, details, start_time, duration, addr_name, address1, address2, postcode, neighbourhood, minsize, maxsize, instructions, category, creator_id, status
// Trainer person data: firstname, lastname, gender, age
app.get("/api/classes/:classId", function (req, res) {
    var classId = parseInt(req.params.classId);
    
    Class.findById(classId, {
        attributes: ['id', 'name', 'details', 'start_time', 'duration', 'addr_name', 'address1', 'address2', 'postcode', 'neighbourhood', 'minsize', 'maxsize', 'instructions', 'category', 'creator_id', 'status'],
        include: [{
            model: Person,
            attributes: ['firstname', 'lastname', 'gender', 'age']
        }],
        limit: 20
    }

)
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

// RETRIEVE a trainer's list of classes
// Accepts search keyword as well
// Class data: id, name, details, start_time, duration, neighbourhood, category
// And list of client booking data: id, client_id
app.get("/api/bookings/:trainerId", function (req, res) {
    // manipulate variables by setting defaults as well
    var trainerId = parseInt(req.params.trainerId);
    var keyword = req.query.keyword || "";
    var sortBy = req.query.sortBy || "start_time";
    var sortOrder = req.query.sortOrder || "ASC";

    console.log('Server: Value of keyword: ', keyword);
    Class.findAll({
        attributes: ['id', 'name', 'details', 'start_time', 'duration', 'neighbourhood', 'category'],
        where: {$and: [
            { creator_id: trainerId},
            // searches keyword in class name, details, neighbourhood, category
            {$or: [
                {name: {$like: '%' + keyword + '%'}},
                {details: {$like: '%' + keyword + '%'}},
                {neighbourhood: {$like: '%' + keyword + '%'}},
                {category: {$like: '%' + keyword + '%'}}
            ]}
        ]},
        // Include Transaction details - bookings for class
        include: [{
            model: Transaction,
            attributes: ['id', 'client_id']
        }],
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

// UPDATE one class
// Cannot be updated: creator_id
// Class data: name, details, start_time, duration, addr_name, address1, address2, postcode, neighbourhood, minsize, maxsize, instructions, category, status
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
// Create the full class data
app.post("/api/classes", function (req, res) {
    console.log("New class details: ", req.body.class);
    
    Class.create({
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
        creator_id: parseInt(req.body.class.creator_id),
        // backup_id: parseInt(req.body.class.backup_id),   // backup trainer not implemented
        status: parseInt(req.body.class.status) || 1   
    }).then(function(result) {
        res.status(200);
        res.type("application/json");
        res.end();
    });
});

// RETRIEVE a list of classes booked by a clientId
// Expecting a query string /api/bookings?clientId=NN
// Returns preliminary basic class details, from earliest to latest class start_time
// Booking data: id, class_id
// Class data: id, name, start_time, category, creator_id
// Trainer person data: firstname, lastname
app.get("/api/bookings", function (req, res) {
    // manipulate variables by setting defaults as well
    var clientId = req.query.clientId || "";
    var sortBy = req.query.sortBy || 'start_time';
    var sortOrder = req.query.sortOrder || 'ASC';

    // console.log('Server: Value of clientId: ', clientId);
    Transaction.findAll({
        attributes: ['id', 'class_id'],
        where: {client_id: clientId},
        // Include Class details
        include: [{
            model: Class,
            attributes: ['id', 'name', 'start_time', 'category', 'creator_id'],
            include: [{
                model: Person,
                attributes: ['firstname', 'lastname']                
            }],
        }],
        order: [
            [{ model: Class}, sortBy, sortOrder]
        ],        
        limit: 20
    })
        .then(function(bookings){
            res.status(200);
            res.type("application/json");
            res.json(bookings);
        }).catch(function(err){
            res.status(404);
            res.type("application/json");
            res.json(err);
        });
});

// BOOK a class
// Accepts class_id & client_id to perform booking
app.post("/api/bookings", function (req, res) {
    console.log("New booking details: ", req.body);

    // version 2 - check for duplicate booking before inserting, prevent double-booking
    Transaction.findOrCreate({
        where: {$and: [
            {class_id: req.body.class_id},
            {client_id: req.body.client_id}
        ]},
        defaults: {
            class_id: req.body.class_id,
            client_id: req.body.client_id
        }
    })
        .spread(function(tx, created) {
            // console.log("Value of transaction added: ", tx);
            // if transaction is successfully inserted
            if(created) {
                res.status(201);                // From RESTful Web APIs: Created
                res.type("application/json");
                res.end();
            } else {
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

    // version 1
    // Transaction.create({
    //     class_id: req.body.class_id,
    //     client_id: req.body.client_id
    // }).then(function(result) {
    //     res.status(200);
    //     res.type("application/json");
    //     res.end();
    // });
});

// CANCEL one booking
// Accepts class_id & client_id to cancel booking
app.delete("/api/bookings", function (req, res) {
    // var classId = parseInt(req.params.classId);
    console.log("Booking to delete: ", req.body);

    Transaction.destroy({
        // soft delete; check deleteAt column for timestamp
        where: {$and: [
            {class_id: req.body.class_id},
            {client_id: req.body.client_id}
        ]}
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