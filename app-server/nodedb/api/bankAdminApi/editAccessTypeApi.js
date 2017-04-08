(function(){

    var accessTypeMethod = require('../../apiMethods/accessTypeMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var editAccessTypeApi = function editAccessTypeApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    editAccessTypeApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var accessType = accessTypeMethod(this.response.config , this.tnxId);
        accessType.editAccessType(this.response.request.body , resHandle);
    };

    module.exports.editAccessTypeApi = function(rin , callback){
        var dApi = new editAccessTypeApi(rin , callback);
        dApi.requestApi();
    };
})();