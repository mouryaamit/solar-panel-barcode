(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var userMethods = require('../../apiMethods/userMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var changeSQApi = function changeSQApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    changeSQApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.changeSecurityQuestion(this.response.request.body , resHandle);
    };

    module.exports.changeSQApi = function(rin , callback){
        var dApi = new changeSQApi(rin , callback);
        dApi.requestApi();
    };
})();