angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

})


.controller('LoginCtrl', function($rootScope, $scope, $stateParams,GeneralFactory, $state, store){
    var vm = this;



    vm.login = function(){
        var query = {};
        query.email = vm.username;
        query.password = vm.password;

        GeneralFactory.post('login',query,true).then(function(response){

            $rootScope.token = response.token;
            $rootScope.myData = response.user;
            store.set('token', response.token);
            store.set('myData', response.user);
            $state.go('app.start.list');
        });

    }

})
.controller('RegisterCtrl', function($rootScope, $scope, $stateParams,GeneralFactory, store, $state){
    var vm = this;
    vm.permit_username = true;
    var x = Math.floor((Math.random() * 10000000) + 1);
    vm.username = "demo"+x;   
    vm.name = "nombre demo "+x;
    vm.email = x+"@example.org";
    vm.phone = "689"+x;
    vm.password = 11111111;
    vm.password_confirmation = 11111111;
    vm.birthdate = '1977-02-02';
    vm.checkUsername = function(){
        GeneralFactory.post('register/check_username',{username: vm.username},true).then(function(response){

          if(!response.avaliable) vm.permit_username = false; else vm.permit_username = true;
          console.log(response);
        });

    }

    vm.register = function(){
        if(!vm.permit_username || vm.phone == "") return false;
        var query = {};
        query.username = vm.username;
        query.password = vm.password;
        query.phone = vm.phone;
        query.email = vm.email;
        query.name = vm.name;
        query.password_confirmation = vm.password_confirmation;
        query.file = vm.file;
        query.birthdate = vm.birthdate;
        GeneralFactory.post('register',query,true).then(function(response){
            console.log(response);
            $rootScope.token = response.token;
            $rootScope.myData = response.user;
            store.set('token', response.token);
            store.set('myData', response.user);
            $state.go('app.validate');
        });

    }

})

.controller('StartCtrl', function($rootScope, $scope, $stateParams,GeneralFactory, store, $state){
    var vm = this;

   

})
.controller('StartCtrlList', function($rootScope, $scope, $stateParams,GeneralFactory, store, $state){
    var vm = this;

})

.controller('RecipesCtrl', function($rootScope, $scope, $stateParams,GeneralFactory, store, $state){
    var vm = this;

   

})
.controller('RecipesCtrlList', function($rootScope, $scope, $stateParams,GeneralFactory, store, $state, CONFIG){
    var vm = this;
    vm.storageUrl = CONFIG.STORAGEURL;
     GeneralFactory.get('recipes',{},false).then(function(data){
        vm.recipes = data.data;

    });

})
.controller('RecipesCtrlAdd', function($rootScope, $scope, $stateParams,GeneralFactory, store, $state){
    var vm = this;

    resetRecipe = function(){
        vm.recipe = {};
        vm.recipe.text = "";
        vm.recipe.type = 0;
        vm.recipe.ingredients = [];
        vm.recipe.ingredients.push({name:'', amount:''});
    }
    
    vm.sendRecipe = function(){

        console.log(vm.recipe);
        var query = {};
        query.name = vm.recipe.name;
        query.description = vm.recipe.description;
        query.ingredients = vm.recipe.ingredients;
        query.file= vm.recipe.file;
        query.images = vm.recipe.images;
        
        console.log(query);
        GeneralFactory.upload('recipes',query).then(function(data){
            //vm.list.unshift(data.recipe);
            resetRecipe();
        });

        
    }

    vm.selectType = function(type){
        vm.recipe.type = type;
    }

    resetRecipe();

})
.controller('RecipesCtrlShow', function($rootScope, $scope, $stateParams,GeneralFactory, store, $state, CONFIG){
    var vm = this;
    vm.storageUrl = CONFIG.STORAGEURL;
     GeneralFactory.get('recipes/'+$stateParams.id,{},false).then(function(data){
        vm.recipe = data;

    });

})


;
