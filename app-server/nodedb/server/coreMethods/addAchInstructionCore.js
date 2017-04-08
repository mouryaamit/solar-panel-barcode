(function(){

    var addAchInstructionApi = require('../coreApi/addAchInstructionApi');

    var errorResponse = require('../../gen/errorResponse');

    function AddAchInst(instructionData ,customerId ,config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = config.instId;
        this.customerId = customerId;
        this.instructionData = {
            instructions: instructionData
        };
    }

    AddAchInst.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            this.instructionData.bankId = this.bankId;
            this.instructionData.customerId = this.customerId;

            var resHandle = this.processCoreResponse.bind(this);
            addAchInstructionApi.AddAchInstruction(this.instructionData , resHandle , this.config  , this.tnxId);
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

    module.exports.AddAchInstruction = function(instructionData ,customerId ,config ,tnxId){
        return (new AddAchInst(instructionData ,customerId ,config ,tnxId));
    };
})();