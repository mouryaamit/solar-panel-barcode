(function(){

    var statementDownloadApi = require('../coreApi/getStatementApi');

    var errorResponse = require('../../gen/errorResponse');

    function GetStatement(downloadData , config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = config.instId;
        this.downloadData = downloadData;
    }

    GetStatement.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            var resHandle = this.processCoreResponse.bind(this);
            statementDownloadApi.StatementDownload(this.downloadData , resHandle , this.config , this.tnxId);
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
                this.callback(null , response);
            }
        }
    };

    module.exports.GetStatement = function(downloadData , config , tnxId){
        return (new GetStatement(downloadData , config , tnxId));
    };
})();
