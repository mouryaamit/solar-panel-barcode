(function(){

    var bondCalculatorApi = require('../coreApi/bondCalculatorApi');

    var errorResponse = require('../../gen/errorResponse');

    function BondCalculator(bondData , config , tnxId){
        this.tnxId = tnxId;
        this.bankId = config.instId;
        this.bondData = bondData;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
    }

    BondCalculator.prototype = {
        coreCaller : function(callback){
            this.callback = callback;
            var bondObj = {
                bankId                      : this.bankId,
                series                      : this.bondData.series,
                issueDate                   : this.bondData.issueDate,
                denomination                : this.bondData.denomination
            };

            var resHandle = this.processCoreResponse.bind(this);
            bondCalculatorApi.BondCalculatorInq(bondObj , resHandle , this.config , this.tnxId);
        },
        processCoreResponse: function(error , response){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                this.callback(errResponse , null);
            }else{
                this.callback(null , response.INSTANCE);
            }
        }
    };

    module.exports.BondCalculator = function(bondData , config , tnxId){
        return (new BondCalculator(bondData , config , tnxId));
    };
})();
