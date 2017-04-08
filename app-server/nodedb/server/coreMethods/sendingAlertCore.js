(function(){

    var sendingAlertApi = require('../AlertApis/sendingAlertApi');

    var errorResponse = require('../../gen/errorResponse');

    function SendAlert(alertData , config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.alertData = alertData;
    }

    SendAlert.prototype = {
        coreCaller : function(){
            var resHandle = this.processCoreResponse.bind(this);
            sendingAlertApi.SendingAlert(this.alertData , resHandle , this.config , this.tnxId);
        },
        processCoreResponse: function(error , response){
            if(error){
                //var errResponse = this.errorResponse[error];
                //this.callback(error , null);
                var errResponse = this.errorResponse["ZZ"];
                var errorCodeMsg = this.errorResponse[error.status.statusCode];
                errResponse.responseData.message = (!error.status.statusDescription || error.status.statusDescription == "")?errorCodeMsg.responseData.message:error.status.statusDescription;
                console.log(errResponse);
            }else{
                console.log(response);
            }
        }
    };

    module.exports.SendAlert = function(alertData , config , tnxId){
        return (new SendAlert(alertData , config , tnxId));
    };
})();
