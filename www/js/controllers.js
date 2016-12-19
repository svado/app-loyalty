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

    //Obtiene los datos del cliente y geolocalizacion 
    $scope.loginData = $scope.getLocalData('cliente');  
    $scope.geoData = $scope.getLocalData('geodata');
    
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


// Manejo del codigo de barras
.controller('DashCtrl', function($scope) {
    
    // Obtiene los datos del cliente
    $scope.loginData = $scope.getLocalData('cliente');
    $codigo_cliente = $scope.loginData.codigo_cliente;

    // Genera el codigo de barras
    JsBarcode("#barcode", $codigo_cliente, {
      format: "CODE128",
      lineColor: "#000",
      width:3,
      displayValue: true
    });
    
})

// Manejo de clientes
.controller('ContactCtrl', function ($scope, $rootScope, $http, $stateParams, $state, $ionicHistory) {                   
    
    // Obtiene los datos de la geolocalizacion
    $scope.geoData = $scope.getLocalData('geodata');        
    $scope.loginData = {};
    $scope.loginData.country_code = $scope.geoData.country_code;    
    
    // Trata de loguearse en la web.
    $scope.doLogin = function (page) {

        $scope.error = true;
        $params = '&username=' + $scope.loginData.email + '&password=' + $scope.loginData.password;
        $method = 'getUser';
        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            console.log($scope.loginData.country_code);
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
                    
                    // Geolocalizacion    
                    geoLocalizar();

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


// Manejo de los puntos
.controller('PointsCtrl', function($scope, $rootScope, $http, $stateParams, $state, $ionicHistory) {

    // Obtiene los datos del cliente    
    $scope.loginData = $scope.getLocalData('cliente'); 
    
    // Trata de loguearse en la web.
    $scope.getPoints = function () {
        
        $scope.error = true;
        $params = '&codigo_cliente=1' + $scope.loginData.codigo_cliente;
        $method = 'GetPoints';
        $http.post($rutaBritttWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $cliente = {};
                    $cliente.codigo_cliente = $scope.loginData.codigo_cliente;
                    $cliente.first_name = $scope.loginData.first_name;
                    $cliente.last_name = $scope.loginData.last_name;
                    $cliente.email = $scope.loginData.email;
                    $cliente.puntos_totales = data.PUNTOS_TOTALES;                    
                    $scope.error = false;
                    $scope.loginData = $cliente;
                    window.localStorage.setItem('cliente', JSON.stringify($cliente));                    
                    if (data.ALERTA.length != 0) $scope.showPopup('Points', data.ALERTA);
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Points', data.ALERTA);
            } else {
                $scope.showPopup('Points', 'Connection Error');
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };
    
    // Obtiene los puntos
    $scope.getPoints();
})

// Manejo del contenido por pais
.controller('ContentCtrl', function ($scope, $rootScope, $ionicHistory, $http, $stateParams) {

    // Inactiva el boton de atras
    $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });
        
    var template_id = 0;
    var country_code = '';
    
    // Obtiene los datos de geolocalizacion
    if ($stateParams.country_code == '') {
        $scope.geoData = $scope.getLocalData('geodata');
        country_code = $scope.geoData.country_code;
    } else {
        country_code = $stateParams.country_code;
    }
    
    // Cambia de pais
    if (country_code == 'CR') {
        template_id = 114; // Costa Rica
    } else if (country_code== 'PE') {
        template_id = 115; // Peru
    }
    
    // Obtiene el contenido
    $params = '&template_id='+template_id+'&article_types=163';
    $method = 'getPageArticles';
    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        if (data.length != 0) {
            $scope.contents = data;
            $scope.page_title = data[0].PAGE_HEADER;
            $scope.error = false;
        }
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });
})

// Genericos
.controller('GenericCtrl', function ($scope, $rootScope, $ionicHistory) {

});