(function(){

    var achMaintenanceApi = require('../coreApi/achMaintenanceApi');

    var errorResponse = require('../../gen/errorResponse');

    function AchMaintenanceInst(instructionData ,instructionInfo ,config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = config.instId;
        //this.customerId = instructionInfo.customerId;
        this.isSearch = instructionInfo.isSearch;
        this.instructionData = instructionData;
        this.requesType = instructionInfo.requestType;
    }

    AchMaintenanceInst.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            var instructionObj = {};
            instructionObj.bankId = this.bankId;
            //instructionObj.customerId = this.customerId;
            instructionObj.isSearch = this.isSearch;
            instructionObj.deletedInstructions = null;
            instructionObj.modifiedInstructions = null;

            if(this.requesType == "Delete") instructionObj.deletedInstructions = this.instructionData;
            if(this.requesType == "Edit") instructionObj.modifiedInstructions = this.instructionData;
            if(this.isSearch){
                instructionObj.instructionId = this.instructionData.instructionId || null;
                instructionObj.batchId = this.instructionData.batchId || null;
            }

            var resHandle = this.processCoreResponse.bind(this);
            achMaintenanceApi.MaintenanceAchInst(instructionObj , resHandle , this.config  , this.tnxId);
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
                this.callback(null, response.INSTANCE);
            }
        }
    };

    module.exports.AchMaintenanceInst = function(instructionData ,instructionInfo ,config ,tnxId){
        return (new AchMaintenanceInst(instructionData ,instructionInfo ,config ,tnxId));
    };
})();