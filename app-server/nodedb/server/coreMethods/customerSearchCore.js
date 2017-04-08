(function(){

    var customerSearchApi = require('../coreApi/customerSearchApi');

    //var coreErrorResponse = require('../../gen/coreResponseTemplate');

    var errorResponse = require('../../gen/errorResponse');

    function CustomerSearch(rBody , config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.rBody = rBody;
    }

    CustomerSearch.prototype = {
        coreCaller : function(callback){
            this.callback = callback;
            var resHandle = this.processCoreResponse.bind(this);
            customerSearchApi.CustomerSearch(this.rBody , resHandle , this.config , this.tnxId);
        },
        processCoreResponse: function(error , response){
            if(error){
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                this.callback(errResponse , null);
            }else{
                this.callback(null , response.INSTANCE);
            }
        }
    };

    module.exports.CustomerSearch = function(rBody , config , tnxId){
        return (new CustomerSearch(rBody , config , tnxId));
    };
})();
