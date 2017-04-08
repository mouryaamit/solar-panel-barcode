(function(){

    var wireMethod = require('../../../apiMethods/wireTransferMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var authorizeWireTransferApi = function authorizeWireTransferApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    authorizeWireTransferApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var wirerTransfer = wireMethod(this.response.config , this.tnxId);
        wirerTransfer.processWireTransfer(this.response.request.body , resHandle);
    };

    module.exports.authorizeWireTransferApi = function(rin , callback){
        var dApi = new authorizeWireTransferApi(rin , callback);
        dApi.requestApi();
    };
})();