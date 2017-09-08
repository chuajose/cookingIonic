// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'angular-jwt', 'angular-storage','ngFileUpload'])

.run(function($ionicPlatform, $rootScope, jwtHelper, store, $location) {
  
  $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
    });

    $rootScope.$on('$stateChangeStart', function (event, toState) {
        console.log(toState);
        if (toState.name !== 'app.register' && toState.name !== 'app.login') {

            var user = store.get("myData") || null;
            var token = store.get("token") || null, bool = true;

            $rootScope.myData = user;
            if(token  && user.status == 0){
                    $location.path('/app/validate');
            }

            if (!token) {
                $location.path('/app/register');
                return false;
              }
              bool = jwtHelper.isTokenExpired(token);
            if (bool === true) {
                $location.path('/app/register');
                  return false;
              }
          }
       
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, jwtOptionsProvider, $sceDelegateProvider, $compileProvider, $ionicConfigProvider) {

   jwtOptionsProvider.config({

      whiteListedDomains: ['192.168.0.8', 'localhost'],
      tokenGetter: ['options', function(options) {
        //myService.doSomething();
        var token =localStorage.getItem('token');
        if(token != null){
          return token.replace(/['"]+/g, '');
          }
      }]

    });

    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push(function ($q, $injector) {

        return {
           /* 'request': function(config) {
                if (config.url.substr(0, 4) === 'img/' || config.url.substr(config.url.length - 5) === '.html' || config.url.substr(config.url.length - 5) === '.json'|| config.url.substr(config.url.length - 3) === '.js'|| config.url.substr(config.url.length - 4) === '.css') {
                    config.url  = CONFIG.BASEURL + 'src/' + config.url
                }
                //console.log(config)
              // do something on success
              return config;
            },
*/
            'response': function (response) {
                /*//Will only be called for HTTP up to 300
                console.log('Response',response);*/

                //console.log(response);
                return response;
            },
            'responseError': function (rejection) {
                console.log(rejection);
                if(rejection.status === 400) {

                    if(rejection.data.error == "token_not_provided"){
                        var AuthService = $injector.get('AuthService'); //Injecta el services AuthService
                        AuthService.refreshToken();
                    }
                } else if(rejection.status === 401) {

                    if(rejection.data.error == "Unauthenticated."){
                        var AuthService = $injector.get('AuthService'); //Injecta el services AuthService
                        AuthService.refreshToken();
                    }else if(rejection.data.error == "invalid_access"){

                        var ErrorsService = $injector.get('ErrorsService'); //Injecta el services ErrorsService
                        ErrorsService.getError(rejection);
                    }else if(rejection.data.error == "token_invalid"){
                       // document.location.href = 'http://localhost/ionic.visioon/www';
                       //localStorage.clear();
                    }else{
                        
                        //document.location.href = 'http://localhost:9000/#/login';
                    }
                }else if (rejection.status >= 400) {
                    //Si se da un error superior a 400 cargo  el service ErrorsService aqui configurado y ejecuto el getError de ese servico
                    var ErrorsService = $injector.get('ErrorsService'); //Injecta el services ErrorsService
                    ErrorsService.getError(rejection);
                    //console.log('ErrorRuta',rejection);

                }
                return $q.reject(rejection);
            }
        };
    });

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
    .state('app.register', {
    url: '/register',
    views: {
      'menuContent': {
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl as RegisterCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl as LoginCtrl'
      }
    }
  })

  .state('app.start', {
      url: '/start',
      //abstract: true,
          views: {
            'menuContent': {
              templateUrl: 'templates/start/index.html',
              controller: 'StartCtrl as StartCtrl',

            }
          }

  })
  .state('app.start.list', {
      url: '/list',
      params: {
          folderId: null,
        },
      views: {
          'start': {
              templateUrl: 'templates/start/list.html',
              controller: 'StartCtrlList as StartCtrlList',
          }
      }
  })

  .state('app.recipes', {
      url: '/recipes',
      //abstract: true,
          views: {
            'menuContent': {
              templateUrl: 'templates/recipes/index.html',
              controller: 'RecipesCtrl as RecipesCtrl',

            }
          }

  })
  .state('app.recipes.list', {
      url: '/list',
      params: {
          folderId: null,
        },
      views: {
          'recipes': {
              templateUrl: 'templates/recipes/list.html',
              controller: 'RecipesCtrlList as RecipesCtrlList',
          }
      }
  })
  .state('app.recipes.add', {
        url: '/add',
        views: {
            'recipes': {
               templateUrl: 'templates/recipes/add.html',
                controller: 'RecipesCtrlAdd as RecipesCtrlAdd'
            }
        }
    })
  .state('app.recipes.show', {
        url: '/show:id',
        views: {
            'recipes': {
               templateUrl: 'templates/recipes/show.html',
                controller: 'RecipesCtrlShow as RecipesCtrlShow'
            }
        }
    })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/recipes/list');
})
.constant('CONFIG',urls());

function urls(){
    return {
        APIURL: 'http://localhost:8000/api/',
        STORAGEURL: 'http://localhost:8000/storage/',
        BASEURL: 'http://localhost:9000/'
    }
}