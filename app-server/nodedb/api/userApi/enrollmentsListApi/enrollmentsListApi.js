(function(){

    var userMethods = require('../../../apiMethods/userMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var enrollmentListApi = function enrollmentListApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    enrollmentListApi.prototype.requestApi = function(){
        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = userMethods(this.response.config , this.tnxId);
        user.enrollmentList(this.response.request.body , resHandle);
    };

    module.exports.enrollmentListApi = function(rin , callback){
        var dApi = new enrollmentListApi(rin , callback);
        dApi.requestApi();
    };
})();
