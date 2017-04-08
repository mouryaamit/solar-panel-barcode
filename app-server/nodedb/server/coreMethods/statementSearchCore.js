(function(){

    var statementSearchApi = require('../coreApi/statementSearchApi');

    var errorResponse = require('../../gen/errorResponse');

    function StatementSearch(searchData , config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankId = config.instId;
        this.searchData = searchData;
    }

    StatementSearch.prototype = {
        coreCaller : function(callback){
            this.callback = callback;

            this.searchData.institutionId = this.bankId;
            this.searchData.bankId = this.bankId;

            var resHandle = this.processCoreResponse.bind(this);
            statementSearchApi.StatementDownload(this.searchData , resHandle , this.config , this.tnxId);
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
                if(response.INSTANCE.statements.length > 0) {
                    this.callback(null, {
                        message: 'Returned the list of statement',
                        response: response.INSTANCE,
                        nextStep: this.config.nextStepTo.goToStatement
                    });
                } else {
                    var errResponse = this.errorResponse["StatementsNotAvailable"];
                    this.callback(errResponse , null);
                }
            }
        }
    };

    module.exports.StatementSearch = function(searchData , config , tnxId){
        return (new StatementSearch(searchData , config , tnxId));
    };
})();
