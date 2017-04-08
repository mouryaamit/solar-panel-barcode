(function(){

    var beneficiaryMethod = require('../../../apiMethods/beneficiaryMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var deleteBeneficiaryApi = function deleteBeneficiaryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deleteBeneficiaryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var beneficiary = beneficiaryMethod(this.response.config , this.tnxId);
        beneficiary.deleteBeneficiary(this.response.request.body , resHandle);
    };

    module.exports.deleteBeneficiaryApi = function(rin , callback){
        var dApi = new deleteBeneficiaryApi(rin , callback);
        dApi.requestApi();
    };
})();