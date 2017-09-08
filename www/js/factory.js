function GeneralFactory($http, $q, CONFIG, $rootScope, Upload){

    var get = function(url, params, skipAuthorization){
        var deferred,
        deferred = $q.defer();

        $http({
            method: 'GET',
            skipAuthorization: skipAuthorization, //no queremos enviar el token en esta petición
            url: CONFIG.APIURL + url,
            params:params,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            console.log(res);
            deferred.resolve(res.data);

        }, function (error) {
            deferred.reject(error);

        });

        return deferred.promise;
    }

    var post = function(url, data, skipAuthorization){
        var deferred,
           
        deferred = $q.defer();

        $http({
                method: 'POST',
                skipAuthorization: skipAuthorization, //no queremos enviar el token en esta petición
                url: CONFIG.APIURL + url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (res) {
                deferred.resolve(res.data);
            }, function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    var upload = function(url, data){

        var deferred = $q.defer();
        Upload.upload({
            url: CONFIG.APIURL + url,
            data: data
        }).progress(function (evt) {
            //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
            //console.log('file ', config);
            console.log('uploaded. Response: ', data);
            console.log('ok status: ' + status);
            deferred.resolve(data);

        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
            
            deferred.reject(data);
        });

        return deferred.promise;
    
    }

    return {
        get:get,
        post:post,
        upload:upload
    }

}
angular.module('starter.controllers')
    .factory('GeneralFactory', GeneralFactory);