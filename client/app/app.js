(function() {
    var app = angular.module('fitly', ['ui.router']);

    app.config(FitlyConfig);

    app.service("UserSvc", UserSvc);
    app.service("ClassSvc", ClassSvc);
    app.service("BookingSvc", BookingSvc);
    
    app.controller("LoginCtrl", LoginCtrl);
    app.controller("LogoutCtrl", LogoutCtrl);

    app.controller("ListUsersCtrl", ListUsersCtrl);
    app.controller("TrainerDashCtrl", TrainerDashCtrl);
    app.controller("ClientDashCtrl", ClientDashCtrl);
    app.controller("AddUserCtrl", AddUserCtrl);
    app.controller("AddClassCtrl", AddClassCtrl);
    app.controller("ViewClassCtrl", ViewClassCtrl);
    app.controller("EditClassCtrl", EditClassCtrl);
    app.controller("ClientRegCtrl", ClientRegCtrl);
    app.controller("TrainerRegCtrl", TrainerRegCtrl);

    app.controller("ProfileCtrl", ProfileCtrl);
    app.controller("DateTimeCtrl", DateTimeCtrl);

    // ===================================================================================
    // DateTimePicker directive to initiate ngModel
    // ===================================================================================

    app.directive('datetimez', function(){
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function(scope, element, attrs, ngModel){
                if(!ngModel) return;  
              
                ngModel.$render = function(){
                    element.val( ngModel.$viewValue || '' );
                };
              
                function read() {
                    var value = element.val();
                    ngModel.$setViewValue(value);
                    //console.log(scope.dueDate);
                }
                
                var options = scope.$eval(attrs.datetimez) || {};
                if(element.next().is('.input-group-addon')) {
                  var parentElm = $(element).parent();
                  parentElm.datetimepicker(options);
              
                  parentElm.on('dp.change', function(){
                     scope.$apply(read);
                  });
                } else {
                  element.datetimepicker(options);
              
                  element.on('dp.change', function(){
                     scope.$apply(read);
                  });
                }
              
                read();
            }
        };
    });
    
    // ===================================================================================
    // DateTimePicker controller
    // ===================================================================================

    DateTimeCtrl.$inject = ['$scope'];
    function DateTimeCtrl($scope) {

        $scope.datePickerOptions = { 
            format : 'YYYY-MM-DD HH:mm:ss',
            timeZone: 'Asia/Singapore'
        };
         
        $scope.$watch('addClassCtrl.class.start_time',
            function() {
                console.log($scope.addClassCtrl.class.start_time);
            });

        $scope.$watch('viewClassCtrl.class.start_time',
            function() {
                console.log($scope.viewClassCtrl.class.start_time);
            });
    };
    
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
                controller: 'ListUsersCtrl as listUsersCtrl'
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
                controller: 'ProfileCtrl as profileCtrl'
            });

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

        userSvc.getUserStatus = function() {
            return $http({
                method: 'GET',
                url: '/userstatus'
            });
        };

        // userSvc.isUserLoggedIn = function(cb) {
        //     $http.get('/userstatus/')
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
    ClassSvc.$inject = ['$http'];    // Inject $http to use built-in service to communicate with server
    function ClassSvc($http) {       // ClassService function declaration
        var classSvc = this;

        classSvc.insertClass = function(newClass) {
            console.log("New class details to insert: ", newClass);
            return $http({
                method: 'POST',
                url: '/api/classes',
                data: {class: newClass}
            });
        };

        classSvc.retrieveClassById = function(classId) {
            return $http({
                method: 'GET',
                url: '/api/classes/' + classId
            });
        };

        classSvc.updateClass = function(classToUpdate) {
            console.log("Class details to update: ", classToUpdate);
            return $http({
                method: 'PUT',
                url: '/api/classes/' + classToUpdate.id,
                data: {class: classToUpdate}
            });
        };

        classSvc.deleteClass = function(classId) {
            return $http({
                method: 'DELETE',
                url: '/api/classes/' + classId
            });
        };
    };

    // ===================================================================================
    // BookingSvc to provide central booking-database-related services
    // ===================================================================================
    BookingSvc.$inject = ['$http'];    // Inject $http to use built-in service to communicate with server
    function BookingSvc($http) {       // BookingService function declaration
        var bookingSvc = this;

        // retrieveClasses retrieves classes from the server via HTTP GET for one trainerId
        // Passes information via the query string (params)
        // Parameters: keyword. Returns: Promise object
        bookingSvc.retrieveClasses = function(trainerId, keyword){
            return $http({
                method: 'GET',
                url: '/api/bookings/' + trainerId,
                params: {'keyword': keyword}
            });
        };

    };


    // ===================================================================================
    // LoginCtrl to handle the initial user login
    // ===================================================================================
    LoginCtrl.$inject = ['$state', 'UserSvc'];
    function LoginCtrl($state, UserSvc) {
        var loginCtrl = this;

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
        var logoutCtrl = this;

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
    // ListUsersCtrl to handle the central display of users
    // ===================================================================================
    ListUsersCtrl.$inject = ['$state', 'UserSvc'];
    function ListUsersCtrl($state, UserSvc) {
        var listUsersCtrl = this;

        listUsersCtrl.keyword = "";
        listUsersCtrl.users = {};

        var getList = function() {
            UserSvc.retrieveUsers(listUsersCtrl.keyword)
                .then(function(users){
                    listUsersCtrl.users = users.data;
                }).catch(function(err){
                    console.error("Error encountered: ", err);
                });
        };

        // display initial list of users by default
        getList();
        // assign same functionality to controller
        listUsersCtrl.getList = getList;

        listUsersCtrl.addUser = function(){
            $state.go("adduser");
        };

        listUsersCtrl.viewUser = function(userIdToView){
            $state.go("profile", {'userId' : userIdToView});
        };

        listUsersCtrl.editUser = function(userIdToEdit){
            $state.go("edit", {'userId' : userIdToEdit});
        };

        listUsersCtrl.deleteUser = function(){
            // have a simple pop-up window to confirm
            // if yes, call UserSvc.deleteUser()
        };
    };

    // ===================================================================================
    // AddUserCtrl to handle addition of a new user
    // ===================================================================================
    AddUserCtrl.$inject = ['$state', 'UserSvc'];
    function AddUserCtrl($state, UserSvc) {
        var addUserCtrl = this;

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
    // ProfileCtrl to handle viewing of a user
    // ===================================================================================
    ProfileCtrl.$inject = ['$state', '$stateParams', 'UserSvc'];
    function ProfileCtrl($state, $stateParams, UserSvc) {
        var profileCtrl = this;

        profileCtrl.user = {};
        profileCtrl.message = "";

        // call by passing id of user to view
        UserSvc.retrieveUserById($stateParams.userId)
            .then(function(user) {
                profileCtrl.user = user.data;
            }).catch(function(err) {
                console.error("Error: ", err);
            });

        profileCtrl.saveUser = function() {
            UserSvc.updateUser(profileCtrl.user)
                .then(function(items){
                    profileCtrl.message ="User profile successfully updated in database.";
                }).catch(function(err){
                    profileCtrl.message ="Error updating to database. Changes not saved.";                    
                    console.error("Error encountered: ", err);
                });
        };

        profileCtrl.deleteUser = function() {
            UserSvc.deleteUser(profileCtrl.user.id)
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
        var editCtrl = this;
        
        idOfUserToEdit = $stateParams.userId;
        editCtrl.user = {};

        // call UserSvc.retrieveUserById by passing idOfUserToEdit
        // pass returned record to editCtrl.user to automatically populate fields

        // then call UserSvc.updateUser to save changes back to server
    };

    TrainerDashCtrl.$inject = ['$state', 'UserSvc', 'BookingSvc'];
    function TrainerDashCtrl($state, UserSvc, BookingSvc) {
        var trainerDashCtrl = this;

        trainerDashCtrl.user = "";
        trainerDashCtrl.keyword = "";
        trainerDashCtrl.classes = {};

        var getMyClasses = function() {
            BookingSvc.retrieveClasses(trainerDashCtrl.user.id, trainerDashCtrl.keyword)
                .then(function(classes){
                    trainerDashCtrl.classes = classes.data;
                    // console.log("Value of trainerDashCtrl.classes: ", trainerDashCtrl.classes);
                    
                    // for (var c in trainerDashCtrl.classes) {
                    //     c.bookingCount = c.transactions.length;
                    //     console.log("Value of c.transactions: ", c.transactions);
                    // }
                    
                }).catch(function(err){
                    console.error("Error encountered: ", err);
                });
        };

        // check that user is logged in, get basic user details 
        UserSvc.getUserStatus()
            .then(function(user) {
                trainerDashCtrl.user = user.data.user;

                // display list of trainer's classes
                getMyClasses();
            }).catch(function(err) {
                console.error("Error: ", err);
            });

        // assign same functionality to controller
        trainerDashCtrl.getMyClasses = getMyClasses;

        trainerDashCtrl.addClass = function(trainerId) {
            $state.go("addclass");
        };

        trainerDashCtrl.viewClass = function(classId) {
            $state.go("viewclass", {'classId' : classId});
        };
    };

    ClientDashCtrl.$inject = [];
    function ClientDashCtrl() {
        var clientDashCtrl = this;

    };

    AddClassCtrl.$inject = ['$state', 'ClassSvc', 'UserSvc'];
    function AddClassCtrl($state, ClassSvc, UserSvc) {
        var addClassCtrl = this;

        addClassCtrl.user = {};
        addClassCtrl.class = {};

        // check that user is logged in, get basic user details 
        UserSvc.getUserStatus()
            .then(function(user) {
                addClassCtrl.user = user.data.user;
            }).catch(function(err) {
                console.error("Error: ", err);
            });

        addClassCtrl.addClass = function() {
            // check that current role is authorised to add a class -- not a client
            if (addClassCtrl.role != 2) {
                // set the creator_id value to current authorised user
                addClassCtrl.class.creator_id = addClassCtrl.user.id;
                ClassSvc.insertClass(addClassCtrl.class)
                    .then(function(newClass){
                        addClassCtrl.message = "Class added.";
                    }).catch(function(err){
                        addClassCtrl.message = "Class not added. Possibly duplicate."
                        console.error("Error encountered: ", err);
                    });
            }
        }

        addClassCtrl.cancel = function() {
            $state.go('traindash');            
        };

        addClassCtrl.addAnother = function() {
            addClassCtrl.class = {};
        };
    };

    ViewClassCtrl.$inject = ['$state', '$stateParams', 'UserSvc', 'ClassSvc'];
    function ViewClassCtrl($state, $stateParams, UserSvc, ClassSvc) {
        var viewClassCtrl = this;

        viewClassCtrl.user = {};
        viewClassCtrl.class = {};
        viewClassCtrl.message = "";
        classId = $stateParams.classId;

        // check that user is logged in, get basic user details 
        UserSvc.getUserStatus()
            .then(function(user) {
                viewClassCtrl.user = user.data.user;
            }).catch(function(err) {
                console.error("Error: ", err);
            });

        // call by passing id of class to view
        ClassSvc.retrieveClassById(classId)
            .then(function(myClass) {
                viewClassCtrl.class =  myClass.data;
            }).catch(function(err) {
                console.error("Error: ", err);
            });

        viewClassCtrl.updateClass = function() {
            ClassSvc.updateClass(viewClassCtrl.class)
                .then(function(results){
                    viewClassCtrl.message ="Class details successfully updated in database.";
                }).catch(function(err){
                    viewClassCtrl.message ="Error updating to database. Changes not saved.";                    
                    console.error("Error encountered: ", err);
                });
        };

        viewClassCtrl.deleteClass = function() {
            ClassSvc.deleteClass(classId)
                .then(function (result) {
                    // a browser box to inform the user, before switching states
                    alert("Class successfully removed");
                    $state.go("traindash");
                }).catch(function (err) {
                    console.error("Error: ", err);
                });
        };

        viewClassCtrl.cancel = function() {
            if (viewClassCtrl.user.role == 1)
                $state.go('traindash');
            else if (viewClassCtrl.user.role == 2)
                $state.go('clientdash');
            // else if (viewClassCtrl.user.role == 0)
            //     $state.go('admindash');
        };

        viewClassCtrl.cancelBooking = function() {

        };
    };

    EditClassCtrl.$inject = [];
    function EditClassCtrl() {
        var editClassCtrl = this;
    };

    ClientRegCtrl.$inject = ['UserSvc'];
    function ClientRegCtrl(UserSvc) {
        var clientRegCtrl = this;

        clientRegCtrl.user = {};
        clientRegCtrl.message = ""; 
        clientRegCtrl.user.role = 2;       // setting "Client" role
        clientRegCtrl.user.status = 1;     // setting status to "Active"

        clientRegCtrl.register = function () {
            UserSvc.insertUser(clientRegCtrl.user)
                .then(function(user){
                    clientRegCtrl.message = "You have been successfully registered.";
                }).catch(function(err){
                    console.error("Error encountered: ", err);
                    
                    if (err.status == '400')
                        clientRegCtrl.message = "Passwords entered do not match. Please re-type.";
                    else      
                        clientRegCtrl.message = "Registration unsuccessful. Possibly duplicate email.";
                });
        };
    };

    TrainerRegCtrl.$inject = ['UserSvc'];
    function TrainerRegCtrl(UserSvc) {
        var trainerRegCtrl = this;
        
        trainerRegCtrl.user = {};
        trainerRegCtrl.message = ""; 
        trainerRegCtrl.user.role = 1;       // setting "Trainer" role
        trainerRegCtrl.user.status = 1;     // setting status to "Active"

        trainerRegCtrl.register = function () {
            UserSvc.insertUser(trainerRegCtrl.user)
                .then(function(user){
                    trainerRegCtrl.message = "You have been successfully registered.";
                }).catch(function(err){
                    console.error("Error encountered: ", err);
                    
                    if (err.status == '400')
                        trainerRegCtrl.message = "Passwords entered do not match. Please re-type.";
                    else      
                        trainerRegCtrl.message = "Registration unsuccessful. Possibly duplicate email.";
                });
        };

    };

})();
