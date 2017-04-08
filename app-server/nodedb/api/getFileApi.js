/**
 * Created by amourya on 5/10/16.
 */
(function(){

    var userMethod = require('../apiMethods/userMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var getFileApi = function getFileApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    getFileApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethod(this.response.config , this.tnxId);
        user.getFile(this.response.request.params, this.callback);
    };

    module.exports.getFileApi = function(rin , callback){
        var dApi = new getFileApi(rin , callback);
        dApi.requestApi();
    };
})();