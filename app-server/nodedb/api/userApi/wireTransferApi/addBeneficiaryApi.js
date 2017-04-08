(function(){

    var beneficiaryMethod = require('../../../apiMethods/beneficiaryMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var addBeneficiaryApi = function addBeneficiaryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    addBeneficiaryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var beneficiary = beneficiaryMethod(this.response.config , this.tnxId);
        beneficiary.addBeneficiary(this.response.request.body , resHandle);
    };

    module.exports.addBeneficiaryApi = function(rin , callback){
        var dApi = new addBeneficiaryApi(rin , callback);
        dApi.requestApi();
    };
})();