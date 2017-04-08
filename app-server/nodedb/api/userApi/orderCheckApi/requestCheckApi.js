(function(){

    var orderCheckMethod = require('../../../apiMethods/orderCheckMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var requestCheckApi = function requestCheckApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.config = this.response.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    requestCheckApi.prototype.requestApi = function(){
        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var order = orderCheckMethod(this.response.config , this.tnxId);

        var provider = (this.body.provider!=undefined)?this.body.provider.toUpperCase():"";

        if(provider=="HARLAND"){
            var url = this.body.interfaceURL+"?"+this.body.urlData;
            order.getHarlandUrl(url, resHandle);
        }
        else if(provider=="OMNI"){
            order.addRequestCheck(this.response.request.body , resHandle);
        }

    };

    module.exports.requestCheckApi = function(rin , callback){
        var dApi = new requestCheckApi(rin , callback);
        dApi.requestApi();
    };
})();