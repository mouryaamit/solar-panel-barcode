(function(){

    function TransactionLimit(config , tnxId){
        var utils = require('../lib/utils/utils');
        var errorResponse = require('../gen/errorResponse');
        var mongoModelName = require('../lib/mongoQuery/mongoModelObj');
        var dated = new Date();
        this.dated = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.TransactionLimit;
    }

    TransactionLimit.prototype = {
        addDailyTransaction: function(reqBody){

            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                transactionType         : reqBody.transactionType,
                transactionAmount       : parseInt(reqBody.transactionAmount),
                transactionDated        : this.dated
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.Save();
        },
        addDailyTransactionUpdate: function(reqBody){

            this.trasaction = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                transactionType         : reqBody.transactionType,
                transactionAmount       : parseInt(reqBody.transactionAmount),
                transactionDated        : this.dated
            };

            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId,
                transactionType         : reqBody.transactionType,
                transactionDated        : this.dated
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.updateTransaction.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        updateTransaction: function(err , result){
            if(!result){
                var mongo = this.utils.initMongo(this.model ,this.trasaction , this.tnxId);
                mongo.Save();
            }else{
                result.transactionAmount = result.transactionAmount + this.trasaction.transactionAmount;
                result.save();
            }
        },
        transactionPerDay: function(reqBody , callback){
            this.callback = callback;

            this.transctionObj = {
                institutionId       : this.config.instId,
                userId              : reqBody.userId,
                transactionAmount   : parseInt(reqBody.transactionAmount),
                transactionType     : reqBody.transactionType
            };
            var routed = {
                institutionId           : this.config.instId,
                userId                  : reqBody.userId
            };

            var userMethods = require('./userMethods');
            var user = userMethods(this.config , this.tnxId);
            var resHandle = this.transactionCheck.bind(this);
            user.defaultMethod(routed , resHandle);
        },
        transactionCheck: function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            }else{

                this.limitsFound = false;
                var resHandle = this.transactionProcess.bind(this);
                if(this.transctionObj.transactionType == "ACHDebit") {
                    this.limitsFound = result.limitsAvailable.achCreditPerDayLimit;
                    this.transctionObj.transactionLimitPerDay = parseInt(result.privilege.limits.achLimits.achDebitLimitPerDay);
                } else if(this.transctionObj.transactionType == "ACHCredit") {
                    this.limitsFound = result.limitsAvailable.achDebitPerDayLimit;
                    this.transctionObj.transactionLimitPerDay = parseInt(result.privilege.limits.achLimits.achCreditLimitPerDay);
                } else if(this.transctionObj.transactionType == "Wire") {
                    this.limitsFound = result.limitsAvailable.wirePerDayLimit;
                    resHandle = this.transactionFundsProcess.bind(this);
                    this.transctionObj.transactionLimitPerDay = parseInt(result.privilege.limits.wireLimits.wireLimitPerDay);
                }else if(this.transctionObj.transactionType == "Funds"){
                    this.limitsFound = result.limitsAvailable.fundsPerDayLimit;
                    resHandle = this.transactionFundsProcess.bind(this);
                    this.transctionObj.transactionLimitPerDay = parseInt(result.privilege.limits.fundsLimits.fundsLimitPerDay);
                }

                var routed = {
                    institutionId       : this.transctionObj.institutionId,
                    userId              : this.transctionObj.userId,
                    transactionType     : this.transctionObj.transactionType,
                    transactionDated    : this.dated
                };

                if(!this.limitsFound){
                    this.callback(null, true);
                }else{
                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    mongo.FindOneMethod(resHandle);
                }
            }
        },
        transactionProcess: function(err , result){
            var error = this.errorResponse.TransactionLimitFailed;
            if(!result){
                if(this.transctionObj.transactionAmount <= this.transctionObj.transactionLimitPerDay){
                    var handle = this.addDailyTransaction.bind(this);
                    handle(this.transctionObj);
                    this.callback(null, true);
                }else{
                    this.callback(error, null);
                }
            }else{
                result.transactionAmount = result.transactionAmount + this.transctionObj.transactionAmount;
                if(result.transactionAmount <= this.transctionObj.transactionLimitPerDay){
                    result.save();
                    this.callback(null , result);
                }else{
                    this.callback(error, null);
                }
            }
        },
        transactionFundsProcess: function(err , result){
            var error = this.errorResponse.TransactionLimitFailed;
            if(!result){
                if(this.transctionObj.transactionAmount <= this.transctionObj.transactionLimitPerDay){
                    this.callback(null, true);
                }else{
                    this.callback(error, null);
                }
            }else{
                result.transactionAmount = result.transactionAmount + this.transctionObj.transactionAmount;
                if(result.transactionAmount <= this.transctionObj.transactionLimitPerDay){
                    this.callback(null , result);
                }else{
                    this.callback(error, null);
                }
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new TransactionLimit(config , tnxId));
    };
})();