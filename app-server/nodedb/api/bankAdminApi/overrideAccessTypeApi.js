/**
 * Created by a1622 on 5/10/16.
 */
(function(){

    var userMethod = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var overrideAccessTypeApi = function overrideAccessTypeApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    overrideAccessTypeApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.overrideAccessType(this.body , resHandle);
    };

    module.exports.overrideAccessTypeApi = function(rin , callback){
        var dApi = new overrideAccessTypeApi(rin , callback);
        dApi.requestApi();
    };
})();