(function(){

    var institutionDateApi = require('./institutionDateCore');

    var customerEnrollApi = require('../coreApi/customerEnrollApi');

    var errorResponse = require('../../gen/errorResponse');

    var moment = require('moment');

    function CustomerEnroll(config , tnxId){
        this.tnxId = tnxId;
        this.bankId = config.instId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
    }

    CustomerEnroll.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            var institute = institutionDateApi.InstituteDate(this.config , this.tnxId);
            var resHandle = this.processInstituteDate.bind(this);
            institute.coreCaller(resHandle);
        },
        processInstituteDate: function(error , result){
            if(error){
                this.callback(error , null);
            }else{

                var enrollDate = moment().format("MM/DD/YYYY");
                //result.nextProcessingDate.date
                var customerObj = {
                    bankId              : this.bankId,
                    dated               : enrollDate,
                };

                var resHandle = this.processCoreResponse.bind(this);
                customerEnrollApi.CustomerEnrollment(customerObj , resHandle , this.config , this.tnxId);
            }
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

    module.exports.CustomerEnroll = function(config , tnxId){
        return (new CustomerEnroll(config , tnxId));
    };
})();
