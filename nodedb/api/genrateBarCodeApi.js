/**
 * Created by amitmourya on 08/03/17.
 */
(function(){

    var barcodeMethod = require('../apiMethods/barcodeMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var api = function api(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    api.prototype.requestApi = function(){
        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var user = barcodeMethod(this.response.config , this.tnxId);
        user.genrateBarcode(this.response.request.body ,this.response.request.params, this.response.request.query, resHandle);
    };

    module.exports.api = function(rin , callback){

        var dApi = new api(rin , callback);
        dApi.requestApi();
    };
})();