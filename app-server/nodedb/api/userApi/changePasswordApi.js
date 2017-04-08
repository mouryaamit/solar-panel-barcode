(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeUPApi = function changeUPApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeUPApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.changeUserPassword(this.response.request.body , resHandle);
    };

    module.exports.changeUPApi = function(rin , callback){
        var dApi = new changeUPApi(rin , callback);
        dApi.requestApi();
    };
})();