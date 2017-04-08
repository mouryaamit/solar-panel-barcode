(function(){

    var thirdpartybeneficiaryMethod = require('../../../apiMethods/thirdPartyBeneficiaryMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var addThirdPartyBeneficiaryApi = function addThirdPartyBeneficiaryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    addThirdPartyBeneficiaryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var thirdpartybeneficiary = thirdpartybeneficiaryMethod(this.response.config , this.tnxId);
        thirdpartybeneficiary.checkDetailsForAdd(this.response.request.body , resHandle);
    };

    module.exports.addThirdPartyBeneficiaryApi = function(rin , callback){
        var dApi = new addThirdPartyBeneficiaryApi(rin , callback);
        dApi.requestApi();
    };
})();