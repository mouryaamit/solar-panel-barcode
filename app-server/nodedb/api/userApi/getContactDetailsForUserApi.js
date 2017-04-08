/**
 * Created by Amit Mourya on 20/04/16.
 */
(function(){

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var getContactDetailsForUserApi = function getContactDetailsForUserApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    getContactDetailsForUserApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.getContactDetailsForUser(this.response.request.body , resHandle);
    };

    module.exports.getContactDetailsForUserApi = function(rin , callback){
        var dApi = new getContactDetailsForUserApi(rin , callback);
        dApi.requestApi();
    };
})();