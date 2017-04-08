(function(){

    var genPass = require('password.js');
    genPass.charsLowerCase = 'abcdefghjkmnpqrstuvwxyz';
    genPass.charsUpperCase = 'ABCDEFGHJKMNPQRSTUVWXYZ';

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var accountInquiry = require('../server/coreMethods/accountInquiryCore');

    var customerInquiry = require('../server/coreMethods/customerInquiryCore');

    var customerMethod = require('../apiMethods/customerMethods');

    var limitProfileMethod = require('../apiMethods/limitProfileMethods');

    var bankPolicyMethod = require('../supportMethods/bankPolicyMethods');

    var userMethod = require('./userMethods');

    var customerEnrollCore = require('../server/coreMethods/customerEnrollmentCore');

    var user;

    var limitProfile;

    var mailer = require('../lib/emailGenerator/emailMethods');

    var alertWS = require('../server/WsAlerts/vsoftAlertWs');

    var generateId = require('time-uuid/time');

    function CustomerOnboarding(config , tnxId){
        var utils = require('../lib/utils/utils');
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        user = userMethod(this.config , this.tnxId)
        limitProfile = limitProfileMethod(this.config , this.tnxId)
        //this.model = mongoModelName.modelName.ThirdPartyBeneficiary;
    }

    CustomerOnboarding.prototype = {
        createPassword: function(bankPolicy){
            var PassLen = '6';var special = '0';var nums = '1';var uppers = '1';var lowers = '1';
            if(bankPolicy.passwordRestrictions){
                PassLen = bankPolicy.passwordRestrictions.minimumLength > PassLen ? bankPolicy.passwordRestrictions.minimumLength : PassLen ;special = bankPolicy.passwordRestrictions.minimumSpecialChars;nums = bankPolicy.passwordRestrictions.minimumNumericChars;uppers = bankPolicy.passwordRestrictions.minimumUpperCaseChars;lowers = bankPolicy.passwordRestrictions.minimumLowerCaseChars;
            }

            return genPass.generate(PassLen, { specials: special, nums: nums, uppers: uppers, lowers: lowers});
        },
        createUserName: function(bankPolicy){
            var PassLen = '6';var special = '0';var nums = '0';var uppers = '1';var lowers = '4';
            if(bankPolicy.userIdRestrictions){
                PassLen = bankPolicy.userIdRestrictions.minimumLength > PassLen ? bankPolicy.userIdRestrictions.minimumLength : PassLen ;special = bankPolicy.userIdRestrictions.minimumSpecialChars;nums = bankPolicy.userIdRestrictions.minimumNumericChars;uppers = '1';lowers = bankPolicy.userIdRestrictions.minimumAlphaChars;
            }

            return genPass.generate(PassLen, { specials: special, nums: nums, uppers: uppers, lowers: lowers});
        },
        enrollAndPrintDo:function(reqBody,callback){
            this.reqBody = reqBody;
            this.callback = callback;

            if(this.reqBody.preDefinedLimitProfile){
                this.limitProfile = reqBody.preDefinedLimitProfile;
                this.isLimitProfileOverridden = true;
                this.resHandle = this.enrollAndPrintDone.bind(this);
                var bank = bankPolicyMethod(this.config , this.tnxId);
                var resHandle = this.bankPolicyData.bind(this);
                bank.getBankPolicy({} , resHandle);
            } else if(this.reqBody.customizeLimitProfile){
                var req = {
                    name: this.reqBody.customerId + "-Limits",
                    transferLimitPerTransaction: reqBody.customizeLimitProfile.transferLimitPerTransaction,
                    transferLimitPerDay: reqBody.customizeLimitProfile.transferLimitPerDay,
                    wireTransferLimitPerTransaction: reqBody.customizeLimitProfile.wireTransferLimitPerTransaction,
                    //wireTransferLimitPerDay: reqBody.customizeLimitProfile.wireTransferLimitPerDay,
                    ACHDebitLimitPerTransaction: reqBody.customizeLimitProfile.ACHDebitLimitPerTransaction,
                    //ACHDebitLimitPerDay: reqBody.customizeLimitProfile.ACHDebitLimitPerDay,
                    ACHCreditLimitPerTransaction: reqBody.customizeLimitProfile.ACHCreditLimitPerTransaction,
                    //ACHCreditLimitPerDay: reqBody.customizeLimitProfile.ACHCreditLimitPerDay,
                    user: "System"
                }
                var resHandle = this.tempLimitProfileAdded.bind(this);
                limitProfile.addNewProfile(req,resHandle)
            }else{
                this.limitProfile = null;
                this.isLimitProfileOverridden = false;
                this.resHandle = this.enrollAndPrintDone.bind(this);
                var bank = bankPolicyMethod(this.config , this.tnxId);
                var resHandle = this.bankPolicyData.bind(this);
                bank.getBankPolicy({} , resHandle);
            }
        },
        tempLimitProfileAdded : function(err,result){
            if(err){
                this.callback(err,null)
            } else{
                var id = result.response["_id"]
                this.limitProfile = id;
                this.isLimitProfileOverridden = true;
                this.resHandle = this.enrollAndPrintDone.bind(this);
                var bank = bankPolicyMethod(this.config , this.tnxId);
                var resHandle = this.bankPolicyData.bind(this);
                bank.getBankPolicy({} , resHandle);
            }
        },
        enrollAndMailDo:function(reqBody,callback){
            this.reqBody = reqBody;
            this.callback = callback;

            if(this.reqBody.preDefinedLimitProfile){
                this.limitProfile = reqBody.preDefinedLimitProfile;
                this.isLimitProfileOverridden = true;
                this.resHandle = this.enrollAndMailDone.bind(this);
                var bank = bankPolicyMethod(this.config , this.tnxId);
                var resHandle = this.bankPolicyData.bind(this);
                bank.getBankPolicy({} , resHandle);
            } else if(this.reqBody.customizeLimitProfile){
                var req = {
                    name: this.reqBody.customerId + "-Limits",
                    transferLimitPerTransaction: reqBody.customizeLimitProfile.transferLimitPerTransaction,
                    transferLimitPerDay: reqBody.customizeLimitProfile.transferLimitPerDay,
                    wireTransferLimitPerTransaction: reqBody.customizeLimitProfile.wireTransferLimitPerTransaction,
                    //wireTransferLimitPerDay: reqBody.customizeLimitProfile.wireTransferLimitPerDay,
                    ACHDebitLimitPerTransaction: reqBody.customizeLimitProfile.ACHDebitLimitPerTransaction,
                    //ACHDebitLimitPerDay: reqBody.customizeLimitProfile.ACHDebitLimitPerDay,
                    ACHCreditLimitPerTransaction: reqBody.customizeLimitProfile.ACHCreditLimitPerTransaction,
                    //ACHCreditLimitPerDay: reqBody.customizeLimitProfile.ACHCreditLimitPerDay,
                    user: "System"
                }
                var resHandle = this.tempLimitProfileAddedForMail.bind(this);
                limitProfile.addNewProfile(req,resHandle)
            }else{
                this.limitProfile = null;
                this.isLimitProfileOverridden = false;
                this.resHandle = this.enrollAndMailDone.bind(this);
                var bank = bankPolicyMethod(this.config , this.tnxId);
                var resHandle = this.bankPolicyData.bind(this);
                bank.getBankPolicy({} , resHandle);
            }
        },
        bankPolicyData: function(err , result){
            if(!result) result = {};

            this.bankPolicy = result;
            this.userName = this.createUserName(this.bankPolicy);
            this.password = this.createPassword(this.bankPolicy);

            var reqBody = {
                customerId                          : this.reqBody.customerId,
                customerName                        : this.reqBody.fullName,
                userName                            : this.userName,
                emailId                             : this.reqBody.emailAddress,
                password                            : this.password,
                status                              : "Not Enrolled",
                mobileNo                            : this.reqBody.mobileNo,
                customerType                        : this.reqBody.customerType,
                accessType                          : this.reqBody.accessType,
                bankPolicy                          : this.bankPolicy,
                createdBy                           : this.reqBody.adminId,
                originator                          : "Branch",
                isTemporaryPassword                 : true,
                firstLogin                          : true,
                changePasswordOnNextLogin           : true,
                passwordChangedOn                   : new Date(),
                limitProfile                        : this.limitProfile || null,
                isLimitProfileOverridden            : this.isLimitProfileOverridden || false
            };

            user.directEnroll(reqBody , this.resHandle);
        },
        enrollAndMailDone : function(err,result){
            if(!result){
                if(err){
                    this.callback(err, null);
                } else {
                    var error = this.errorResponse.OperationFailed;
                    this.callback(error, null);
                }
            } else {
                this.callback(null, result);

                var validateResponse = function(error , response){};

                var mailGenerator = mailer(this.config , this.tnxId);
                var msg = mailGenerator.getEmailMsg({userName:this.userName,customerName:this.reqBody.fullName}, 'customerOnboardingUserMail');

                var vfxRequestId = generateId();
                var requestId = generateId();
                var requestObj = {
                    config : this.config,
                    requestId: requestId,
                    vfxRequestId: vfxRequestId,
                    requestBody: {
                        "REQUEST_NAME": "AlertRq",
                        "INSTANCE": {
                            "alertType": 'OTHER',
                            "bankId": this.config.instId,
                            "customerId":this.reqBody.customerId,
                            "emailInd":true,
                            "smsInd":false,//TODO
                            "emailAddress":this.reqBody.emailAddress,
                            "phoneNo": this.reqBody.mobileNo, //WHAT MSG SHOULD GO TO MOBILE
                            "subject": "Login Details : User Name",
                            "message": msg,
                            "userId":result.userId,
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };

                var ws = alertWS(requestObj , validateResponse);
                ws.requestVsoftAlertServer();

                mailGenerator = mailer(this.config , this.tnxId);
                msg = mailGenerator.getEmailMsg({password:this.password,customerName:this.reqBody.fullName}, 'customerOnboardingPasswordMail');

                vfxRequestId = generateId();
                requestId = generateId();
                requestObj = {
                    config : this.config,
                    requestId: requestId,
                    vfxRequestId: vfxRequestId,
                    requestBody: {
                        "REQUEST_NAME": "AlertRq",
                        "INSTANCE": {
                            "alertType": 'OTHER',
                            "bankId": this.config.instId,
                            "customerId":this.reqBody.customerId,
                            "emailInd":true,
                            "smsInd":false,
                            "emailAddress":this.reqBody.emailAddress,
                            "subject": "Login Details : Password",
                            "message": msg,
                            "userId":result.userId,
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };

                ws = alertWS(requestObj , validateResponse);
                ws.requestVsoftAlertServer();
            }
        },
        enrollAndPrintDone : function(err,result){
            if(!result){
                if(err){
                    this.callback(err, null);
                } else {
                    var error = this.errorResponse.OperationFailed;
                    this.callback(error, null);
                }
            } else {
                this.result = result;

                var routed = {
                    listedUserId : this.result.userId
                }

                var resHandle = this.printPasswordTemplateNext.bind(this);
                user.printPasswordTemplate(routed,resHandle);
            }
        },
        tempLimitProfileAddedForMail : function(err,result){
            if(err){
                this.callback(err,null)
            } else{
                this.limitProfile = result.response["_id"];
                this.isLimitProfileOverridden = true;
                this.resHandle = this.enrollAndMailDone.bind(this);
                var bank = bankPolicyMethod(this.config , this.tnxId);
                var resHandle = this.bankPolicyData.bind(this);
                bank.getBankPolicy({} , resHandle);
            }
        },
        printPasswordTemplateNext : function(err,result) {
            this.result.PasswordTemplate = result;

            var routed = {
                listedUserId : this.result.userId
            }

            var resHandle = this.printUserIdTemplateNext.bind(this);
            user.printUserIdTemplate(routed,resHandle);
        },
        printUserIdTemplateNext : function(err,result) {
            this.result.UserIdTemplate = result;
            this.callback(null, this.result);
        },
        desiredEnrollDo : function(reqBody,callback){
            this.reqBody = reqBody;
            this.callback = callback;

            if(this.reqBody.preDefinedLimitProfile){
                this.limitProfile = this.reqBody.preDefinedLimitProfile;
                this.isLimitProfileOverridden = true;
               /* this.resHandle = this.enrollAndMailDone.bind(this);
                var bank = bankPolicyMethod(this.config , this.tnxId);
                var resHandle = this.bankPolicyData.bind(this);
                bank.getBankPolicy({} , resHandle);*/
                var reqBody = {
                    customerId                          : this.reqBody.customerId,
                    customerName                        : this.reqBody.fullName,
                    userName                            : this.reqBody.userName,
                    emailId                             : this.reqBody.emailAddress,
                    password                            : this.reqBody.password,
                    status                              : "Verified",
                    mobileNo                            : this.reqBody.mobileNo,
                    customerType                        : this.reqBody.customerType,
                    accessType                          : this.reqBody.accessType,
                    //bankPolicy                          : this.bankPolicy,
                    createdBy                           : this.reqBody.adminId,
                    originator                          : "Branch",
                    firstLogin                          : false,
                    isTemporaryPassword                 : false,
                    changePasswordOnNextLogin           : false,
                    passwordChangedOn                   : new Date(),
                    limitProfile                        : this.limitProfile || null,
                    isLimitProfileOverridden            : this.isLimitProfileOverridden || false
                };

                var resHandle = this.desiredEnrollDone.bind(this);
                user.directEnroll(reqBody , resHandle);

            } else if(this.reqBody.customizeLimitProfile){
                var req = {
                    name: this.reqBody.customerId + "-Limits",
                    transferLimitPerTransaction: reqBody.customizeLimitProfile.transferLimitPerTransaction,
                    transferLimitPerDay: reqBody.customizeLimitProfile.transferLimitPerDay,
                    wireTransferLimitPerTransaction: reqBody.customizeLimitProfile.wireTransferLimitPerTransaction,
                    //wireTransferLimitPerDay: reqBody.customizeLimitProfile.wireTransferLimitPerDay,
                    ACHDebitLimitPerTransaction: reqBody.customizeLimitProfile.ACHDebitLimitPerTransaction,
                    //ACHDebitLimitPerDay: reqBody.customizeLimitProfile.ACHDebitLimitPerDay,
                    ACHCreditLimitPerTransaction: reqBody.customizeLimitProfile.ACHCreditLimitPerTransaction,
                    //ACHCreditLimitPerDay: reqBody.customizeLimitProfile.ACHCreditLimitPerDay,
                    user: "System"
                }
                var resHandle = this.tempLimitProfileAddedForDesiredEnroll.bind(this);
                limitProfile.addNewProfile(req,resHandle)
            } else {
                this.limitProfile = null;
                this.isLimitProfileOverridden = false;
               /* this.resHandle = this.enrollAndMailDone.bind(this);
                var bank = bankPolicyMethod(this.config , this.tnxId);
                var resHandle = this.bankPolicyData.bind(this);
                bank.getBankPolicy({} , resHandle);*/

                var reqBody = {
                    customerId                          : this.reqBody.customerId,
                    customerName                        : this.reqBody.fullName,
                    userName                            : this.reqBody.userName,
                    emailId                             : this.reqBody.emailAddress,
                    password                            : this.reqBody.password,
                    status                              : "Verified",
                    mobileNo                            : this.reqBody.mobileNo,
                    customerType                        : this.reqBody.customerType,
                    accessType                          : this.reqBody.accessType,
                    //bankPolicy                          : this.bankPolicy,
                    createdBy                           : this.reqBody.adminId,
                    originator                          : "Branch",
                    firstLogin                          : false,
                    isTemporaryPassword                 : false,
                    changePasswordOnNextLogin           : false,
                    passwordChangedOn                   : new Date(),
                    limitProfile                        : this.limitProfile || null,
                    isLimitProfileOverridden            : this.isLimitProfileOverridden || false
                };

                var resHandle = this.desiredEnrollDone.bind(this);
                user.directEnroll(reqBody , resHandle);
            }
        },
        tempLimitProfileAddedForDesiredEnroll : function(err,result){
            if(err){
                this.callback(err,null)
            } else{
                this.limitProfile = result.response["_id"];
                this.isLimitProfileOverridden = true;
                /*this.resHandle = this.enrollAndMailDone.bind(this);
                var bank = bankPolicyMethod(this.config , this.tnxId);
                var resHandle = this.bankPolicyData.bind(this);
                bank.getBankPolicy({} , resHandle);*/
                var reqBody = {
                    customerId                          : this.reqBody.customerId,
                    customerName                        : this.reqBody.fullName,
                    userName                            : this.reqBody.userName,
                    emailId                             : this.reqBody.emailAddress,
                    password                            : this.reqBody.password,
                    status                              : "Verified",
                    mobileNo                            : this.reqBody.mobileNo,
                    customerType                        : this.reqBody.customerType,
                    accessType                          : this.reqBody.accessType,
                    //bankPolicy                          : this.bankPolicy,
                    createdBy                           : this.reqBody.adminId,
                    originator                          : "Branch",
                    firstLogin                          : false,
                    isTemporaryPassword                 : false,
                    changePasswordOnNextLogin           : false,
                    passwordChangedOn                   : new Date(),
                    limitProfile                        : this.limitProfile || null,
                    isLimitProfileOverridden            : this.isLimitProfileOverridden || false
                };

                var resHandle = this.desiredEnrollDone.bind(this);
                user.directEnroll(reqBody , resHandle);
            }
        },

        desiredEnrollDone : function(err,result){
            if(!result){
                if(err){
                    this.callback(err, null);
                } else {
                    var error = this.errorResponse.OperationFailed;
                    this.callback(error, null);
                }
            } else {
                this.callback(null,result);
            }

        }
    };

    module.exports = function(config , tnxId){
        return (new CustomerOnboarding(config , tnxId));
    };
})();