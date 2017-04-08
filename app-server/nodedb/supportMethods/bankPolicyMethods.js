(function(){

    var utils = require('../lib/utils/utils');

    var paperwork = require('../lib/utils/paperwork');

    var schema = require('../gen/coreResponseSchema');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var errorResponse = require('../gen/errorResponse');

    function BankPolicy(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.BankPolicyRestriction;
    }

    BankPolicy.prototype = {
        addBankPolicy: function(reqBody , callback){
            this.callback = callback;
            var passwordExpiration = true;
            var checkLastPassword = true;
            var restrictPasswordKeywords = true;

            //if(reqBody.passwordExpirationInfo && paperwork.accepted(schema.passwordExpirationInfo , reqBody.passwordExpirationInfo)) passwordExpiration = true;
            //if(reqBody.checkLastPasswordInfo && paperwork.accepted(schema.checkLastPasswordInfo , reqBody.checkLastPasswordInfo)) checkLastPassword = true;
            //if(reqBody.passwordKeywords && reqBody.passwordKeywords.length > 0) restrictPasswordKeywords = true;

            var routed = {
                institutionId                           : this.config.instId,
                userIdRestrictions                      : reqBody.userIdRestrictions,
                passwordRestrictions                    : reqBody.passwordRestrictions,
                passwordExpiration                      : passwordExpiration,
                passwordExpirationInfo                  : reqBody.passwordExpirationInfo,
                checkLastPassword                       : checkLastPassword,
                failedLoginAttempts                     :reqBody.failedLoginAttempts,
                checkLastPasswordInfo                   : reqBody.checkLastPasswordInfo,
                restrictNameInPassword                  : reqBody.restrictNameInPassword,
                restrictUserIdInPassword                : reqBody.restrictUserIdInPassword,
                restrictPasswordKeywords                : restrictPasswordKeywords,
                passwordKeywords                        : reqBody.passwordKeywords,
                authRestrictions                        : reqBody.authRestrictions
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.bankPolicyAdded.bind(this);
            mongo.Save(resHandle);
        },
        bankPolicyAdded: function(err , result){
            if(err){
                var error = this.errorResponse.BankPolicySaveFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: 'Bank Policy has been added'});
            }
        },
        changeBankPolicy: function(reqBody , callback){
            this.callback = callback;
            var passwordExpiration = true;
            var checkLastPassword = true;
            var restrictPasswordKeywords = true;

            //if(reqBody.passwordExpirationInfo && paperwork.accepted(schema.passwordExpirationInfo , reqBody.passwordExpirationInfo)) passwordExpiration = true;
            //if(reqBody.checkLastPasswordInfo && paperwork.accepted(schema.checkLastPasswordInfo , reqBody.checkLastPasswordInfo)) checkLastPassword = true;
            //if(reqBody.passwordKeywords && reqBody.passwordKeywords.length > 0) restrictPasswordKeywords = true;

            this.routed = {
                userIdRestrictions              : reqBody.userIdRestrictions,
                passwordRestrictions            : reqBody.passwordRestrictions,
                passwordExpiration              : passwordExpiration,
                passwordExpirationInfo          : reqBody.passwordExpirationInfo,
                checkLastPassword               : checkLastPassword,
                failedLoginAttempts                     : reqBody.failedLoginAttempts,
                checkLastPasswordInfo           : reqBody.checkLastPasswordInfo,
                restrictNameInPassword          : reqBody.restrictNameInPassword,
                restrictUserIdInPassword        : reqBody.restrictUserIdInPassword,
                restrictPasswordKeywords        : restrictPasswordKeywords,
                passwordKeywords                : reqBody.passwordKeywords,
                authRestrictions                : reqBody.authRestrictions
            };

            var getPolicyData = this.getBankPolicy.bind(this);
            var resHandle = this.updatePolicyData.bind(this);
            getPolicyData(null , resHandle);
        },
        updatePolicyData: function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                result.userIdRestrictions = this.routed.userIdRestrictions;
                result.passwordRestrictions = this.routed.passwordRestrictions;
                result.passwordExpiration = this.routed.passwordExpiration;
                result.passwordExpirationInfo = this.routed.passwordExpirationInfo;
                result.checkLastPassword = this.routed.checkLastPassword;
                result.failedLoginAttempts = this.routed.failedLoginAttempts;
                result.checkLastPasswordInfo = this.routed.checkLastPasswordInfo;
                result.restrictNameInPassword = this.routed.restrictNameInPassword;
                result.restrictUserIdInPassword = this.routed.restrictUserIdInPassword;
                result.restrictPasswordKeywords = this.routed.restrictPasswordKeywords;
                result.passwordKeywords = this.routed.passwordKeywords;
                result.authRestrictions = this.routed.authRestrictions;

                result.save();
                this.callback(null , {message: 'Bank Policy has been updated'});
            }
        },
        getBankPolicy: function(reqBody , callback){
            //this.callback = callback;

            var routed = {
                institutionId                   : this.config.instId,
                bankPolicy                      : 'bankPolicy'
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindOneMethod(callback);
        }
    };

    module.exports = function(config , tnxId){
        return (new BankPolicy(config , tnxId));
    };
})();