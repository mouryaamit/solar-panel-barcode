(function(){

    var _ = require('underscore');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var mongoModelObj = require('../lib/mongoQuery/mongoModelObj');

    var bankPolicyMethod = require('../supportMethods/bankPolicyMethods');

    function PasswordHistory(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelObj.modelName.PasswordHistory;
    }

    PasswordHistory.prototype = {
        isPasswordInHistory: function(userId , password , callback){

            this.callback = callback;
            this.password = password;

            this.routed = {
                institutionId           : this.config.instId,
                userId                  : userId
            };

            var bankPolicy = bankPolicyMethod(this.config , this.tnxId);
            var resHandle = this.isCheckLastPasswordTrue.bind(this);
            bankPolicy.getBankPolicy(null , resHandle);
        },
        isCheckLastPasswordTrue: function(err , result){
            if(!result){
                this.callback(true, null);
            }else{
                if(result.checkLastPassword){
                    var resHandle = this.passwordHistoryInfo.bind(this);
                    var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
                    mongo.FindOneMethod(resHandle);
                }else{
                    this.callback(true , null);
                }
            }
        },
        passwordHistoryInfo: function(err , result){
            if(result){
                var foundPassword = _.findWhere(result.passwordRec, {password: this.password});
                if(!foundPassword){
                    this.callback(true , null);
                }else{
                    this.callback(null , result);
                }
            }else{
                this.callback(true, null);
            }
        },
        addPasswordHistory : function(userId , password){

            this.userId = userId;
            this.password = password;

            this.routed = {
                institutionId           : this.config.instId,
                userId                  : userId
            };

            var bankPolicy = bankPolicyMethod(this.config , this.tnxId);
            var resHandle = this.policyListed.bind(this);
            bankPolicy.getBankPolicy(null , resHandle);
        },
        policyListed: function(err , result){
            if(!result){
               console.error('No policy Found');
            }else{
                this.policyData = result;
                var resHandle = this.passwordHistoryDb.bind(this);
                var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
                mongo.FindOneMethod(resHandle);
            }
        },
        passwordHistoryDb : function(err , result){
            if (!result){
                var passwordHistoryData = {
                    institutionId           : this.config.instId,
                    userId                  : this.userId,
                    passwordRec: [{
                        changedAt           : new Date(),
                        password            : this.password
                    }]
                };

                var mongo = this.utils.initMongo(this.model ,passwordHistoryData , this.tnxId);
                mongo.Save();
            }else{
                var pushToArray = {
                    changedAt           : new Date(),
                    password            : this.password
                };
                var arrayPH = result.passwordRec;
                var arrayPHLen = arrayPH.length;

                if(this.policyData.checkLastPassword && this.policyData.checkLastPasswordInfo.numberOfPasswordCheck != ""){

                    this.totalSize = parseInt(this.policyData.checkLastPasswordInfo.numberOfPasswordCheck);
                    if(arrayPHLen >= this.totalSize){
                        var from = Math.abs((arrayPHLen) - this.totalSize);
                        result.passwordRec = result.passwordRec.slice(from , arrayPHLen);
                        result.passwordRec.shift();
                    }
                    result.passwordRec.push(pushToArray);
                    result.save();
                }
            }
        },
        defaultAllMethod: function(routed , callback){
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindOneMethod(callback);
        }
    };

    module.exports = function(config , tnxId){
        return (new PasswordHistory(config , tnxId));
    };
})();