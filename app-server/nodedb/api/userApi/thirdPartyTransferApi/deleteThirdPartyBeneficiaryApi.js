(function(){

    var thirdpartybeneficiaryMethod = require('../../../apiMethods/thirdPartyBeneficiaryMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var deleteThirdPartyBeneficiaryApi = function deleteThirdPartyBeneficiaryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deleteThirdPartyBeneficiaryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var thirdpartybeneficiary = thirdpartybeneficiaryMethod(this.response.config , this.tnxId);
        thirdpartybeneficiary.deleteThirdPartyBeneficiary(this.response.request.body , resHandle);
    };

    module.exports.deleteThirdPartyBeneficiaryApi = function(rin , callback){
        var dApi = new deleteThirdPartyBeneficiaryApi(rin , callback);
        dApi.requestApi();
    };
})();