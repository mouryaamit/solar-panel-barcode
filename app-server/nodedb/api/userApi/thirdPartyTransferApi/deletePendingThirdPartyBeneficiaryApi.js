(function(){

    var thirdpartybeneficiaryMethod = require('../../../apiMethods/thirdPartyBeneficiaryMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var deletePendingThirdPartyBeneficiaryApi = function deletePendingThirdPartyBeneficiaryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deletePendingThirdPartyBeneficiaryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var thirdpartybeneficiary = thirdpartybeneficiaryMethod(this.response.config , this.tnxId);
        thirdpartybeneficiary.deleteThirdPartyBeneficiaryCallback(this.response.request.body , resHandle);
    };

    module.exports.deletePendingThirdPartyBeneficiaryApi = function(rin , callback){
        var dApi = new deletePendingThirdPartyBeneficiaryApi(rin , callback);
        dApi.requestApi();
    };
})();