/**
 * Created by amourya on 5/2/16.
 */
(function(){

    var eodExtractDownloadMethod = require('../apiMethods/eodExtractDownloadMethod');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var eodExtractDownloadApi = function eodExtractDownloadApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    eodExtractDownloadApi.prototype.requestApi = function(){
        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var eodExtractDownload = eodExtractDownloadMethod(this.response.config , resHandle , this.tnxId);
        eodExtractDownload.download(this.response.request.body,this.response.doDownload);
    };

    module.exports.eodExtractDownloadApi = function(rin , callback){
        var dApi = new eodExtractDownloadApi(rin , callback);
        dApi.requestApi();
    };
})();