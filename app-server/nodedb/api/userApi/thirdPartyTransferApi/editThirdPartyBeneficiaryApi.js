(function(){

    var thirdpartybeneficiaryMethod = require('../../../apiMethods/thirdPartyBeneficiaryMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var editThirdPartyBeneficiaryApi = function editThirdPartyBeneficiaryApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    editThirdPartyBeneficiaryApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var thirdpartybeneficiary = thirdpartybeneficiaryMethod(this.response.config , this.tnxId);
        thirdpartybeneficiary.checkDetailsForEdit(this.response.request.body , resHandle);
    };

    module.exports.editThirdPartyBeneficiaryApi = function(rin , callback){
        var dApi = new editThirdPartyBeneficiaryApi(rin , callback);
        dApi.requestApi();
    };
})();