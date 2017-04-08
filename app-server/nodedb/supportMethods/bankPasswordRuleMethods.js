(function(){

    var utils = require('../lib/utils/utils');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var paperwork = require('../lib/utils/paperwork');

    var schema = require('../gen/coreResponseSchema');

    var errorResponse = require('../gen/errorResponse');

    function BankPasswordRule(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.BankPasswordRule
    }

    BankPasswordRule.prototype = {
        addBankPasswordRule: function(reqBody , callback){
            this.callback = callback;
            var restrictPasswordKeywords = false;
            if(reqBody.passwordKeywords && reqBody.passwordKeywords.length > 0) restrictPasswordKeywords = true;
            if(reqBody.passwordExpirationInfo && paperwork.accepted(schema.passwordExpirationInfo , reqBody.passwordExpirationInfo)) passwordExpiration = true;

            var routed = {
                institutionId                           : this.config.instId,
                minimumNumericChars                     : reqBody.minimumNumericChars,
                minimumUpperCaseChars                   : reqBody.minimumUpperCaseChars,
                minimumLowerCaseChars                   : reqBody.minimumLowerCaseChars,
                minimumSpecialChars                     : reqBody.minimumSpecialChars,
                minimumLength                           : reqBody.minimumLength,
                failedLoginAttempts                     :reqBody.failedLoginAttempts,
                checkLastPassword                       : reqBody.checkLastPassword,
                passwordExpirationInfo                  : reqBody.passwordExpirationInfo,
                restrictUserIdInPassword                : reqBody.restrictUserIdInPassword,
                restrictNameInPassword                  : reqBody.restrictNameInPassword,
                restrictPasswordKeywords                : restrictPasswordKeywords,
                passwordKeywords                        : reqBody.passwordKeywords
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.passwordRulesAdded.bind(this);
            mongo.Save(resHandle);
        },
        passwordRulesAdded: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: 'Bank Policy has been added'});
            }
        },
        changeBankPasswordRule: function(reqBody , callback){
            this.callback = callback;
            var restrictPasswordKeywords = false;
            if(reqBody.passwordKeywords && reqBody.passwordKeywords.length > 0) restrictPasswordKeywords = true;
            if(reqBody.passwordExpirationInfo && paperwork.accepted(schema.passwordExpirationInfo , reqBody.passwordExpirationInfo)) passwordExpiration = true;

            this.routed = {
                minimumNumericChars                     : reqBody.minimumNumericChars,
                minimumUpperCaseChars                   : reqBody.minimumUpperCaseChars,
                minimumLowerCaseChars                   : reqBody.minimumLowerCaseChars,
                minimumSpecialChars                     : reqBody.minimumSpecialChars,
                minimumLength                           : reqBody.minimumLength,
                failedLoginAttempts                     : reqBody.failedLoginAttempts,
                checkLastPassword                       : reqBody.checkLastPassword,
                passwordExpirationInfo                  : reqBody.passwordExpirationInfo,
                restrictUserIdInPassword                : reqBody.restrictUserIdInPassword,
                restrictNameInPassword                  : reqBody.restrictNameInPassword,
                restrictPasswordKeywords                : restrictPasswordKeywords,
                isUserNameCaseSensitive                 : reqBody.isUserNameCaseSensitive,
                passwordKeywords                        : reqBody.passwordKeywords
            };

            var getPasswordData = this.getBankPasswordRule.bind(this);
            var resHandle = this.updatePasswordRuleData.bind(this);
            getPasswordData(null , resHandle);
        },
        updatePasswordRuleData: function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                result.minimumNumericChars = this.routed.minimumNumericChars;
                result.minimumUpperCaseChars = this.routed.minimumUpperCaseChars;
                result.minimumLowerCaseChars = this.routed.minimumLowerCaseChars;
                result.minimumSpecialChars = this.routed.minimumSpecialChars;
                result.minimumLength = this.routed.minimumLength;
                result.failedLoginAttempts = this.routed.failedLoginAttempts;
                result.checkLastPassword = this.routed.checkLastPassword;
                result.passwordExpirationInfo = this.routed.passwordExpirationInfo;
                result.restrictNameInPassword = this.routed.restrictNameInPassword;
                result.restrictUserIdInPassword = this.routed.restrictUserIdInPassword;
                result.restrictPasswordKeywords = this.routed.restrictPasswordKeywords;
                result.passwordKeywords = this.routed.passwordKeywords;
                result.isUserNameCaseSensitive = this.routed.isUserNameCaseSensitive;

                result.save();
                this.callback(null , {message: 'Bank Policy has been updated'});
            }
        },
        getCurrentBankPasswordRule: function(reqBody , callback){
            this.callback = callback;
            var getPasswordData = this.getBankPasswordRule.bind(this);
            var resHandle = this.returnBankPasswordRule.bind(this);
            getPasswordData(null , resHandle);
        },
        returnBankPasswordRule: function(err , result){
            if(!result){
                this.callback(null , {});
            }else{
                this.callback(null , result);
            }
        },
        getBankPasswordRule: function(reqBody , callback){

            var routed = {
                institutionId                  : this.config.instId,
                passwordRule                   : 'bankPasswordRule'
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindOneMethod(callback);
        }
    };

    module.exports = function(config , tnxId){
        return (new BankPasswordRule(config , tnxId));
    };
})();