(function(){

    var inValidLoginMethod = require('../../apiMethods/inValidLoginMethods');

    var responseMethod = require('../../apiMethods/responseHandleMethods');

    var inValidLoginApi = function inValidLoginApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    inValidLoginApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var inValidLogin = inValidLoginMethod(this.response.config , this.tnxId);
        inValidLogin.listInValidLogin(this.response.request.body , resHandle);
    };

    module.exports.inValidLoginApi = function(rin , callback){
        var dApi = new inValidLoginApi(rin , callback);
        dApi.requestApi();
    };
})();