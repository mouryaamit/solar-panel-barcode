(function(){

    var setupAlertApi = require('../AlertApis/setupAlertApi');

    var errorResponse = require('../../gen/errorResponse');

    function SetupAlert(alertData , config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = this.config.instId;
        this.alertData = alertData;
    }

    SetupAlert.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            this.alertData.bankId = this.bankId;
            var routed = {
                institutionId: this.config.instId,
                userId: this.alertData.userId
            };

            var userMethods = require('../../apiMethods/userMethods');
            var resHandle = this.coreCallerDo.bind(this);
            var user = userMethods(this.config, this.tnxId);
            user.defaultMethod(routed, resHandle);
        },
        coreCallerDo: function(err,result){
            this.alertData.createdBy = result.createdBy;
            this.alertData.originator = result.originator;
            this.alertData.userId = result.userId;
            this.alertData.emailId = result.emailId;
            this.alertData.phoneNo = result.contact.phoneNo;

            var resHandle = this.processCoreResponse.bind(this);
            setupAlertApi.AddAlert(this.alertData , resHandle , this.config , this.tnxId);
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

    module.exports.SetupAlert = function(alertData , config , tnxId){
        return (new SetupAlert(alertData , config , tnxId));
    };
})();
