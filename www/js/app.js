// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
      
    // Variables globales
    $rutaPagesWs = 'http://www.cafebritt.com/app/loyalty/ws/pages.cfc?returnformat=json&callback=&method=';
    $rutaAccountWs = 'http://www.cafebritt.com/app/loyalty/ws/account.cfc?returnformat=json&callback=&method=';
    $rutaImagenes = 'http://www.brittespresso.com/siteimg/';
  });
    
  // Esta loqueado?
  isLoggedIn = function () {
        if (window.localStorage.getItem("cliente") !== null) {
            $cliente = JSON.parse(window.localStorage.getItem("cliente"));
            if ($cliente.codigo_cliente !== undefined) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
  };
})

.run(function ($rootScope, $ionicLoading, $state) {

    // Muestra un mensaje mientras carga datos en la vista
    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: 'Loading'
        })
    })
    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide()
    })

    // Manejo de accesos
    $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {

        console.log(error);

        if (error === "No logged") {
            $state.go("tab.login");
        } else if (error === 'Invalid access') {
            $state.go("app.invalidaccess");
        }
    })
})


.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

  // Intercepta un evento http cuando es invocado
  $httpProvider.interceptors.push(function ($rootScope) {
    return {
        request: function (config) {
            if (config.url != 'https://push.ionic.io/dev/push/check')
                $rootScope.$broadcast('loading:show')
            return config
        },
        response: function (response) {
            $rootScope.$broadcast('loading:hide')
            return response
        }
    }
  })

  // Seguridad
  $stateProvider.decorator('data', function (state, parent) {
        var stateData = parent(state);
        state.resolve = state.resolve || {};

        state.resolve.security = ['$q', function ($q) {

            if (stateData.needLogged && !isLoggedIn()) {

                // Necesita estar logueado
                return $q.reject("No logged");
            }
           }];

        return stateData;
  })

  // Manejar de paginas
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'AppCtrl',
    data: {
        needLogged: false
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
        }
    },
    data: {
        needLogged: true
    }
  })
  
  .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      },
      data: {
        needLogged: true
      }
  })
  
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    },
    data: {
        needLogged: true
    }
  })
  
  .state('tab.login', {
      url: '/login',
      views: {
        'tab-login': {
          templateUrl: 'templates/tab-login.html',
          controller: 'ContactCtrl'
        }
      },
      data: {
        needLogged: false
      }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
