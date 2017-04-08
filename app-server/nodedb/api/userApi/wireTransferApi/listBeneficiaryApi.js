(function(){

    var beneficiaryMethod = require('../../../apiMethods/beneficiaryMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var listBeneficiaryApi = function listBeneficiaryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listBeneficiaryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var beneficiary = beneficiaryMethod(this.response.config , this.tnxId);
        beneficiary.listBeneficiary(this.response.request.body , resHandle);
    };

    module.exports.listBeneficiaryApi = function(rin , callback){
        var dApi = new listBeneficiaryApi(rin , callback);
        dApi.requestApi();
    };
})();