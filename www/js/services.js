function ErrorsService(ToastService, $state, AuthService){

    var getError = function(error){
        console.log(error);
        var text = "Se ha producido un error. Intentelo mas tarde";
        if(error.status == 401){

                text = error.data.error;
                ToastService.show(text, 'danger');
                return;
        }
        if(error.status == 429){

                text = error.data;
                ToastService.show(text, 'danger');
                return;
        }
        if(error.status == 500){

                ToastService.show(text, 'danger');
                return;
        }
        if (typeof error != 'undefined') {
            var response = null;
            if (typeof error.data != 'undefined') {
                response = error.data;
            } else if (typeof error.data != 'undefined' && typeof error.data.message != 'undefined') {
                response = error.data.message;
            }
            if (response) {
                if (typeof response.message == 'string') {
                    ToastService.show(response.message, 'danger');
                    return;
                } else if (typeof response.description == 'object') {
                    for (var i = 0; i < response.description.length; i++) {
                        ToastService.show(response.description[i].error, 'danger');
                    }
                    return;
                }
            }
        } else {

            $state.go('app.dashboard');
        }

    }


    return {

        getError: getError
    }

}
     
function AuthService(GeneralFactory, $state, $q, store, $rootScope){

    var getToken = function(data){
        var deferred,
        deferred = $q.defer();

        GeneralFactory.post('login', data, true).then(function(response){
            console.log(response);
            $rootScope.token = response.token;
            $rootScope.myData = response.data;
            store.set('token', response.token);
            store.set('myData', response.data);
            deferred.resolve(response);
        }, function(error){

        });

        return deferred.promise;
    }

    var refreshToken = function(){
        var deferred,
        deferred = $q.defer();
        GeneralFactory.get('refreshToken', {}, false).then(function(response){
            console.log(response.token);
            console.log(store.get('token'));
            
            $rootScope.token = response.token;
            store.set('token', response.token);
            console.log(store.get('token'));
            localStorage.setItem('token', response.token);
            deferred.resolve(response);
            $state.reload();

        }, function(error){

        });

        return deferred.promise;
    }


    return {

        getToken: getToken,
        refreshToken:refreshToken
    }

}

angular.module('starter.controllers')
    .service('ErrorsService', ErrorsService)
    .service('AuthService', AuthService)