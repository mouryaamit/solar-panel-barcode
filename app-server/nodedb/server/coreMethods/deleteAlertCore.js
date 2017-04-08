(function(){

    var deleteAlertApi = require('../AlertApis/deleteAlertApi');

    var errorResponse = require('../../gen/errorResponse');

    function DeleteAlert(alertData , config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = "1";
        this.alertData = alertData;
    }

    DeleteAlert.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            this.alertData.bankId = this.bankId;

            var resHandle = this.processCoreResponse.bind(this);
            deleteAlertApi.DeleteAlert(this.alertData , resHandle , this.config , this.tnxId);
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

    module.exports.DeleteAlert = function(alertData , config , tnxId){
        return (new DeleteAlert(alertData , config , tnxId));
    };
})();
