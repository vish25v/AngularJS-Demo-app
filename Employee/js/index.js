var app1 = angular.module('myApp', ['ngRoute']);
var emp_Array = "";

app1.config(function ($routeProvider) {

   $routeProvider
       .when('/login',{
           controller: 'login-ctrl',
           templateUrl: 'login.html'
       })
       .when('/home',{
           controller: 'home-ctrl',
           templateUrl: 'home.html'
       })
       .when('/empList',{
           controller: 'empList-ctrl',
           templateUrl: 'empList.html'
       })
       .when('/empDetails',{
           controller: 'details-ctrl',
           templateUrl: 'empDetails.html'
       })
       .otherwise({
           redirectTo :'/home'
       });

});

//--------------------------- SERVICES -----------------------------------
app1.service("myService", function ($http, $q) {

    //q is used to make a promise that we gonna use this data later.
    this.msg ="hello from service";

    var deferred = $q.defer();
    $http.get("Employee_Data.JSON")
        .then(function (response) {

             deferred.resolve(response);
        });

    this.getJsonData = function () {
        return deferred.promise;
    };
   var myjsonData =0;



    this.getJsonData2 = function () {
        return $http.get("Employee_Data.JSON");

    }
});

// ----------------------------- Service to set and get the main jsondata array

app1.service("access_json_service", function (myService) {

    var myjsonArray = [];

    return {
        get_myjsonArray: function () {
            return myjsonArray;
        }
        ,
        set_myjsonArray: function (val) {
            myjsonArray = val;
        }
    };
});

//----------------------------- Service to Edit emp data

app1.service("edit_emp_service", function () {

    var emp_to_edit = 0;
    var emp_to_edit_index = 0;
    return{
        getEmp_to_edit: function () {
            return emp_to_edit;
        },
        getEmp_to_edit_index: function () {
            return emp_to_edit_index;
        },
        setEmp_to_edit: function (val, index) {
            emp_to_edit = val;
            emp_to_edit_index = index;

        }
    };

});

//---------------------------- end of service.


//-------------------------- CONTROLLERS ---------------------------------


// ---------------------> LOG-IN CONTROLLER:
app1.controller('login-ctrl', function ($scope, myService) {

    $scope.msg = "Welcome to Login Page-View";
    $scope.smsg = myService.service_msg;

    $scope.login = function () {
        if($scope.username === "Vish" && $scope.password === "1234"){

        }
    }

});

// ---------------------> HOME-PAGE-VIEW CONTROLLER:
app1.controller('home-ctrl', function ($scope, myService) {

    $scope.msg = "Welcome to Home Page-View";
    //$scope.smsg = myService.service_msg;

    $scope.photos =[
        {src: '../testImages/6.jpg', desc:'Image 1: Sunset'},
        {src: '../testImages/1.jpg', desc:'Image 2: Red Petaled Flowers'},
        {src: '../testImages/3.jpg', desc:'Image 3: Green and Blue Leaf Plant'},
        {src: '../testImages/4.jpg', desc:'Image 4: Go Hiking!'},
        {src: '../testImages/5.jpg', desc:'Image 5: Aerial View of Dock and Body of Water'},

    ];
    // initial image index
    $scope._Index = 0;
    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };
    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0 )? --$scope._Index : $scope.photos.length - 1;
    };
    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index:0
    }
    //show a certain image
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };

});

// ---------------------> EMP-LIST VIEW CONTROL33eLER:
app1.controller('empList-ctrl', function ($scope, $http, myService, edit_emp_service, access_json_service, $timeout) {

  /*  $scope.msg = "Welcome to Emp-List View";
    $scope.smsg = myService.service_msg;
*/


    var promise = myService.getJsonData();
    promise.then(function (data) {
        //$scope.emp_List = data;

        $scope.jsondata = data.data;
        console.log("output of getjsondata() inside");
        console.log($scope.jsondata);
    });
    console.log("output of getjsondata() out of box");

    console.log($scope.jsondata);

    $scope.jsondata2 = [];
    //var MyEmpArray = myService.getJsonData2();
     myService.getJsonData2().then(function (response) {
        myService.myjsonData = response.data;
        $scope.jsondata2 = JSON.stringify(myService.myjsonData);
         access_json_service.set_myjsonArray(myService.myjsonData);
         console.log("json array from 3rd service get method : " + access_json_service.get_myjsonArray() );
         console.log("Attention here :"+ JSON.stringify(response.data));


     });

    console.log("2222 Attention here :"+ JSON.stringify($scope.jsondata2));


    var x = myService.myjsonData;
     console.log("checking again:" + x);
    console.log("output of getjsondata2():")
    console.log($scope.jsondata2);
    $scope.mainArray = access_json_service.get_myjsonArray();
    console.log("output using another service::" + $scope.mainArray);
    // Button functions: Delete Emp:*/

    $scope.delete_record = function (item) {
        var index = $scope.jsondata.indexOf(item);
        $scope.jsondata.splice(index, 1);

    };

    $scope.edit_record = function (item) {
        var index = $scope.jsondata.indexOf(item);
        var curr_emp = item;
        console.log(curr_emp);
        console.log("Index of curr empt is: " + index);
        // $scope.$emit('Emp_to_edit', {emp : index} );
        edit_emp_service.setEmp_to_edit(curr_emp, index);


    }

    // Add new emp : empty the setEmp_to_edit so that user can add details of new emp!
    $scope.add_new_record = function () {
        edit_emp_service.setEmp_to_edit(0);

    }
});

// --------------------> EMP-DETAILS VIEW CONTROLLER:
app1.controller('details-ctrl', function ($scope, myService, $http, edit_emp_service) {

   /* $scope.msg = "Welcome to Deatails View";
    $scope.smsg = myService.service_msg;
    var empArray ="";*/

    var promise = myService.getJsonData();
    promise.then(function (data) {
       /* $scope.emp_List = data;*/

        $scope.jsondata = data.data;
        //console.log($scope.jsondata);
    });
    //---------------------------- experiment--------------------------------------------------


    // myService.getJsonData2().then(function (response) {
    //     myService.myjsonData = response.data;
    //     $scope.jsondata2 = JSON.stringify(myService.myjsonData);
    //     access_json_service.set_myjsonArray(myService.myjsonData);
    //     console.log("json array from 3rd service get method : " + access_json_service.get_myjsonArray() );
    //     console.log("Attention here :"+ JSON.stringify(response.data));
    //
    //
    // });

    //-------------------------------------------------------------------------------------------

   $scope.this_emp = edit_emp_service.getEmp_to_edit();
   /* console.log("Emp to edit(receives from the service) is:");
    console.log($scope.this_emp);*/
    //getting index of emp to edit:
    var emp_to_edit_index = edit_emp_service.getEmp_to_edit_index();
    console.log("Index of curr emp received from the service:" + emp_to_edit_index );
    $scope.newEmployee_firstname = $scope.this_emp.firstname;
    $scope.newEmployee_lastname = $scope.this_emp.lastname;
    $scope.newEmployee_id = $scope.this_emp.id;
    $scope.newEmployee_age = $scope.this_emp.age;
    $scope.newEmployee_email = $scope.this_emp.email;
    $scope.newEmployee_gender = $scope.this_emp.gender;
    $scope.newEmployee_city = $scope.this_emp.city;



    if ($scope.this_emp === 0){
            console.log("this_emp is empty!!");
            //$scope.visibility_flag = "false";

            // Add the new Employee details:
            $scope.addEmployee = function () {
                $scope.jsondata.push(
                    {
                        firstname: $scope.newEmployee_firstname,
                        lastname: $scope.newEmployee_lastname,
                        email: $scope.newEmployee_email,
                        id: $scope.newEmployee_id,
                        age: $scope.newEmployee_age,
                        gender: $scope.newEmployee_gender,
                        city: $scope.newEmployee_city

                    });
                $scope.crr_emp = $scope.jsondata[$scope.jsondata.length-1];
                myService.myjsonData = $scope.jsondata;
            };

        }else {
            console.log("this_emp is NOT empty!!");
            // Save the edited Employee details:
             $scope.visibility_flag = "false";

            $scope.saveChanges = function () {
               $scope.jsondata[emp_to_edit_index]=
                    {
                        firstname: $scope.newEmployee_firstname,
                        lastname: $scope.newEmployee_lastname,
                        email: $scope.newEmployee_email,
                        id: $scope.newEmployee_id,
                        age: $scope.newEmployee_age,
                        gender: $scope.newEmployee_gender,
                        city: $scope.newEmployee_city

                    };

                $scope.crr_emp = $scope.jsondata[$scope.jsondata.length-1];
            };
        }

        // console.log($scope.this_emp.firstname);



    // $scope.addEmployee = function () {
    //     $scope.jsondata.push(
    //         {
    //             firstname: $scope.newEmployee_firstname,
    //             lastname: $scope.newEmployee_lastname,
    //             email: $scope.newEmployee_email,
    //             id: $scope.newEmployee_id,
    //             age: $scope.newEmployee_age,
    //             gender: $scope.newEmployee_gender,
    //             city: $scope.newEmployee_city
    //
    //         });
    //     $scope.crr_emp = $scope.jsondata[$scope.jsondata.length-1];
    // };


    //................partice

   /* $scope.$on('Emp_to_edit', function (event, arg) {
        $scope.edit_emp_age = arg.emp;
        console.log($scope.edit_emp_age);
        console.log("parent data:");
        console.log("received:"+$scope.edit_emp_age);
    });*/
    //..............end practice




});

app1.controller('child_ctrl', function ($scope) {

    $scope.childToPar = function (input_age) {
        var myage = input_age;
        $scope.$emit('Emp_to_edit', {emp : myage} );
        console.log("input age is:"+input_age);
    }
});