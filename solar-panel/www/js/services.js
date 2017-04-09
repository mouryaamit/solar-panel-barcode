var API = "http://192.168.1.100:8080/solar-api/"
angular.module('app.services', [])

.factory('SolarFactory', ["$resource",function($resource) {
  return $resource(API, {}, {
    entry : {
      method : 'POST',
      url:API+'entry',
      isArray:false
    },
    status : {
      method : 'POST',
      url:API+'status',
      isArray:false
    },
    readData : {
      method : 'POST',
      url:API+'testing',
      isArray:false
    }
  })
}])

.service('SolarService', [function(){

}]);
