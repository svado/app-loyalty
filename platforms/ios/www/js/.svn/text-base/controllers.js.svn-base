angular.module('starter.controllers', [])

// Controlador general
.controller('AppCtrl', function ($scope, $ionicModal, $ionicPlatform, $timeout, $http, $ionicPopup, $state, $parse, $ionicHistory, $rootScope) {

    // Inicializador
    $scope.loginData = {};
    $scope.signData = [];
    $scope.resetData = [];
    $scope.contactData = [];
    $scope.isLoggedIn = isLoggedIn;
    $rootScope.countries = $scope.countries;
    $rootScope.britt_countries = $scope.britt_countries;
    $scope.rutaImagenes = $rutaImagenes;
        
    // Geolocalizacion    
    geoLocalizar();
    
    // Obtiene los datos de session
    $scope.getSessionData = function (elemento) {
        $elemento = '';
        if (window.sessionStorage.getItem(elemento) !== null)
            $elemento = window.sessionStorage.getItem(elemento);
        return $elemento;
    }

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
        $state.go("tab.home", {
            reload: true
        });
    };

    // Alertas
    $scope.showPopup = function ($title, $template, $error = false) {
        var alertPopup = $ionicPopup.alert({
            title: $title,
            template: $template,
            buttons: [{
                text: 'OK',
                type: $error == true ? 'button-assertive' : 'button-positive'
              }]
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
        scope: $scope,
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modalSignUp = modal;
    });
    $scope.closeSignUp = function () {
        $scope.modalSignUp.hide();
    };
    $scope.signup = function () {
        $scope.modalSignUp.show();
    };

    // Modal login
    $ionicModal.fromTemplateUrl('templates/login-modal.html', {
        scope: $scope,
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modalLogin = modal;
    });
    $scope.closeLogin = function () {
        $scope.modalLogin.hide();
    };
    $scope.login = function () {
        $scope.modalLogin.show();
    };
    
    // Modal reset
    $ionicModal.fromTemplateUrl('templates/reset.html', {
        scope: $scope,
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modalReset = modal;
    });
    $scope.closeReset = function () {
        $scope.modalReset.hide();
    };
    $scope.reset = function () {
        $scope.modalReset.show();
    };   
    
    
})

// Manejo del codigo de barras
.controller('HomeCtrl', function($scope, $rootScope, $http, $stateParams, $state, $ionicHistory) {
    
    // Inactiva el boton de atras
    $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });
        
    // Variables principales    
    var country_code = '';   
    $rootScope.countries = $scope.countries;
        
    // Obtiene los datos del cliente    
    $scope.loginData = $scope.getLocalData('cliente'); 
    
    // Obtiene los datos de geolocalizacion
    if ($stateParams.country_code == '' || $stateParams.country_code === undefined) {        
        geoLocalizar();
        $scope.geoData = $scope.getLocalData('geodata');        
        country_code = $scope.geoData.country_code;
        //country_name = $scope.geoData.country_name;
    } else {
        country_code = $stateParams.country_code;
    }    
        
    // Obtiene el contenido    
    $params = '&country_iso2='+country_code+'&menu=INICIO&article_types=163';
    $method = 'getPageArticles';
    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        if (data.length != 0) {
            $scope.content = data[0].TEXT;
            $scope.page_title = data[0].PAGE_HEADER;
            $scope.error = false;
        }
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });
})

// Manejo de clientes
.controller('ContactCtrl', function ($scope, $rootScope, $http, $stateParams, $state, $ionicHistory, $filter) {                   

    // Variables principales    
    var country_code = '';
    var country_name = '';
    $rootScope.countries = $scope.countries;    
    
    // Obtiene los datos de la geolocalizacion
    $scope.geoData = $scope.getLocalData('geodata');        
    $scope.loginData = {};
    $scope.loginData.country_code = $scope.geoData.country_code;
    $scope.loginData.use_email = 'EMAIL';
    
    var currentDate = new Date()
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    $scope.signData.birth_date = new Date(year+'-'+month+'-'+day);

    // Obtiene los datos de geolocalizacion
    if ($stateParams.country_code == '' || $stateParams.country_code === undefined) {        
        geoLocalizar();
        $scope.geoData = $scope.getLocalData('geodata');        
        country_code = $scope.geoData.country_code;
        country_name = $scope.geoData.country_name;
    } else {
        country_code = $stateParams.country_code;
    }
    $scope.country_code = country_code;
    $scope.country_name = country_name;
    
    // Trata de loguearse en la web.
    $scope.doLogin = function (page) {

        $scope.error = true;        
        if ($scope.loginData.use_email == 'EMAIL') {
            $params = '&username=' + $scope.loginData.email + '&password=' + $scope.loginData.password + '&codigo_cliente=0';    
        } else {
            $params = '&username=0&password=' + $scope.loginData.password + '&codigo_cliente=' + $scope.loginData.codigo_cliente;
        }        
        
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
                    if (data.ALERTA.length != 0) $scope.showPopup('Ingreso', data.ALERTA);
                    $scope.closeLogin();

                    // Reenvia al home
                    $state.go("tab.home");
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Ingreso', data.ALERTA, true);
            } else {
                $scope.showPopup('Ingreso', 'Connection Error', false);
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };

    // Crea el cliente en la web.
    $scope.doSignUp = function () {
        
        var bday = $filter("date")($scope.signData.birth_date, 'yyyy-MM-dd');
        $scope.error = true;
        $params = '&first_name=' + $scope.signData.first_name + '&last_name=' + $scope.signData.last_name + '&email=' + $scope.signData.email + '&phone=' + $scope.signData.phone + '&password=' + $scope.signData.password + '&password2=' + $scope.signData.password2 + '&codigo_pais='+fSignUp.codigo_pais.value + '&birth_date='+bday;
        $method = 'createUser';
        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $cliente = {};
                    $cliente.email = data.EMAIL;
                    window.localStorage.setItem('cliente', JSON.stringify($cliente));
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Registro', data.ALERTA);
                    $scope.closeSignUp();
                    $scope.login();
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Registro', data.ALERTA, true);
            } else {
                $scope.showPopup('Registro', 'Connection Error', true);
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };
    
    // Resetea la clave.
    $scope.doReset = function () {
        $scope.error = true;
        $params = '&email=' + $scope.resetData.email;
        $method = 'resetPassword';
        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Solicitud enviada', data.ALERTA);
                    $scope.closeReset();
                    $scope.login();
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Ingreso', data.ALERTA, true);
            } else {
                $scope.showPopup('Registro', 'Error de conexión',true);
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    }
    
    // Cambia el pais de la session
    $scope.changeCountry = function($country_code) {
        console.log($country_code);
        sessionStorage.setItem('country_code', $country_code);
        $state.go("tab.home", {country_code:$country_code}, {
            reload: true
        });
    }
})

// Manejo de los puntos
.controller('PointsCtrl', function($scope, $rootScope, $http, $stateParams, $state, $ionicHistory, $ionicModal) {

    // Variables principales    
    var country_code = '';    
    
    // Obtiene los datos del cliente    
    $scope.loginData = $scope.getLocalData('cliente'); 
    $codigo_cliente = $scope.loginData.codigo_cliente;
    
    // Obtiene los datos de geolocalizacion
    if ($stateParams.country_code == '' || $stateParams.country_code === undefined) {        
        geoLocalizar();
        $scope.geoData = $scope.getLocalData('geodata');        
        country_code = $scope.geoData.country_code;
    } else {
        country_code = $stateParams.country_code;
    }    
    
    // Obtiene el contenido
    $params = '&country_iso2='+country_code+'&menu=PUNTOS&article_types=163';
    $method = 'getPageArticles';
    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        if (data.length != 0) {
            $scope.content = data[0].TEXT;
            $scope.page_title = data[0].PAGE_HEADER;
            $scope.error = false;
        }
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });
    
    // Trata de loguearse en la web.
    $scope.getPoints = function () {
        
        $scope.error = true;
        $params = '&codigo_cliente=' + $scope.loginData.codigo_cliente + '&email=' + $scope.loginData.email;
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
                    $cliente.puntos_totales_web = data.PUNTOS_TOTALES_WEB;
                    $cliente.puntos_totales_espresso = data.PUNTOS_TOTALES_ESPRESSO;
                    $cliente.puntos_totales_brittshop = data.PUNTOS_TOTALES_BRITTSHOP
                    $scope.error = false;
                    $scope.loginData = $cliente;
                    window.localStorage.setItem('cliente', JSON.stringify($cliente));                    
                    if (data.ALERTA.length != 0) $scope.showPopup('Perfil', data.ALERTA);
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Perfil', data.ALERTA, true);
            } else {
                $scope.showPopup('Perfil', 'Connection Error', true);
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };
    
    // Modal profile
    $ionicModal.fromTemplateUrl('templates/profile.html', {
        scope: $scope,
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modalProfile = modal;
    });
    $scope.closeProfile = function () {
        $scope.modalProfile.hide();
    };
    $scope.profile = function () {        
        $scope.modalProfile.show();
    };
    
    // Obtiene los puntos
    //$scope.getPoints();

    // Genera el codigo de barras
    JsBarcode("#barcode", $codigo_cliente, {
      format: "CODE128",
      lineColor: "#000",
      width:3,
      displayValue: true,
      height:60
    });        
})

// Manejo del contenido por pais
.controller('ContentCtrl', function ($scope, $rootScope, $ionicHistory, $http, $stateParams, $ionicSlideBoxDelegate) {

    // Inactiva el boton de atras
    $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });
        
    var country_code = '';
    
    // Obtiene los datos de geolocalizacion
    if ($stateParams.country_code == '' || $stateParams.country_code === undefined) {        
        geoLocalizar();
        $scope.geoData = $scope.getLocalData('geodata');        
        country_code = $scope.geoData.country_code;
    } else {
        country_code = $stateParams.country_code;
    }
        
    // Obtiene el contenido
    $params = '&country_iso2='+country_code+'&menu=PRODUCTOS&article_types=163';
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

// Manejo del contenido del mapa
.controller('MapCtrl', function ($scope, $rootScope, $ionicHistory, $http, $stateParams) {

    // Inactiva el boton de atras
    $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
    });
        
    // Variables principales    
    var country_code = '';
    
    // Obtiene los datos de geolocalizacion
    if ($stateParams.country_code == '' || $stateParams.country_code === undefined) {        
        geoLocalizar();
        $scope.geoData = $scope.getLocalData('geodata');        
        country_code = $scope.geoData.country_code;
    } else {
        country_code = $stateParams.country_code;
    }
        
    // Obtiene el contenido
    $params = '&country_iso2='+country_code+'&menu=MAPA&article_types=163';
    $method = 'getPageArticles';
    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        if (data.length != 0) {
            $scope.content = data[0].TEXT;
            $scope.page_title = data[0].PAGE_HEADER;
            $scope.error = false;
        }
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });
})

// Manejo del profile
.controller('ProfileCtrl', function($scope, $rootScope, $http, $stateParams, $state, $ionicHistory, $filter) {
    
    // Obtiene los datos del contacto
    $cliente = $scope.getLocalData('cliente');

    // Variables principales    
    var country_code = '';    
    
    // Obtiene los datos de geolocalizacion
    if ($stateParams.country_code == '' || $stateParams.country_code === undefined) {        
        geoLocalizar();
        $scope.geoData = $scope.getLocalData('geodata');        
        country_code = $scope.geoData.country_code;
    } else {
        country_code = $stateParams.country_code;
    }
    
    if (isLoggedIn()) {
        $scope.error = true;
        $params = '&codigo_cliente=' + $cliente.codigo_cliente;
        $method = 'getContact';
        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.codigo_cliente = data.CODIGO_CLIENTE;
                    $scope.first_name = data.FIRST_NAME;
                    $scope.last_name = data.LAST_NAME;
                    $scope.email = data.EMAIL;
                    $scope.address_1 = data.ADDRESS_1;
                    $scope.address_2 = data.ADDRESS_2;
                    $scope.city = data.CITY;
                    $scope.state = data.STATE;
                    $scope.pais = data.PAIS;
                    $scope.phone = data.PHONE;
                    $scope.codigo_email = data.CODIGO_EMAIL;
                    $scope.codigo_address = data.CODIGO_ADDRESS;
                    $scope.codigo_phone = data.CODIGO_PHONE;
                    $scope.codigo_state = data.CODIGO_STATE;
                    $scope.countries = data.COUNTRIES;
                    $scope.birth_date = new Date(data.BDAY_YEAR+'-'+data.BDAY_MONTH+'-'+data.BDAY_DAY);
                    
                    if (data.CODIGO_PAIS == '') {
                        $scope.codigo_pais = 0;
                        $scope.iso2 = country_code;    
                    } else {
                        $scope.codigo_pais = data.CODIGO_PAIS;                    
                        $scope.iso2 = data.ISO2;
                    }        
                    
                    $scope.password = '';
                    $scope.password2 = '';
                    $scope.error = false;                    
                    if (data.ALERTA.length != 0) $scope.showPopup('Perfil', data.ALERTA);
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Perfil', data.ALERTA, true);
            } else {
                $scope.showPopup('Perfil', 'Connection Error', true);
            }
        }).
        error(function (data, status) {
            console.log(status);
        }); 
    }
    
    // Actualiza un contacto
    $scope.updContact = function () {

        $scope.error = true;
        var bday = $filter("date")($scope.birth_date, 'yyyy-MM-dd');
        
        $params = '&first_name=' + $scope.first_name + '&last_name=' + $scope.last_name + '&email=' + $scope.email + '&phone=' + $scope.phone + '&password=' + $scope.password + '&password2=' + $scope.password2 + '&codigo_cliente=' + $scope.codigo_cliente + '&codigo_email=' + $scope.codigo_email + '&codigo_phone=' + $scope.codigo_phone + '&codigo_pais='+fProfile.codigo_pais.value + '&codigo_address='+$scope.codigo_address + '&birth_date='+bday;        
        $method = 'updContact';
        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Perfil', data.ALERTA);
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Perfil', data.ALERTA, true);
            } else {
                $scope.showPopup('Perfil', 'Error de conexión', true);
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    };
})

// Manejo del profile
.controller('TermsCtrl', function($scope, $rootScope, $ionicHistory, $http, $stateParams, $ionicModal) {
  
    // Obtiene el contenido
    $params = '&country_iso2=CR&menu=TERMINOS&article_types=163';
    $method = 'getPageArticles';
    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        if (data.length != 0) {
            $scope.content_term = data[0].TEXT;
            $scope.title_term = data[0].TITLE;
            $scope.page_title_term = data[0].PAGE_HEADER;
            $scope.error = false;
        }
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });
    
    // Modal terms and conditions
    $ionicModal.fromTemplateUrl('templates/terms-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalTerms = modal;
    });
    $scope.closeTerms = function () {
        $scope.modalTerms.hide();
    };
    $scope.terms = function () {
        $scope.modalTerms.show();
    };        
})

// Contactenos
.controller('ContactUsCtrl', function ($scope, $rootScope, $ionicHistory, $http, $stateParams, $state) {

    // Obtiene los datos del contacto
    $cliente = $scope.getLocalData('cliente');
    $scope.email = $cliente.email;
        
    // Variables principales    
    var country_code = '';
    
    // Obtiene los datos de geolocalizacion
    if ($stateParams.country_code == '' || $stateParams.country_code === undefined) {        
        geoLocalizar();
        $scope.geoData = $scope.getLocalData('geodata');        
        country_code = $scope.geoData.country_code;
    } else {
        country_code = $stateParams.country_code;
    }
        
    // Obtiene el contenido
    $params = '&country_iso2='+country_code+'&menu=CONTACTO&article_types=163';
    $method = 'getPageArticles';
    $http.post($rutaPagesWs + $method + $params).
    success(function (data, status, headers) {
        if (data.length != 0) {
            $scope.content = data[0].TEXT;
            $scope.page_title = data[0].PAGE_HEADER;
            $scope.error = false;
        }
    }).
    error(function (data, status) {
        $scope.error = true;
        console.log(status);
    });
    
    // Envia el comentario
    $scope.contactUs = function () {
        $scope.error = true;
        $params = '&email=' + fContact.email.value + '&comment=' + fContact.comment.value;
        $method = 'contactUs';
        $http.post($rutaAccountWs + $method + $params).
        success(function (data, status, headers) {
            if (data.length != 0) {
                if (data.ERROR == false) {
                    $scope.error = false;
                    if (data.ALERTA.length != 0) $scope.showPopup('Solicitud enviada', data.ALERTA);
                } else
                if (data.ALERTA.length != 0) $scope.showPopup('Contacto', data.ALERTA, true);
            } else {
                $scope.showPopup('Contacto', 'Error de conexión',true);
            }
        }).
        error(function (data, status) {
            console.log(status);
        });
    }
});