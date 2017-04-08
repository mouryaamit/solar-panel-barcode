(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');

    var achMethod = require('../../apiMethods/routingNumberMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var findRoutingNumberApi = function findRoutingNumberApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    findRoutingNumberApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var routingNumber = achMethod(this.response.config , this.tnxId);
        routingNumber.retrieveRoutingNumber(this.body  , resHandle);
    };

    module.exports.findRoutingNumberApi = function(rin , callback){

        var dApi = new findRoutingNumberApi(rin , callback);
        dApi.requestApi();
    };
})();