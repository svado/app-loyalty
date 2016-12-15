angular.module('starter.controllers', [])

// Controlador general
.controller('AppCtrl', function ($scope, $ionicModal, $ionicPlatform, $timeout, $http, $ionicPopup, $state, $parse, $ionicHistory) {

    // Inicializador
    $scope.loginData = {};
    $scope.signData = [];
    $scope.isLoggedIn = isLoggedIn;

    // Obtiene los datos locales
    $scope.getLocalData = function (elemento) {
        $elemento = {};
        if (window.localStorage.getItem(elemento) !== null)
            $elemento = JSON.parse(window.localStorage.getItem(elemento));
        return $elemento;
    }

    // Obtiene los datos de sesion
    $scope.getSessionlData = function (elemento) {
        $elemento = {};
        if (window.sessionStorage.getItem(elemento) !== null)
            $elemento = JSON.parse(window.sessionStorage.getItem(elemento));
        return $elemento;
    }

    //Obtiene los datos del cliente
    $scope.loginData = $scope.getLocalData('cliente');

    // Logout
    $scope.logout = function () {
        window.localStorage.removeItem("cliente");
        window.localStorage.removeItem("orden");
        $state.go("app.home");
    };

    // Alertas
    $scope.showPopup = function ($title, $template) {
        var alertPopup = $ionicPopup.alert({
            title: $title,
            template: $template
        });
        alertPopup.then(function (res) {});
    };

    // Alertas de confirmacion
    $scope.showConfirm = function (titulo, subtitulo, negativo, positivo, fnRetorna) {
        $ionicPopup.show({
            title: titulo,
            subTitle: subtitulo,
            scope: $scope,
            buttons: [
                {
                    text: negativo,
                    type: 'button-light',
                    onTap: function (e) {
                        return true;
                    }
                    },
                {
                    text: positivo,
                    type: 'button-positive',
                    onTap: function (e) {
                        //return $scope.showConfirmOK();
                        return $scope.$eval(fnRetorna);
                    }
                },

              ]
        }).then(function (res) {
            //console.log('Tapped!', res);
        }, function (err) {
            //console.log('Err:', err);
        }, function (msg) {
            //console.log('message:', msg);
        });
    };

    // Actualiza una paginas
    $scope.refreshPage = function () {
        $state.go($state.current, {}, {
            reload: true
        });
    }

    // Modal sign up
    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalSignUp = modal;
    });
    $scope.closeSignUp = function () {
        $scope.modalSignUp.hide();
    };
    $scope.signup = function () {
        $scope.modalSignUp.show();
    };

    // Modal log in
    $ionicModal.fromTemplateUrl('templates/login-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalLogin = modal;
    });
    $scope.closeLogin = function () {
        $scope.modalLogin.hide();
    };
    $scope.login = function () {
        $scope.modalLogin.show();
    };
})

.controller('DashCtrl', function($scope) {

    $codigo_cliente = $scope.loginData.codigo_cliente;

    JsBarcode("#barcode", $codigo_cliente, {
      format: "CODE128",
      lineColor: "#000",
      width:3,
      displayValue: true
    });

})

// Manejo de clientes
.controller('ContactCtrl', function ($scope, $rootScope, $http, $stateParams, $state, $ionicHistory) {

    // Trata de loguearse en la web.
    $scope.doLogin = function (page) {

        $scope.error = true;
        $params = '&username=' + $scope.loginData.email + '&password=' + $scope.loginData.password;
        $method = 'getUser';
        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $cliente = {};
                    $cliente.codigo_cliente = data.CODIGO_CLIENTE;
                    $cliente.first_name = data.FIRST_NAME;
                    $cliente.last_name = data.LAST_NAME;
                    $cliente.email = data.EMAIL;
                    $scope.error = false;
                    window.localStorage.setItem('cliente', JSON.stringify($cliente));
                    console.log('Logueado', $cliente);
                    if (data.ALERTA.length != 0) $scope.showPopup('Sign In', data.ALERTA);
                    $scope.closeLogin();

                    // Reenvia a la cuenta o continua con el envio
                    $state.go("tab.dash");
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Sign In', data.ALERTA);
            } else {
                $scope.showPopup('Sign In', 'Connection Error');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };

    // Crea el cliente en la web.
    $scope.doSignUp = function () {

        $scope.error = true;
        $params = '&first_name=' + $scope.signData.first_name + '&last_name=' + $scope.signData.last_name + '&email=' + $scope.signData.email + '&phone=' + $scope.signData.phone + '&password=' + $scope.signData.password + '&password2=' + $scope.signData.password2;
        $method = 'createUser';
        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $cliente = {};
                    $cliente.email = data.EMAIL;
                    window.localStorage.setItem('cliente', JSON.stringify($cliente));
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Sign Up', data.ALERTA);
                    $scope.closeSignUp();
                    $scope.login();
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Sign Up', data.ALERTA);
            } else {
                $scope.showPopup('Sign Up', 'Connection Error');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {

    var onSuccess = function(position) {
        /*alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');*/

        $scope.showPopup('Sign Up', 'hola');
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        /*alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');*/
        $scope.showPopup('Sign Up', error);
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
})

// Genericos
.controller('GenericCtrl', function ($scope, $rootScope, $ionicHistory) {

});
