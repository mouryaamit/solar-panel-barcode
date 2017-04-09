/**
 * Created by amitmourya on 08/04/17.
 */
(function(){

    var testingMethods = require('../../apiMethods/solar/testingMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var api = function api(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    api.prototype.requestApi = function(){
        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = testingMethods(this.response.config , this.tnxId);
        user.testing(this.body,resHandle);
    };

    module.exports.api = function(rin , callback){

        var dApi = new api(rin , callback);
        dApi.requestApi();
    };
})();