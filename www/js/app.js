// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

.run(function($ionicPlatform, $rootScope) {
  
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
          
    // Geolocalizacion    
    geoLocalizar();
  });
    
  // Variables globales
  $rutaPagesWs = 'http://www.cafebritt.com/app/loyalty/ws/pages.cfc?returnformat=json&callback=&method=';
  $rutaAccountWs = 'http://www.cafebritt.com/app/loyalty/ws/account.cfc?returnformat=json&callback=&method=';
  //$rutaPagesWs = 'http://prueba.cafebritt.com/app/loyalty/ws/pages.cfc?returnformat=json&callback=&method=';
  //$rutaAccountWs = 'http://prueba.cafebritt.com/app/loyalty/ws/account.cfc?returnformat=json&callback=&method=';
  $rutaBritttWs = 'http://loyalty.britt.com/ws/account.cfc?returnformat=json&callback=&method=';
  $rutaImagenes = 'http://www.brittespresso.com/siteimg/';

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
    
  // Esta logueado?
  hasGeoData = function () {
        if (window.localStorage.getItem("geodata") !== null) {
            $geodata = JSON.parse(window.localStorage.getItem("geodata"));
            if ($geodata.country_code !== undefined) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
  };
})

.run(function ($rootScope, $ionicLoading, $state, $cordovaGeolocation) {

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
    });    
    
    // Geocolalizacion
    geoLocalizar = function () {
      
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
                
                var lat  = position.coords.latitude;
                var long = position.coords.longitude;                  
                var geocoder = new google.maps.Geocoder();
                var latLng = new google.maps.LatLng(lat,long);
            
                geocoder.geocode({'latLng': latLng}, function (results, status) {
                    
                    if (status == google.maps.GeocoderStatus.OK) 
                    {
                        if (results[0]) 
                        {
                            // Formatted address
                            var currentAdd = results[0].formatted_address;
                            var address = currentAdd;
                            //find country name
                            for (var i=0; i<results[0].address_components.length; i++) 
                            {
                                for (var b=0;b<results[0].address_components[i].types.length;b++) 
                                {                            
                                    if (results[0].address_components[i].types[b] == "country") {
                                        
                                        //this is the object you are looking for
                                        country = results[0].address_components[i];
                                        //console.log(country.short_name + ': ' + country.long_name);
                                        
                                        // Guarda la ubicacion
                                        var $geodata = {};
                                        $geodata.country_name = country.long_name;
                                        $geodata.country_code = country.short_name;
                                        window.localStorage.setItem('geodata', JSON.stringify($geodata));
                                        
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            console.log('No results found');

                        }
                    } 
                    else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) { 
                        console.log('Timeout');
                    } 
                    else {
                        console.log('Weak Signals. Try again');
                    }
                });

          }, function(err) {
            console.log(err);
        });      
    }          
        
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
    cache: false,
    data: {
        needLogged: false
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home/:country_code',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
        }
    },
    cache: false,
    data: {
        needLogged: true
    }
  })
  
  .state('tab.points', {
    url: '/points/:country_code',
    views: {
      'tab-points': {
        templateUrl: 'templates/tab-points.html',
        controller: 'PointsCtrl'
      }
    },
    cache: false,
    data: {
        needLogged: true
    }
  })
  
  .state('tab.map', {
    url: '/map/:country_code',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    },
    cache: false,
    data: {
        needLogged: false
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
      cache: false,
      data: {
        needLogged: false
      }
  })
  
  .state('tab.content', {
      url: '/content/:country_code',
      views: {
        'tab-content': {
          templateUrl: 'templates/tab-content.html',
          controller: 'ContentCtrl'
        }
      },
      cache: false,
      data: {
        needLogged: false
      }
  })
  
  .state('tab.contact-us', {
      url: '/contact-us/:country_code',
      views: {
        'tab-contact-us': {
          templateUrl: 'templates/tab-contact-us.html',
          controller: 'ContactUsCtrl'
        }
      },
      cache: false,
      data: {
        needLogged: false
      }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home/CR');

});
