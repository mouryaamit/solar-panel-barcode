(function () {

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var utils = require('../lib/utils/utils');

    function BankConfig(config, tnxId) {
        this.tnxId = tnxId;
        this.config = config;
        this.utils = utils.util();
        this.model = mongoModelName.modelName.BankConfig;
    }

    BankConfig.prototype = {
        getBankConfig: function (callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.getBankConfigReturn.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        getBankConfigReturn: function (err, result) {
            if (!result) {
                this.callback(err, null)
            } else {
                this.callback(null, result)
            }
        }
    };

    module.exports = function (config, tnxId) {
        return (new BankConfig(config, tnxId));
    };
})();