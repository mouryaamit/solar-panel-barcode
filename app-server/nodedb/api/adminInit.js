(function () {

    var bankConfig = require('../apiMethods/bankConfigMethods');

    var adminInitApi = function adminInitApi(rin, callback) {
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    adminInitApi.prototype = {
        requestApi: function () {
            this.response.status = 200;
            var bankDetails = bankConfig(this.response.config, this.tnxId);
            var resHandle = this.getBankConfigReturn.bind(this);
            bankDetails.getBankConfig(resHandle);
            this.response.body = {
                captcha: this.response.config.captcha.admin,
                restrictedCharSet: this.response.config.systemConfiguration.restrictedCharSet
            };
        },
        getBankConfigReturn: function (err, result) {
            this.response.body.siteCustomisedOn  = result.siteCustomisedOn;
            this.callback(null, this.response);
        }
    };

    module.exports.adminInitApi = function (rin, callback) {

        var dApi = new adminInitApi(rin, callback);
        dApi.requestApi();
    };
})();