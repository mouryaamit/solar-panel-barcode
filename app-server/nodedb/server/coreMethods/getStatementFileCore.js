(function(){

    var statementFileApi = require('../coreApi/statementFileApi');

    var errorResponse = require('../../gen/errorResponse');

    function StatementFile(searchData , config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = config.instId;
        this.searchData = searchData;
    }

    StatementFile.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            this.searchData.institutionId = this.bankId;
            this.searchData.bankId = this.bankId;

            var resHandle = this.processCoreResponse.bind(this);
            statementFileApi.StatementDownload(this.searchData , resHandle , this.config , this.tnxId);
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
                this.callback(null, {
                    response: response.INSTANCE
                });
            }
        }
    };

    module.exports.StatementFile = function(searchData , config , tnxId){
        return (new StatementFile(searchData , config , tnxId));
    };
})();
