(function(){

    var accessTypeMethod = require('../../apiMethods/accessTypeMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var accessTypeListApi = function accessTypeListApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    accessTypeListApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var accessType = accessTypeMethod(this.response.config , this.tnxId);
        accessType.listAllTypes(this.response.request.body , resHandle);
    };

    module.exports.accessTypeListApi = function(rin , callback){
        var dApi = new accessTypeListApi(rin , callback);
        dApi.requestApi();
    };
})();