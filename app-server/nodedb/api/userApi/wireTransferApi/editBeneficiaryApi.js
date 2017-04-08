(function(){

    var beneficiaryMethod = require('../../../apiMethods/beneficiaryMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var editBeneficiaryApi = function editBeneficiaryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    editBeneficiaryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var beneficiary = beneficiaryMethod(this.response.config , this.tnxId);
        beneficiary.editBeneficiary(this.response.request.body , resHandle);
    };

    module.exports.editBeneficiaryApi = function(rin , callback){
        var dApi = new editBeneficiaryApi(rin , callback);
        dApi.requestApi();
    };
})();