(function(){

    var bankConfig = require('../apiMethods/bankConfigMethods');

    var clientInitApi = function clientInitApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    clientInitApi.prototype = {
        requestApi: function () {
            this.response.status = 200;
            var bankDetails = bankConfig(this.response.config, this.tnxId);
            var resHandle = this.getBankConfigReturn.bind(this);
            bankDetails.getBankConfig(resHandle);
            this.response.body = {
                captcha: this.response.config.captcha.client,
                restrictedCharSet: this.response.config.systemConfiguration.restrictedCharSet
            };
        },
        getBankConfigReturn: function (err, result) {
            this.response.body.siteCustomisedOn  = result.siteCustomisedOn;
            this.callback(null, this.response);
        }
    };

    module.exports.clientInitApi = function(rin , callback){

        var dApi = new clientInitApi(rin , callback);
        dApi.requestApi();
    };
})();