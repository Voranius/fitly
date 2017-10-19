(function() {
    var app = angular.module('fitly', ['ui.router']);

    app.config(FitlyConfig);
    app.service("UserSvc", UserSvc);
    app.controller("LoginCtrl", LoginCtrl);
    app.controller("ListCtrl", ListCtrl);
    app.controller("TrainerDashCtrl", TrainerDashCtrl);
    app.controller("ClientDashCtrl", ClientDashCtrl);
    app.controller("AddUserCtrl", AddUserCtrl);
    app.controller("AddClassCtrl", AddClassCtrl);
    app.controller("ViewClassCtrl", ViewClassCtrl);
    app.controller("EditClassCtrl", EditClassCtrl);
    app.controller("ClientRegCtrl", ClientRegCtrl);
    app.controller("TrainerRegCtrl", TrainerRegCtrl);

    app.controller("ViewCtrl", ViewCtrl);
    app.controller("LogoutCtrl", LogoutCtrl);
    
    // ===================================================================================
    // FitlyConfig to set up various states of the system
    // ===================================================================================
    FitlyConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function FitlyConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl as loginCtrl'
            })
            .state('list', {
                url: '/list',
                templateUrl: 'views/list.html',
                controller: 'ListCtrl as listCtrl'
            })
            .state('traindash', {
                url: '/traindash',
                templateUrl: 'views/trainerdash.html',
                controller: 'TrainerDashCtrl as trainerDashCtrl'
            })
            .state('clientdash', {
                url: '/clientdash',
                templateUrl: 'views/clientdash.html',
                controller: 'ClientDashCtrl as clientDashCtrl'
            })
            .state('adduser', {
                url:'/adduser',
                templateUrl: 'views/adduser.html',
                controller: 'AddUserCtrl as addUserCtrl'
            })
            .state('addclass', {
                url:'/addclass',
                templateUrl: 'views/addclass.html',
                controller: 'AddClassCtrl as addClassCtrl'
            })
            .state('viewclass', {
                url:'/viewclass/:classId',
                templateUrl: 'views/viewclass.html',
                controller: 'ViewClassCtrl as viewClassCtrl'
            })
            .state('editclass', {
                url:'/editclass/:classId',
                templateUrl: 'views/editclass.html',
                controller: 'EditClassCtrl as editClassCtrl'
            })
            .state('clientreg', {
                url:'/clientreg',
                templateUrl: 'views/clientreg.html',
                controller: 'ClientRegCtrl as clientRegCtrl'
            })
            .state('trainerreg', {
                url:'/trainerreg',
                templateUrl: 'views/trainerreg.html',
                controller: 'TrainerRegCtrl as trainerRegCtrl'
            })
            .state('profile', {
                url:'/profile/:userId',
                templateUrl: 'views/profile.html',
                controller: 'ViewCtrl as viewCtrl'
            })
            .state('view', {
                url:'/view/:userId',
                templateUrl: 'views/view.html',
                controller: 'ViewCtrl as viewCtrl'
            })
            $urlRouterProvider.otherwise('/login');
    };

    // ===================================================================================
    // UserSvc to provide central user-database-related services
    // ===================================================================================
    UserSvc.$inject = ['$http'];    // Inject $http to use built-in service to communicate with server
    function UserSvc($http) {       // UserService function declaration

        // Declare 'service' and assigns it the object 'this'
        // Any function or variable attached to userService will be exposed to callers of
        // UserService, e.g. search.controller.js and register.controller.js
        var userSvc = this;

        // FUNCTION DECLARATION AND DEFINITION ------------------------------------------
        // insertUser uses HTTP POST to send user information to the server's /users route
        // Parameters: user information; Returns: Promise object
        // depend on separate form to set value of 'role'
        // 0: Admin, 1: Trainer, 2: Client
        userSvc.insertUser = function(newUser) {
            console.log("User details to insert: ", newUser);
            return $http({
                method: 'POST',
                url: '/api/users',
                data: {user: newUser}
            });
        };
        
        // retrieveUserById retrieves specific User information from the server via HTTP GET.
        // Parameters: userId. Returns: Promise object
        userSvc.retrieveUserById = function(userId) {
            return $http({
                method: 'GET',
                url: '/api/users/' + userId
            });
        };

        // updateUser updates a specific User information from the server via HTTP GET.
        // Parameters: user object. Returns: Promise object
        userSvc.updateUser = function(userToUpdate) {
            console.log("User details to update: ", userToUpdate);
            return $http({
                method: 'PUT',
                url: '/api/users/' + userToUpdate.id,
                data: {user: userToUpdate}
            });
        };

        // deleteUser deletes a user by userId
        // Parameters: userId. Returns: Promise object!
        userSvc.deleteUser = function(userId) {
            return $http({
                method: 'DELETE',
                url: '/api/users/' + userId
            });
        };

        // retrieveUsers retrieves user information from the server via HTTP GET
        // Passes information via the query string (params)
        // Parameters: keyword. Returns: Promise object
        userSvc.retrieveUsers = function(keyword){
            return $http({
                method: 'GET',
                url: '/api/users',
                params: {'keyword': keyword}
            });
        };
        
        // loginUser authenticates the user against server details
        // Parameters: userProfile (email & password). Returns: Promise object!
        userSvc.loginUser = function(userProfile) {
            return $http({
                method: 'POST',
                url: '/signin',
                // passport is expecting 2 values: username (email) and password
                data: {
                    email: userProfile.email,
                    password: userProfile.password
                }
            });
        };

        // userSvc.isUserLoggedIn = function() {
        //     return $http({
        //         method: 'GET',
        //         url: 'api/users/status'
        //     });
        // };

        // userSvc.isUserLoggedIn = function(cb) {
        //     $http.get('/status/user')
        //         .then(function(data) {
        //             user = true;
        //             cb(user);
        //         }).catch(function(err) {
        //             console.log("Error: ", err);     
        //             user = false;
        //             cb(user);                    
        //         });
        // };

        // logoutUser logs out user out of the current session
        // Parameters: none. Returns: Promise object!
        userSvc.logoutUser = function() {
            return $http({
                method: 'GET',
                url: '/signout'
            });
        };

    }; // end of UserSvc

    // ===================================================================================
    // ClassSvc to provide central class-database-related services
    // ===================================================================================



    // ===================================================================================
    // BookingSvc to provide central booking-database-related services
    // ===================================================================================



    // ===================================================================================
    // LoginCtrl to handle the initial user login
    // ===================================================================================
    LoginCtrl.$inject = ['$state', 'UserSvc'];
    function LoginCtrl($state, UserSvc) {
        loginCtrl = this;

        loginCtrl.message = "";

        loginCtrl.login = function() {
            // Calls UserSvc.loginUser to initiate authentication
            // loginCtrl.user contains:
            //      loginCtrl.user.email and loginCtrl.user.password
            UserSvc.loginUser(loginCtrl.user)
                .then(function(result) {
                    // check status field is 200 for successful login 
                    if (result.status == 200) {
                        if (result.data.user.role == '2')
                            $state.go('clientdash');
                        else if (result.data.user.role == '1')
                            $state.go('traindash');
                        else if (result.data.user.role == '0')
                            $state.go('list');
                    };
                }).catch(function(err) {
                    console.log("Values in err: ", err);
                    // when user does not exist in the system
                    if (err.status == 401) {
                        loginCtrl.message = "Invalid email or password."                   
                    } else if (err.status == 500) {
                        loginCtrl.message = "Could not log in user at this time."                                           
                    } else {
                        // it is some other server-returned error
                        loginCtrl.message = "Unexpected server error"                                           
                        console.log("Error: ", err);
                    }
                    $state.go('login');
                });

        };
    };

    // ===================================================================================
    // LogoutCtrl to handle logging out on the menu system
    // ===================================================================================
    LogoutCtrl.$inject = ['$state','UserSvc'];
    function LogoutCtrl($state, UserSvc) {
        logoutCtrl = this;

        logoutCtrl.logout = function() {
            UserSvc.logoutUser()
                .then(function(){
                    console.info("User successfully logged out");
                    $state.go("login");
                }).catch(function(err){
                    console.error("Error encountered while logging out", err);
                });
        };
    };


    // ===================================================================================
    // ListCtrl to handle the central display of users
    // ===================================================================================
    ListCtrl.$inject = ['$state', 'UserSvc'];
    function ListCtrl($state, UserSvc) {
        listCtrl = this;

        listCtrl.keyword = "";
        listCtrl.users = {};

        getList = function() {
            UserSvc.retrieveUsers(listCtrl.keyword)
                .then(function(users){
                    listCtrl.users = users.data;
                }).catch(function(err){
                    console.error("Error encountered: ", err);
                });
        };

        // display initial list of users by default
        getList();
        // assign same functionality to controller
        listCtrl.getList = getList;

        listCtrl.addUser = function(){
            $state.go("adduser");
        };

        listCtrl.viewUser = function(userIdToView){
            $state.go("view", {'userId' : userIdToView});
        };

        listCtrl.editUser = function(userIdToEdit){
            $state.go("edit", {'userId' : userIdToEdit});
        };

        listCtrl.deleteUser = function(){
            // have a simple pop-up window to confirm
            // if yes, call UserSvc.deleteUser()
        };
    };

    // ===================================================================================
    // AddUserCtrl to handle addition of a new user
    // ===================================================================================
    AddUserCtrl.$inject = ['$state', 'UserSvc'];
    function AddUserCtrl($state, UserSvc) {
        addUserCtrl = this;

        addUserCtrl.user = {};
        addUserCtrl.message = "";

        addUserCtrl.addUser = function() {
            UserSvc.insertUser(addUserCtrl.user)
                .then(function(user){
                    addUserCtrl.message = "User added.";
                }).catch(function(err){
                    addUserCtrl.message = "User not added. Possibly duplicate."
                    console.error("Error encountered: ", err);
                });
        };

        addUserCtrl.addAnother = function() {
            // simply just reset form values
            addUserCtrl.user = {};
            addUserCtrl.message = "";
        };
    };

    // ===================================================================================
    // ViewCtrl to handle viewing of a user
    // ===================================================================================
    ViewCtrl.$inject = ['$state', '$stateParams', 'UserSvc'];
    function ViewCtrl($state, $stateParams, UserSvc) {
        viewCtrl = this;

        viewCtrl.user = {};
        viewCtrl.message = "";

        // call by passing id of user to view
        UserSvc.retrieveUserById($stateParams.userId)
            .then(function(user) {
                viewCtrl.user = user.data;
            }).catch(function(err) {
                console.error("Error: ", err);
            });

        viewCtrl.saveUser = function() {
            UserSvc.updateUser(viewCtrl.user)
                .then(function(items){
                    viewCtrl.message ="User profile successfully updated in database.";
                }).catch(function(err){
                    viewCtrl.message ="Error updating to database. Changes not saved.";                    
                    console.error("Error encountered: ", err);
                });
        };

        viewCtrl.deleteUser = function() {
            UserSvc.deleteUser(viewCtrl.user.id)
                .then(function (result) {
                    // a browser box to inform the user, before switching states
                    alert("User profile successfully removed");
                    $state.go("list");
                }).catch(function (err) {
                    console.error("Error: ", err);
                });        
        };

    };

    // ===================================================================================
    // EditCtrl to handle editing of a new user
    // ===================================================================================
    EditCtrl.$inject = ['$state', '$stateParams', 'UserSvc'];
    function EditCtrl($state, $stateParams, UserSvc) {
        editCtrl = this;
        
        idOfUserToEdit = $stateParams.userId;
        editCtrl.user = {};

        // call UserSvc.retrieveUserById by passing idOfUserToEdit
        // pass returned record to editCtrl.user to automatically populate fields

        // then call UserSvc.updateUser to save changes back to server
    };

    TrainerDashCtrl.$inject = [];
    function TrainerDashCtrl() {

    };

    ClientDashCtrl.$inject = [];
    function ClientDashCtrl() {

    };

    AddClassCtrl.$inject = [];
    function AddClassCtrl() {

    };

    ViewClassCtrl.$inject = [];
    function ViewClassCtrl() {

    };

    EditClassCtrl.$inject = [];
    function EditClassCtrl() {

    };

    ClientRegCtrl.$inject = [];
    function ClientRegCtrl() {

    };

    TrainerRegCtrl.$inject = [];
    function TrainerRegCtrl() {

    };

})();
