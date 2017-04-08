(function(){

    var wireMethod = require('../../../apiMethods/wireTransferMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var addWireTransferApi = function addWireTransferApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    addWireTransferApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var wirerTransfer = wireMethod(this.response.config , this.tnxId);
        wirerTransfer.addWireTransfer(this.response.request.body , resHandle);
    };

    module.exports.addWireTransferApi = function(rin , callback){
        var dApi = new addWireTransferApi(rin , callback);
        dApi.requestApi();
    };
})();