(function(){

    var moment = require('moment');

    var instituteDateApi = require('../coreApi/institutionDateApi');

    var errorResponse = require('../../gen/errorResponse');

    function InstituteDate(config , tnxId){
        var dated = new Date();
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = config.instId;
        this.dated = moment(dated).format('MM/DD/YYYY');
    }

    InstituteDate.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            this.instData = {
                bankId              : this.bankId,
                currentDate         : this.dated
            };

            var resHandle = this.processCoreResponse.bind(this);
            instituteDateApi.InstitutionDate(this.instData , resHandle , this.config , this.tnxId);
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

    module.exports.InstituteDate = function(config , tnxId){
        return (new InstituteDate(config , tnxId));
    };
})();
