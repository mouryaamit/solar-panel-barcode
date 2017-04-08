(function(){

    var thirdpartybeneficiaryMethod = require('../../../apiMethods/thirdPartyBeneficiaryMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var listThirdPartyBeneficiaryApi = function listThirdPartyBeneficiaryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listThirdPartyBeneficiaryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var thirdpartybeneficiary = thirdpartybeneficiaryMethod(this.response.config , this.tnxId);
        thirdpartybeneficiary.listThirdPartyBeneficiary(this.response.request.body , resHandle);
    };

    module.exports.listThirdPartyBeneficiaryApi = function(rin , callback){
        var dApi = new listThirdPartyBeneficiaryApi(rin , callback);
        dApi.requestApi();
    };
})();