(function () {

    var _ = require('underscore');

    var moment = require('moment');

    var genPass = require('password.js');
    genPass.charsLowerCase = 'abcdefghjkmnpqrstuvwxyz';
    genPass.charsUpperCase = 'ABCDEFGHJKMNPQRSTUVWXYZ';

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var utils = require('../lib/utils/utils');

    var session = require('../gen/sessionMethods');

    var policyMethod = require('../supportMethods/policyRestrictionMethods');

    var bankPolicyMethod = require('../supportMethods/bankPolicyMethods');

    var accessTypeMethod = require('./accessTypeMethods');

    var lockUserMethod = require('./lockUserMethods');

    var customerInquiry = require('../server/coreMethods/customerInquiryCore');

    var customerMethod = require('../apiMethods/customerMethods');

    var invalidLoginMethod = require('./inValidLoginMethods');

    var lastPasswordMethod = require('./lastPasswordMethods');

    var bankMailMethod = require('./bankMailMethods');

    var alertMethod = require('../apiMethods/alertMethods');

    var messenger = require('../lib/emailGenerator/messenger');

    var mailWordingMethod = require('./mailWordingMethods');

    var otpConfigHandler = require('./otpConfigurationMethods');

    var otpMethod = require('./otpMethods');

    var generateId = require('time-uuid/time');

    var alertWS = require('../server/WsAlerts/vsoftAlertWs');

    var mailer = require('../lib/emailGenerator/emailMethods');

    var schema = require('../gen/coreResponseSchema');

    var validate = require('../gen/coreResponseValidate');

    var bankConfigMethod = require('./bankConfigMethods');

    var downloader = require('./fileDownloadMethods');

    var aesCrypto = require('aes-cross');

    var transferInstructionModel = require('../lib/models/dbModel').TransferInstruction;


    var fs = require('fs');

    var path = require('path');

    function User(config, tnxId) {
        var dated = new Date();
        this.dated = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2, 2);
        this.tnxId = tnxId;
        this.config = config;
        this.sendPasswordMail = false;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.model = mongoModelName.modelName.User;
        this.sessionReport = mongoModelName.modelName.SessionReport;
        this.statementsEnrollmentModel = mongoModelName.modelName.StatementsEnrollment;
        this.menuhelpmappermodel = mongoModelName.modelName.MenuHelpMapper;
        this.initmodel = mongoModelName.modelName.BankPolicyRestriction;
        this.limitprofilemodel = mongoModelName.modelName.LimitProfile;
        this.accesstypemodel = mongoModelName.modelName.AccessType;
        this.accessTypeModel = mongoModelName.modelName.AccessType;
        this.holidayCalenderModel = mongoModelName.modelName.HolidayCalender;
        this.beneficiaryModel = mongoModelName.modelName.Beneficiary;
        this.thirdPartyBeneficiaryModel = mongoModelName.modelName.ThirdPartyBeneficiary;
        this.transferInstructionModel = mongoModelName.modelName.TransferInstruction;
        this.fundsTransferStatusLog = mongoModelName.modelName.FundsTransferStatusLog;
        this.fundsTransferLogsAckModel = mongoModelName.modelName.FundsTransferLogsAck;
        this.utils = utils.util();
        this.bankConfig = bankConfigMethod(config, tnxId);
    }

    User.prototype = {
        encryptString: function (password, key) {
            var encrypted = aesCrypto.encText(password, key);
            return encrypted.toString();
        },
        decryptString: function (encpassword, key) {
            if (encpassword) {
                var decrypted = aesCrypto.decText(encpassword, key);
                return decrypted.toString();
            } else {
                return ""
            }
        },
        getEncryptKey: function (err, result) {
            this.finalResult = result;
            this.bankConfig.getBankConfig(this.resHandle);
        },
        getEncryptKeyForCreateUser: function (err, result) {
            if (err || !result) {
                console.error('<<<<< Customer Addition Failed >>>>>');
                console.error(err);
                console.error('<<<<< Customer Addition Failed >>>>>');
                var error = this.errorResponse.UserCreationFailed;
                this.callback(error, null);
            } else {
                this.finalResult = result;
                this.bankConfig.getBankConfig(this.resHandle);
            }
        },
        directEnroll: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;
            this.accessType = reqBody.accessType;
            var userId = this.utils.getToken();

            this.customerAccounts = reqBody.customerAccounts;
            this.routed = {
                institutionId: this.config.instId,
                userId: userId,
                customerId: reqBody.customerId,
                customerName: reqBody.customerName,
                userName: reqBody.userName,
                status: reqBody.status,
                emailId: reqBody.emailId,
                contact: {
                    mobileNo: reqBody.mobileNo,
                    phoneNo: reqBody.mobileNo
                },
                customerType: reqBody.customerType,
                accessType: this.accessType,
                privilege: {
                    userViews: {},
                    access: {
                        accountsAccess: [],
                        accountsTransferAccess: []
                    },
                    limits: {}
                },
                defaultScreen: 'Overview',
                firstLogin: reqBody.firstLogin,
                isSupervisor: false,
                securityQuestion: [],
                createdBy: reqBody.createdBy,
                originator: reqBody.originator,
                changePasswordOnNextLogin: reqBody.changePasswordOnNextLogin,
                isTemporaryPassword: reqBody.isTemporaryPassword || true,
                passwordChangedOn: reqBody.passwordChangedOn,
                limitProfile: reqBody.limitProfile || null,
                isLimitProfileOverridden: reqBody.isLimitProfileOverridden || false,
            };
            var routed = {
                customerId: {
                    $regex: '^' + reqBody.customerId + '$',
                    $options: "i"
                }
            }
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.findUserBeforeEnroll.bind(this);
            mongo.Count(resHandle);
        },
        findUserBeforeEnroll: function (err, result) {
            if (result > 0) {
                var error = this.errorResponse.CustomerAlreadyRegistered;
                this.callback(error, null);
            } else {
                var routed = {
                    userName: {
                        $regex: '^' + this.routed.userName + '$',
                        $options: "i"
                    }
                }
                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var resHandle = this.findUserNameBeforeEnroll.bind(this);
                mongo.Count(resHandle);
            }
        },
        findUserNameBeforeEnroll: function (err, result) {
            if (result > 0) {
                var error = this.errorResponse.UserExistsFailed;
                this.callback(error, null);
            } else {
                var accessTypeHandle = this.completeUserAdd.bind(this);
                var getAccessType = this.getAccessTypePrivilege.bind(this);
                getAccessType(this.accessType, accessTypeHandle);
            }
        },
        addUser: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;

            this.accessType = reqBody.accessType;
            var userId = this.utils.getToken();

            this.routed = {
                institutionId: this.config.instId,
                userId: userId,
                customerId: reqBody.customerId,
                customerName: reqBody.customerName,
                emailId: reqBody.emailId,
                userName: reqBody.userName,
                password: "",
                tempPassword: reqBody.password,
                contact: {
                    mobileNo: reqBody.mobileNo,
                    phoneNo: reqBody.mobileNo
                },
                customerType: reqBody.customerType,
                accessType: this.accessType,
                privilege: {
                    userViews: {},
                    access: {
                        accountsAccess: [],
                        accountsTransferAccess: []
                    },
                    limits: {}
                },
                defaultScreen: 'Overview',
                isSupervisor: false,
                isTemporaryPassword: reqBody.isTemporaryPassword || true,
                securityQuestion: []
            };

            this.userName = reqBody.userName;
            this.password = reqBody.password;
            this.customerName = reqBody.customerName;

            var policy = policyMethod(this.config, this.tnxId);
            var resHandle = this.bankPolicyCheck.bind(this);
            this.checkHandle = this.userDataValidation.bind(this);
            policy.checkUserId(reqBody.userName, resHandle);
        },
        userDataValidation: function (err, success) {
            this.resHandle = this.userDataValidationNext.bind(this);
            this.getEncryptKey(err, success);
        },
        userDataValidationNext: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            if (!this.finalResult) {
                var error = this.errorResponse.PasswordComplianceFailed;
                this.callback(error, null);
            } else {
                this.routed.password = this.encryptString(this.routed.password, this.encryptionKey);
                this.routed.changePasswordOnNextLogin = true;
                this.routed.passwordChangedOn = (new Date());
                var inquiry = customerInquiry.CustomerInquiry(this.routed, this.config, this.tnxId);
                var resHandle = this.addCoreAccounts.bind(this);
                inquiry.directCoreCaller(resHandle);
            }
        },
        addCoreAccounts: function (err, result) {
            if (!result) {
                this.callback(err, null);
            } else {
                if (this.routed.emailId == undefined) {
                    this.routed.emailId = result.emailAddress;
                }
                this.customerAccounts = result.customerAccounts;
                var accessTypeHandle = this.completeUserAdd.bind(this);
                var getAccessType = this.getAccessTypePrivilege.bind(this);
                getAccessType(this.accessType, accessTypeHandle);
            }
        },
        completeUserAdd: function (err, success) {
            if (!success) {
                var error = this.errorResponse.UserCreationFailed;
                this.callback(error, null);
            } else {
                this.routed.privilege.userViews = success.privilege.userViews;
                this.isSupervisor = success.privilege.userViews.AdministrativeToolsUserManagement.CreateNewUsers;
                this.routed.privilege.access.accountsAccess = this.customerAccounts;
                this.routed.privilege.access.accountsTransferAccess = this.customerAccounts;
                this.resHandle = this.completeUserAddNext.bind(this);
                this.getEncryptKey(err, success);
            }
        },
        completeUserAddNext: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            this.routed.tempPassword = this.encryptString(this.reqBody.password, this.encryptionKey)
            var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
            this.resHandle = this.userAdded.bind(this);
            var resHandle = this.getEncryptKeyForCreateUser.bind(this);
            mongo.Save(resHandle);
        },
        addUserBySupervisor: function (reqBody, callback) {
            this.callback = callback;

            var userId = this.utils.getToken();

            var privilege = {userViews: {}, access: {accountsAccess: [], accountsTransferAccess: []}, limits: {}};

            privilege.userViews = reqBody.userViewAccess;
            privilege.access.accountsAccess = reqBody.userAccountAccess;
            privilege.access.accountsTransferAccess = reqBody.userTransferAccess;
            privilege.access.accountsWireAccess = reqBody.userWireAccess;
            privilege.access.accountsACHAccess = reqBody.userACHAccess;
            privilege.access.accountsEStatementsAccess = reqBody.userEStatementsAccess;
            privilege.limits = reqBody.userLimits;

            this.routed = {
                institutionId: this.config.instId,
                userId: userId,
                customerId: reqBody.customerId,
                customerName: reqBody.customerName,
                userName: reqBody.userName,
                emailId: reqBody.emailId,
                password: '',
                tempPassword: '',
                isTemporaryPassword: true,
                contact: {
                    mobileNo: reqBody.mobileNo,
                    phoneNo: reqBody.mobileNo
                },
                customerType: reqBody.customerType,
                limitsAvailable: this.checkValidLimits(reqBody.userLimits),
                privilege: privilege,
                defaultScreen: 'Overview',
                isSupervisor: privilege.userViews.AdministrativeToolsUserManagement.CreateNewUsers,
                securityQuestion: [],
                createdBy: reqBody.userId,
                originator: "Supervisor",
                firstLogin: true
            };

            var bank = bankPolicyMethod(this.config, this.tnxId);
            this.resHandle = this.addBankPasswordInfo.bind(this);
            var resHandle = this.getEncryptKey.bind(this);
            bank.getBankPolicy(reqBody, resHandle);
        },
        updateUserBySupervisor: function (reqBody, callback) {
            this.mainCallback = callback;
            this.requestBody = reqBody;
            var req = {
                institutionId: this.config.instId,
                userId: this.requestBody.listedUserId,
                customerId: this.requestBody.customerId
            }
            var resHandle = this.getUserDetails.bind(this);
            this.defaultMethod(req,resHandle)
        },
        getUserDetails: function (err,result) {
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.mainCallback(error, null);
            } else {
                var userAccountsForExclusion = [];
                var accountsTransferAccess = [];
                var userTransferAccess = [];
                for(var j = 0 ; j < result.privilege.access.accountsTransferAccess.length ; j++) {
                    accountsTransferAccess.push(result.privilege.access.accountsTransferAccess[j].accountNo)
                }
                for(var j = 0 ; j < this.requestBody.userTransferAccess.length ; j++) {
                    userTransferAccess.push(this.requestBody.userTransferAccess[j].accountNo)
                }
                for(var j = 0 ; j < accountsTransferAccess.length ; j++){
                    if(userTransferAccess.indexOf(accountsTransferAccess[j]) < 0){
                        userAccountsForExclusion.push({accountNo:accountsTransferAccess[j]})
                    }
                }
                if(userAccountsForExclusion.length > 0) {
                    var req = {
                        userId: this.requestBody.listedUserId,
                        customerId: this.requestBody.customerId,
                        isRequestForSubUser: true,
                        checkTransactions: this.requestBody.checkTransactions,
                        targetUserId: this.requestBody.listedUserId,
                        userAccountExclusion: userAccountsForExclusion,
                        targetCustomerId: this.requestBody.customerId,
                        userIdForSubUser: this.requestBody.listedUserId

                    }
                    var resHandle = this.updateUserBySupervisorCheckTransaction.bind(this);
                    this.accountExclusionForCustomer(req, resHandle)
                } else {
                    this.updateUserBySupervisorCheckTransaction(null,true)
                }
            }
        },
        updateUserBySupervisorCheckTransaction : function (err,result) {
            if(!result){
                this.mainCallback(err,null);
            } else {
                if(result.hasOwnProperty("result")) {
                    this.mainCallback(null,result)
                } else {
                    var privilege = {
                        userViews: {},
                        access: {
                            accountsAccess: [],
                            accountsTransferAccess: [],
                            accountsWireAccess: [],
                            accountsACHAccess: [],
                            accountsEStatementsAccess: []
                        },
                        limits: {}
                    };

                    privilege.userViews = this.requestBody.userViewAccess;
                    privilege.access.accountsAccess = this.requestBody.userAccountAccess;
                    privilege.access.accountsTransferAccess = this.requestBody.userTransferAccess;
                    privilege.access.accountsWireAccess = this.requestBody.userWireAccess;
                    privilege.access.accountsACHAccess = this.requestBody.userACHAccess;
                    privilege.access.accountsEStatementsAccess = this.requestBody.userEStatementsAccess;
                    privilege.limits = this.requestBody.userLimits;
                    this.routed = {
                        limitsAvailable: this.checkValidLimits(this.requestBody.userLimits),
                        privilege: privilege
                    };
                    var routed = {
                        institutionId: this.config.instId,
                        userId: this.requestBody.listedUserId,
                        customerId: this.requestBody.customerId
                    };
                    var resHandle = this.updateUserBySupervisorNext.bind(this);
                    this.defaultMethod(routed, resHandle)
                }
            }
        },
        updateUserBySupervisorNext : function(err, result){
            if(!result){
                var error = this.errorResponse.NoCustomersFound
                this.mainCallback(error,null)
            } else {
                result.limitsAvailable = this.routed.limitsAvailable;
                result.privilege = this.routed.privilege
                var resHandle = this.updateUserBySupervisorDone.bind(this);
                result.save(resHandle);
            }
        },
        updateUserBySupervisorDone : function(err, result) {
            if (!result) {
                var error = this.errorResponse.genericMessage
                this.mainCallback(error,null)
            } else {
                this.mainCallback(null,{message : this.successResponse.ChangeProfile})
            }
        },
        addBankPasswordInfo: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            if (!this.finalResult) this.finalResult = {};

            this.sendPasswordMail = true;
            var pwd = this.createPassword(this.finalResult);
            var decryptedPassword = this.encryptString(pwd, this.encryptionKey);
            this.routed.tempPassword = decryptedPassword;
            this.routed.changePasswordOnNextLogin = true;
            this.routed.passwordChangedOn = (new Date());
            var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
            this.resHandle = this.userAdded.bind(this);
            var resHandle = this.getEncryptKeyForCreateUser.bind(this);
            mongo.Save(resHandle);
        },
        checkValidLimits: function (limits) {
            var limitsAvailable = {
                fundsPerDayLimit: false,
                fundsPerTrancLimit: false,
                achCreditPerDayLimit: false,
                achCreditPerTrancLimit: false,
                achDebitPerDayLimit: false,
                achDebitPerTrancLimit: false,
                wirePerDayLimit: false,
                wirePerTrancLimit: false
            };

            // if((limits.fundsLimits.fundsLimitPerDay).length > 0)
                limitsAvailable.fundsPerDayLimit = true;
            // if ((limits.fundsLimits.fundsLimitPerTranc).length > 0)
                limitsAvailable.fundsPerTrancLimit = true;
            //if((limits.achLimits.achCreditLimitPerDay).length > 0)
            // limitsAvailable.achCreditPerDayLimit = true;
            // if ((limits.achLimits.achCreditLimitPerTranc).length > 0)
                limitsAvailable.achCreditPerTrancLimit = true;
            //if((limits.achLimits.achDebitLimitPerDay).length > 0)
            // limitsAvailable.achDebitPerDayLimit = true;
            // if ((limits.achLimits.achDebitLimitPerTranc).length > 0)
                limitsAvailable.achDebitPerTrancLimit = true;
            //if((limits.wireLimits.wireLimitPerDay).length > 0)
            // limitsAvailable.wirePerDayLimit = true;
            // if ((limits.wireLimits.wireLimitPerTranc).length > 0)
                limitsAvailable.wirePerTrancLimit = true;

            return limitsAvailable;
        },
        userAdded: function (err, result) {
            var encryptedPassword;
            this.encryptionKey = result.encryptionKey.toString('base64');
            var ws;
            if (err || !result) {
                console.error('<<<<< Customer Addition Failed >>>>>');
                console.error(err);
                console.error('<<<<< Customer Addition Failed >>>>>');
                var error = this.errorResponse.UserCreationFailed;
                this.callback(error, null);
            } else {
                var success = {
                    message: this.successResponse.AddUser,
                    userId: this.routed.userId
                };
                this.callback(null, success);

                if (this.sendPasswordMail) {
                    this.finalResult.password = this.decryptString(this.finalResult.tempPassword, this.encryptionKey);
                    var mailGenerator = mailer(this.config, this.tnxId);
                    var msg = mailGenerator.getEmailMsg(this.finalResult, 'userLoginPassword');

                    var vfxRequestId = generateId();
                    var requestId = generateId();
                    var requestObj = {
                        config: this.config,
                        requestId: requestId,
                        vfxRequestId: vfxRequestId,
                        requestBody: {
                            "REQUEST_NAME": "AlertRq",
                            "INSTANCE": {
                                "alertType": 'OTHER',
                                "bankId": this.config.instId,
                                "customerId": '0',
                                "emailInd": true,
                                "smsInd": false,
                                "emailAddress": this.routed.emailId,
                                "subject": "User Created - User Password",
                                "message": msg,
                                "userId": this.routed.userId,
                                "requestId": requestId,
                                "vfxRequestId": vfxRequestId
                            }
                        }
                    };
                    ws = alertWS(requestObj, validateResponse);

                    ws.requestVsoftAlertServer();

                    msg = mailGenerator.getEmailMsg(this.finalResult, 'userLoginUserId');

                    vfxRequestId = generateId();
                    requestId = generateId();
                    requestObj = {
                        config: this.config,
                        requestId: requestId,
                        vfxRequestId: vfxRequestId,
                        requestBody: {
                            "REQUEST_NAME": "AlertRq",
                            "INSTANCE": {
                                "alertType": 'OTHER',
                                "bankId": this.config.instId,
                                "customerId": '0',
                                "emailInd": true,
                                "smsInd": false,
                                "emailAddress": this.routed.emailId,
                                "subject": "User Created - User Id",
                                "message": msg,
                                "userId": this.routed.userId,
                                "requestId": requestId,
                                "vfxRequestId": vfxRequestId
                            }
                        }
                    };


                    var validateResponse = function (error, response) {
                    };


                    ws = alertWS(requestObj, validateResponse);
                    ws.requestVsoftAlertServer();

                }
            }
        },

        validateLogin: function (req, callback) {
            this.callback = callback;
            this.req = req;
            var reqBody = req.request.body;
            var routed = {
                institutionId: this.config.instId
            };

            var isLoginCaptchaEnabled = this.config.captcha.client.login;
            if (isLoginCaptchaEnabled) {
                var model = mongoModelName.modelName.Captcha;
                this.routed = routed;
                var mongo = this.utils.initMongo(model, {uuid: req.request.body.uuid}, generateId());
                var resHandle = this.checkCaptchaForLogin.bind(this);
                mongo.FindOneMethod(resHandle);
            }
            else {
                var mongo = this.utils.initMongo(this.initmodel, routed, this.tnxId);
                var resHandle = this.doLogin.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        doLogin: function (err, result) {
            var reqBody = this.req.request.body;
            this.password = reqBody.password;
            this['x-factor'] = reqBody['x-factor'];
            this.loginInfo = {
                userType: 'bankUser',
                userId: reqBody.userName,
                validUser: 'No',
                ipAddress: this.config.userCurrentIp,
                'x-factor': this['x-factor']
            };
            var routed = {};
            var isUserNameCaseSensitive = true;
            if (result.authRestrictions == undefined || typeof(result.authRestrictions.isUserNameCaseSensitive) != 'boolean') {
                if (this.config.isUserNameCaseSensitive != undefined) {
                    isUserNameCaseSensitive = this.config.isUserNameCaseSensitive;
                }
            } else if (result.authRestrictions != undefined && typeof(result.authRestrictions.isUserNameCaseSensitive) == 'boolean') {
                isUserNameCaseSensitive = result.authRestrictions.isUserNameCaseSensitive;
            }

            if (isUserNameCaseSensitive) {
                routed.institutionId = this.config.instId;
                routed.userName = reqBody.userName;
            } else {
                routed.institutionId = this.config.instId;
                routed.userName = {
                    $regex: '^' + reqBody.userName + '$',
                    $options: "i"
                }
            }
            this.invalidLogin = invalidLoginMethod(this.config, this.tnxId);

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.checkLockUser.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        checkCaptchaForLogin: function (err, result) {
            if (result) {
                if (result.captcha == this.req.request.body.captcha) {
                    var mongo = this.utils.initMongo(this.initmodel, this.routed, this.tnxId);
                    var resHandle = this.doLogin.bind(this);
                    mongo.FindOneMethod(resHandle);

                    return true;
                }
            }

            var error = this.errorResponse.InvalidCaptcha;
            this.loginInfo = {
                userType: 'bankUser',
                userId: this.req.request.body.userName,
                validUser: 'No',
                ipAddress: this.config.userCurrentIp,
                'x-factor': (this.req.request.body)['x-factor']
            };

            this.invalidLogin = invalidLoginMethod(this.config, this.tnxId);
            this.invalidLogin.addInvalidLogin(this.loginInfo);
            this.callback(error, null);
        },
        checkCaptchaForForgotPwd: function (err, result) {
            if (result) {
                if (result.captcha == this.req.captcha) {
                    var mongo = this.utils.initMongo(this.initmodel, this.routed, this.tnxId);
                    var resHandle = this.checkUserIdCaseSensitive.bind(this);
                    mongo.FindOneMethod(resHandle);
                    return true;
                }
            }

            var error = this.errorResponse.InvalidCaptcha;
            this.callback(error, null);
        },
        checkCaptchaForForgotUserName: function (err, result) {
            if (result) {
                if (result.captcha == this.req.captcha) {
                    var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
                    var resHandle = this.verifyEmailIdHandle.bind(this);
                    mongo.FindMethod(resHandle);

                    return true;
                }
            }

            var error = this.errorResponse.InvalidCaptcha;
            this.callback(error, null);
        },
        checkLockUser: function (err, result) {
            var error;
            if (!result) {
                this.invalidLogin.addInvalidLogin(this.loginInfo);
                error = this.errorResponse.UserLoginFailed;
                this.callback(error, null);
            } else {
                if (result.status == "Deleted") {
                    error = this.errorResponse.UserLoginFailed;
                    this.callback(error, null);
                } else {
                    this.result = result;
                    var lock = lockUserMethod(this.config, this.tnxId);
                    var resHandle = this.checkBankPolicy.bind(this);
                    lock.getLoginCount(result.userId, resHandle);
                }
            }
        },
        checkBankPolicy: function (countObj) {
            this.countObj = countObj;
            var bankPolicyMethod = require('../supportMethods/bankPolicyMethods');
            var bank = bankPolicyMethod(this.config, this.tnxId);
            this.resHandle = this.validationDone.bind(this);
            var resHandle = this.getEncryptKey.bind(this);
            bank.getBankPolicy({}, resHandle);
        },
        validationDone: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            this.loginInfo.validUser = 'Yes';
            var error = this.errorResponse.UserLoginFailed;
            var lock = lockUserMethod(this.config, this.tnxId);
            /*if(!this.utils.isSubUser(this.result.createdBy,this.result.originator) && this.result.firstLogin){
             var today = new Date();
             today = moment([today.getFullYear(),today.getMonth(),today.getDate()]);

             var createdOn = new Date(this.result.createdOn);
             createdOn = moment([createdOn.getFullYear(),createdOn.getMonth(),createdOn.getDate()]);

             if(today.diff(createdOn, 'days') > this.config.temporaryCredentialsExpiration.client.userId){
             var error1 = this.errorResponse.TempUserIdExpired;
             this.callback(error1 , null);
             }
             } else */
            if (this.countObj.counter > this.finalResult.passwordRestrictions.failedLoginAttempts - 1 || this.result.status == this.config.status.Locked) {
                this.result.status = this.config.status.Locked;
                this.result.save();
                lock.addLoginCount(this.result, this.errorResponse.InCorrectRetryError);
                this.callback(this.countObj.reason, null);
            } else if (this.countObj.counter <= this.finalResult.passwordRestrictions.failedLoginAttempts) {
                var decryptedPassword = "";
                if (this.result.isTemporaryPassword) {
                    decryptedPassword = this.decryptString(this.result.tempPassword, this.encryptionKey);
                    var today = new Date();
                    today = moment([today.getFullYear(), today.getMonth(), today.getDate()]);

                    var passwordChangedOn = new Date(this.result.passwordChangedOn);
                    passwordChangedOn = moment([passwordChangedOn.getFullYear(), passwordChangedOn.getMonth(), passwordChangedOn.getDate()]);
                    if (today.diff(passwordChangedOn, 'days') > this.config.temporaryCredentialsExpiration.client.password) {
                        var error1 = this.errorResponse.TempPasswordExpired;
                        this.callback(error1, null);
                    }
                } else {
                    decryptedPassword = this.decryptString(this.result.password, this.encryptionKey);
                }
                var jsSHA = require("jssha");
                var shaObj = new jsSHA("SHA-256", "TEXT");
                shaObj.update(decryptedPassword);
                var hash = shaObj.getHash("HEX");
                decryptedPassword = hash;
                if (this.password != decryptedPassword) {
                    lock.addLoginCount(this.result, this.errorResponse.InCorrectRetryError);

                    if (this.countObj.counter == this.finalResult.passwordRestrictions.failedLoginAttempts - 1) {
                        this.result.status = this.config.status.Locked;
                        this.result.save();
                        error = this.countObj.reason;
                        var alertObj = {
                            userId: this.result.userId,
                            emailId: this.result.emailId,
                            phoneNo: this.result.contact.mobileNo,
                            alertMessage: 'When my login attempts exceed the limit',
                            emailMessage: 'ALERT:  Your login attempts have exceeded the daily limit and must be reset.\nFor any issues please contact your bank.'
                        };

                        var vfxRequestId = generateId();
                        var requestId = generateId();
                        var requestObj = {
                            config: this.config,
                            requestId: requestId,
                            vfxRequestId: vfxRequestId,
                            requestBody: {
                                "REQUEST_NAME": "AlertRq",
                                "INSTANCE": {
                                    "bankId": this.result.institutionId,
                                    "customerId": this.result.customerId,
                                    "alertType": "USER LOCKED",
                                    "userId": this.result.userId,
                                    "requestId": requestId,
                                    "vfxRequestId": vfxRequestId

                                }
                            }
                        };
                        if (this.utils.isSubUser(this.result.createdBy, this.result.originator)) {
                            requestObj.requestBody.INSTANCE.emailAddress = this.result.emailId;
                            requestObj.requestBody.INSTANCE.phoneNo = this.result.contact.phoneNo;
                        }
                        var validateResponse = function (error, response) {
                        };

                        var ws = alertWS(requestObj, validateResponse);
                        ws.requestVsoftAlertServer();
                    }

                    this.invalidLogin.addInvalidLogin(this.loginInfo);
                    this.callback(error, null);
                } else {
                    this.limitProfile = this.result.limitProfile;
                    this.isSubUser = this.utils.isSubUser(this.result.createdBy, this.result.originator);
                    this.success = {
                        isSubUser: this.isSubUser,
                        userId: this.result.userId,
                        userName: this.result.userName,
                        customerId: this.result.customerId,
                        customerName: this.result.customerName,
                        sessionValidity: (this.config.clientSession.timedOut) * 60000,
                        alertBefore: (this.config.clientSession.alertBefore) * 1000,
                        privileges: this.result.privilege,
                        isSupervisor: this.result.isSupervisor,
                        customerType: this.result.customerType,
                        limitsAvailable: this.result.limitsAvailable,
                        disableUserId: true,
                        lastLogin: this.result.lastLogin || '',
                        message: this.successResponse.LoginUser,
                        showExpiryWarning: false,
                        daysBeforeExpiry: 0,
                        nextStep: this.config.nextStepTo.goToAccountOverview,
                        checkOrder: this.config.checkOrder,
                        bankNameId: this.config.bankNameId,
                        payveris: this.config.payverisServer,
                        currency: this.config.currency,
                        systemConfiguration: this.config.systemConfiguration.client,
                        weeklyOffForCalendar: this.config.weeklyOffForCalendar,
                        moduleConfig: this.config.moduleConfig.client,
                        checkfreeBillPay: this.config.checkfreeBillPay,
                        isAccountMasked: this.config.isAccountMasked,
                        customerCounts : 1
                    };

                    var today = new Date();
                    today = moment([today.getFullYear(), today.getMonth(), today.getDate()]);

                    var passwordChangedOn = new Date(this.result.passwordChangedOn);
                    passwordChangedOn = moment([passwordChangedOn.getFullYear(), passwordChangedOn.getMonth(), passwordChangedOn.getDate()]);

                    var numberOfDaysPasswordExpire = this.finalResult.passwordExpirationInfo.numberOfDaysPasswordExpire;

                    var passwordExpiryDate = passwordChangedOn.add(numberOfDaysPasswordExpire, 'days')

                    this.success.showExpiryWarning = (passwordExpiryDate.diff(today, 'days') <= this.finalResult.passwordExpirationInfo.expiryWarningAfter);
                    this.success.daysBeforeExpiry = passwordExpiryDate.diff(today, 'days');
                    if (!(_.contains(this.result.lastLoginIPCollection, this.config.userCurrentIp))) {
                        this.result.lastLoginIPCollection.push(this.config.userCurrentIp);
                    }
                    if (!(_.contains(this.result.lastLoginXFactorCollection, this['x-factor']))) {
                        this.success.nextStep = this.config.nextStepTo.goToMFA;
                    }

                    if (this.result.securityQuestion.length == 0) this.success.nextStep = this.config.nextStepTo.goToAddNewSecurityQ;

                    if (today.diff(passwordChangedOn, 'days') > numberOfDaysPasswordExpire) this.success.nextStep = this.config.nextStepTo.goToChangePassword;

                    if (this.result.changePasswordOnNextLogin) this.success.nextStep = this.config.nextStepTo.goToChangePassword;

                    if (this.result.isTemporaryPassword) this.success.nextStep = this.config.nextStepTo.goToChangePassword;

                    if (this.result.firstLogin) this.success.nextStep = this.config.nextStepTo.goToFirstTimeLogin;

                    lock.resetLoginCount(this.result.userId);
                    this.req.request.body.userId = this.result.userId;
                    this.req.request.body.customersId = this.result.customerId;
                    this.req.request.body.customerName = this.result.customerName;
                    this.req.request.body.userInfo = {
                        emailId: this.result.emailId,
                        phoneNo: this.result.contact.mobileNo
                    };
                    this.req.request.body.viewAccess = this.result.privilege.userViews;

                    var dated = new Date();
                    this.result.lastLogin = new Date();
                    this.result.lastLoginIP = this.config.userCurrentIp;
                    this.result.save();

                    var routed = {
                        customerId: {
                            $regex: '^' + this.result.customerId + '$',
                            $options: "i"
                        }
                    }
                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    var resHandle = this.getUsersCount.bind(this);
                    mongo.Count(resHandle);


                }
            } else {

                this.invalidLogin.addInvalidLogin(this.loginInfo);
                this.callback(this.countObj.reason, null);
            }
        },
        getUsersCount: function (err, result) {
            this.success.customerCounts = result;
            if (!this.utils.isSubUser(this.result.createdBy, this.result.originator)) {
                this.success.disableUserId = false;
                var accessTypeHandle = this.addPrivileges.bind(this);
                var getAccessType = this.getAccessTypePrivilege.bind(this);
                getAccessType(this.result.accessType, accessTypeHandle);
            } else {
                var handleSession = session.SessionHandle(this.req, this.tnxId);
//                        var resHandle = this.updateCoreAccountAtLogin.bind(this);
                var resHandle = this.addPrivileges.bind(this);
                handleSession.login(resHandle);
            }
        },
        addPrivileges: function (err, result) {
            if (result) {
                // this.req.request.body.viewAccess = result.privilege.userViews;
                // this.success.privileges.userViews = result.privilege.userViews;

                this.success.privileges.userViews = {
                    UserType: result.privilege.userViews.UserType,
                    Accounts: {
                        Overview: result.privilege.userViews.Accounts.Overview,
                        DetailsHistory: result.privilege.userViews.Accounts.DetailsHistory,
                        Statements: this.config.moduleConfig.client.eStatements.view && result.privilege.userViews.Accounts.Statements,
                        StatementsEnrollment: this.config.moduleConfig.client.eStatements.enroll && result.privilege.userViews.Accounts.StatementsEnrollment
                    },
                    CheckDeposit: {
                        Deposit:  result.privilege.userViews.CheckDeposit.Deposit,
                        DepositHistory:  result.privilege.userViews.CheckDeposit.DepositHistory
                    },
                    Payments: {
                        BillPay: this.config.moduleConfig.client.paymentsAndTransfers.payBills && result.privilege.userViews.Payments.BillPay,
                        PendingTransfer: this.config.moduleConfig.client.paymentsAndTransfers.transferMoneyInSameFI && result.privilege.userViews.Payments.PendingTransfer,
                        FundsTransfer: this.config.moduleConfig.client.paymentsAndTransfers.transferMoneyInSameFI && result.privilege.userViews.Payments.FundsTransfer,
                        TransferMoneyAtOtherFI: this.config.moduleConfig.client.paymentsAndTransfers.transferMoneyInOtherFI && result.privilege.userViews.Payments.TransferMoneyAtOtherFI,
                        PayOtherPeople: this.config.moduleConfig.client.paymentsAndTransfers.payOtherPeople && result.privilege.userViews.Payments.PayOtherPeople,
                        ThirdPartyTransfer: (this.config.moduleConfig.client.paymentsAndTransfers.transferMoneyInSameFI && this.config.moduleConfig.client.paymentsAndTransfers.transferMoneyInSameFIThirdParty) && result.privilege.userViews.Payments.ThirdPartyTransfer
                    },
                    PaymentsWireTransfer: {
                        WireTransferAuthorization: this.config.moduleConfig.client.paymentsAndTransfers.wireTransfer && result.privilege.userViews.PaymentsWireTransfer.WireTransferAuthorization,
                        WireTransferHistory: this.config.moduleConfig.client.paymentsAndTransfers.wireTransfer && result.privilege.userViews.PaymentsWireTransfer.WireTransferHistory,
                        WireTransferRequest: this.config.moduleConfig.client.paymentsAndTransfers.wireTransfer && result.privilege.userViews.PaymentsWireTransfer.WireTransferRequest,
                        ListBeneficiary: this.config.moduleConfig.client.paymentsAndTransfers.wireTransfer && result.privilege.userViews.PaymentsWireTransfer.ListBeneficiary,
                        RegisterBeneficiary: this.config.moduleConfig.client.paymentsAndTransfers.wireTransfer && result.privilege.userViews.PaymentsWireTransfer.RegisterBeneficiary
                    },
                    BusinessServicesACH: {
                        ACHFileImportAuthorization: this.config.moduleConfig.client.businessAndTransactionServices.achTransfer && result.privilege.userViews.BusinessServicesACH.ACHFileImportAuthorization,
                        ACHFileImport: this.config.moduleConfig.client.businessAndTransactionServices.achTransfer && result.privilege.userViews.BusinessServicesACH.ACHFileImport,
                        ACHBatchAuthorization: this.config.moduleConfig.client.businessAndTransactionServices.achTransfer && result.privilege.userViews.BusinessServicesACH.ACHBatchAuthorization,
                        ACHRecipients: this.config.moduleConfig.client.businessAndTransactionServices.achTransfer && result.privilege.userViews.BusinessServicesACH.ACHRecipients,
                        ACHAddNewRecipients: this.config.moduleConfig.client.businessAndTransactionServices.achTransfer && result.privilege.userViews.BusinessServicesACH.ACHAddNewRecipients,
                        CreateNewBatch: this.config.moduleConfig.client.businessAndTransactionServices.achTransfer && result.privilege.userViews.BusinessServicesACH.CreateNewBatch,
                        ACHBatchSummary: this.config.moduleConfig.client.businessAndTransactionServices.achTransfer && result.privilege.userViews.BusinessServicesACH.ACHBatchSummary
                    },
                    BusinessServicesWireTransfer: {
                        WireTransferAuthorization: this.config.moduleConfig.client.businessAndTransactionServices.wireTransfer && result.privilege.userViews.BusinessServicesWireTransfer.WireTransferAuthorization,
                        WireTransferHistory: this.config.moduleConfig.client.businessAndTransactionServices.wireTransfer && result.privilege.userViews.BusinessServicesWireTransfer.WireTransferHistory,
                        WireTransferRequest: this.config.moduleConfig.client.businessAndTransactionServices.wireTransfer && result.privilege.userViews.BusinessServicesWireTransfer.WireTransferRequest,
                        ListBeneficiary: this.config.moduleConfig.client.businessAndTransactionServices.wireTransfer && result.privilege.userViews.BusinessServicesWireTransfer.ListBeneficiary,
                        RegisterBeneficiary: this.config.moduleConfig.client.businessAndTransactionServices.wireTransfer && result.privilege.userViews.BusinessServicesWireTransfer.RegisterBeneficiary
                    },
                    BusinessServices: {
                        BusinessFundsTransfer: this.config.moduleConfig.client.businessAndTransactionServices.transferMoneyInSameFI && result.privilege.userViews.BusinessServices.BusinessFundsTransfer,
                        BusinessThirdPartyTransfer: (this.config.moduleConfig.client.businessAndTransactionServices.transferMoneyInSameFI && this.config.moduleConfig.client.businessAndTransactionServices.transferMoneyInSameFIThirdParty) && result.privilege.userViews.BusinessServices.BusinessThirdPartyTransfer,
                        PositivePay: result.privilege.userViews.BusinessServices.PositivePay,
                        BillPay: this.config.moduleConfig.client.businessAndTransactionServices.billPay && result.privilege.userViews.BusinessServices.BillPay
                    },
                    OtherServices: {
                        OrderChecks: this.config.moduleConfig.client.otherServices.orderChecks && result.privilege.userViews.OtherServices.OrderChecks,
                        StopPayments: this.config.moduleConfig.client.otherServices.stopPayment && result.privilege.userViews.OtherServices.StopPayments,
                        Alerts: this.config.moduleConfig.client.otherServices.alerts && result.privilege.userViews.OtherServices.Alerts,
                        BankMail: this.config.moduleConfig.client.otherServices.bankMail && result.privilege.userViews.OtherServices.BankMail
                    },
                    ProfileManagement: {
                        ChangePassword: result.privilege.userViews.ProfileManagement.ChangePassword,
                        ChangeSecurityQuestion: result.privilege.userViews.ProfileManagement.ChangeSecurityQuestion,
                        ViewPersonalInfo: result.privilege.userViews.ProfileManagement.ViewPersonalInfo,
                        Reminders: this.config.moduleConfig.client.profileManagement.reminders && result.privilege.userViews.ProfileManagement.Reminders
                    },
                    AdministrativeTools: {
                        SessionsReport: result.privilege.userViews.AdministrativeTools.SessionsReport
                    },
                    AdministrativeToolsUserManagement: {
                        CreateNewUsers: result.privilege.userViews.AdministrativeToolsUserManagement.CreateNewUsers,
                        Users: result.privilege.userViews.AdministrativeToolsUserManagement.Users
                    },
                    Calculators: {
                        Bond: this.config.moduleConfig.client.calculator.bond && result.privilege.userViews.Calculators.Bond,
                        Savings: this.config.moduleConfig.client.calculator.savings && result.privilege.userViews.Calculators.Savings,
                        Loan: this.config.moduleConfig.client.calculator.loan && result.privilege.userViews.Calculators.Loan
                    }
                };
                this.req.request.body.viewAccess = this.success.privileges.userViews;
                this.success.isSupervisor = result.privilege.userViews.AdministrativeToolsUserManagement.CreateNewUsers;
            }
            var inquiry = customerInquiry.CustomerInquiry(this.success, this.config, this.tnxId);
            var resHandle = this.updateCoreAccountAtLogin.bind(this);
            inquiry.ignoreDirectCoreCaller(resHandle);
        },
        updateCoreAccountAtLogin: function (err, result) {
            if (!result) {
                this.invalidLogin.addInvalidLogin(this.loginInfo);
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.success.privileges.access.accountsAccess = result.customerAccounts;
                this.success.privileges.access.accountsTransferAccess = result.customerAccounts;
                this.userDetailsFromCore = {
                    fullName: result.fullName,
                    organizationName: result.organizationName,
                    contact: result.cellPhoneNumberData.phoneNumber || null,
                    emailId: result.emailAddress || null
                }
                var handleSession = session.SessionHandle(this.req, this.tnxId);
                var resHandle = this.updateAccountsLocal.bind(this);
                handleSession.login(resHandle);
            }
        },
        updateAccountsLocal: function (err, result) {
            this.retrievedAccount = this.success.privileges.access.accountsAccess;
            var routed = {
                institutionId: this.config.instId,
                userName: {
                    $regex: '^' + this.loginInfo.userId + '$',
                    $options: "i"
                }
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.findUserAndUpdateNickName.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        findUserAndUpdateNickName: function (err, result) {
            var tempAccount = result.accountsInformation || [];
            this.routed = result;
            //**** New Logic : Start ****//
            var userAccount = null || [];
            for(var i = 0 ; i < tempAccount.length ; i++){
                userAccount.push(tempAccount[i].accountNo)
            };
            var userCoreAccount = null || [];
            for(var i = 0 ; i < this.retrievedAccount.length ; i++){
                userCoreAccount.push(this.retrievedAccount[i].accountNo)
            };
            var finalAccounts = null || tempAccount;
            for(var j = 0 ; j < this.retrievedAccount.length ; j++){
                if(userAccount.indexOf(this.retrievedAccount[j].accountNo) < 0 && userCoreAccount.indexOf(this.retrievedAccount[j].accountNo) == j){
                    finalAccounts.push({
                        accountNo : this.retrievedAccount[j].accountNo,
                        nickName:null
                    })
                }
            }
            // console.log(finalAccounts)
            this.routed.accountsInformation = finalAccounts;
            //**** New Logic : End ****//
            //**** Old Logic : Start ****//
            /*var finalAccounts = null || [];
            for (var i = 0; i < tempAccount.length; i++) {
                for (var j = 0; j < this.retrievedAccount.length; j++) {
                    if (tempAccount[i].accountNo == this.retrievedAccount[j].accountNo) {
                        finalAccounts.push(tempAccount[i]);
                        this.retrievedAccount[j].added = true;
                    }
                }
            }
            for (var j = 0; j < this.retrievedAccount.length; j++) {
                if (this.retrievedAccount[j].added != true) {
                    finalAccounts.push({
                        accountNo: this.retrievedAccount[j].accountNo,
                        nickName: null
                    });
                }
            }
            this.routed.accountsInformation = finalAccounts;*/
            //**** Old Logic : End ****//
            if (!this.utils.isSubUser(this.result.createdBy, this.result.originator)) {
                //TODO UPDATE NAME : TEST THIS : START
                this.routed.customerName = this.userDetailsFromCore.fullName ? this.userDetailsFromCore.fullName : this.userDetailsFromCore.organizationName;
                this.success.customerName = this.routed.customerName;
                this.customerName = this.routed.customerName;
                //TODO UPDATE NAME : TEST THIS : END
                if (this.userDetailsFromCore.contact) {
                    this.routed.contact.mobileNo = this.userDetailsFromCore.contact;
                    this.routed.contact.phoneNo = this.userDetailsFromCore.contact;
                }
                if (this.userDetailsFromCore.emailId) {
                    this.routed.emailId = this.userDetailsFromCore.emailId;
                }
            }
            this.routed.save();
            if (!this.utils.isSubUser(this.routed.createdBy, this.routed.originator)) {
                if (this.limitProfile == undefined) {
                    var routed = {
                        institutionId: this.config.instId,
                        accessType: this.result.accessType
                    };
                    var mongo = this.utils.initMongo(this.accesstypemodel, routed, this.tnxId);
                    var resHandle = this.findLimitProfileForAccessType.bind(this);
                    mongo.FindOneMethod(resHandle);

                } else {
                    var routed = {
                        institutionId: this.config.instId,
                        '_id': this.limitProfile
                    };
                    var mongo = this.utils.initMongo(this.limitprofilemodel, routed, this.tnxId);
                    var resHandle = this.findLimitProfileForUser.bind(this);
                    mongo.FindOneMethod(resHandle);
                }
            } else {
                var routed = {
                    institutionId: this.config.instId,
                    userId: this.result.createdBy
                };
                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var resHandle = this.getUserForSubUser.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        getUserForSubUser: function (err, result) {
            this.supervisorDetails = result;
            if (!this.utils.isSubUser(result.createdBy, result.originator)) {
                if (result.limitProfile == undefined) {
                    var routed = {
                        institutionId: this.config.instId,
                        accessType: result.accessType
                    };
                    var mongo = this.utils.initMongo(this.accesstypemodel, routed, this.tnxId);
                    var resHandle = this.findSubUserLimitProfileForAccessType.bind(this);
                    mongo.FindOneMethod(resHandle);

                } else {
                    var routed = {
                        institutionId: this.config.instId,
                        '_id': result.limitProfile
                    };
                    var mongo = this.utils.initMongo(this.limitprofilemodel, routed, this.tnxId);
                    var resHandle = this.findSubUserLimitProfileForUser.bind(this);
                    mongo.FindOneMethod(resHandle);
                }
            } else {
                //TODO - if subuser can create sub-subuser
            }
        },
        findSubUserLimitProfileForAccessType: function (err, result) {
            var routed = {
                institutionId: this.config.instId,
                '_id': result.limitProfile
            };
            var mongo = this.utils.initMongo(this.limitprofilemodel, routed, this.tnxId);
            var resHandle = this.findSubUserLimitProfileForUser.bind(this);
            mongo.FindOneMethod(resHandle);

        },
        findSubUserLimitProfileForUser: function (err, result) {
            if (result) {
                // if (parseInt(result.ACHDebitLimitPerDay) > 0) {
                    this.success.privileges.limits.achLimits.achDebitLimitPerDay = Math.min(parseFloat(this.success.privileges.limits.achLimits.achDebitLimitPerDay), parseFloat(result.ACHDebitLimitPerDay));
                // }
                // if (parseInt(result.ACHDebitLimitPerTransaction) > 0) {
                    this.success.privileges.limits.achLimits.achDebitLimitPerTranc = Math.min(parseFloat(this.success.privileges.limits.achLimits.achDebitLimitPerTranc), parseFloat(result.ACHDebitLimitPerTransaction));
                // }
                // if (parseInt(result.ACHCreditLimitPerDay) > 0) {
                    this.success.privileges.limits.achLimits.achCreditLimitPerDay = Math.min(parseFloat(this.success.privileges.limits.achLimits.achCreditLimitPerDay), parseFloat(result.ACHCreditLimitPerDay));
                // }
                // if (parseInt(result.ACHCreditLimitPerTransaction) > 0) {
                    this.success.privileges.limits.achLimits.achCreditLimitPerTranc = Math.min(parseFloat(this.success.privileges.limits.achLimits.achCreditLimitPerTranc), parseFloat(result.ACHCreditLimitPerTransaction));
                // }
                // if (parseInt(result.transferLimitPerDay) > 0) {
                    this.success.privileges.limits.fundsLimits.fundsLimitPerDay = Math.min(parseFloat(this.success.privileges.limits.fundsLimits.fundsLimitPerDay), parseFloat(result.transferLimitPerDay));
                // }
                // if (parseInt(result.transferLimitPerTransaction) > 0) {
                    this.success.privileges.limits.fundsLimits.fundsLimitPerTranc = Math.min(parseFloat(this.success.privileges.limits.fundsLimits.fundsLimitPerTranc), parseFloat(result.transferLimitPerTransaction));
                // }
                // if (parseInt(result.wireTransferLimitPerDay) > 0) {
                    this.success.privileges.limits.wireLimits.wireLimitPerDay = Math.min(parseFloat(this.success.privileges.limits.wireLimits.wireLimitPerDay), parseFloat(result.wireTransferLimitPerDay));
                // }
                // if (parseInt(result.wireTransferLimitPerTransaction) > 0) {
                    this.success.privileges.limits.wireLimits.wireLimitPerTranc = Math.min(parseFloat(this.success.privileges.limits.wireLimits.wireLimitPerTranc), parseFloat(result.wireTransferLimitPerTransaction));
                // }
            }
            var routed = {
                institutionId: this.config.instId,
                userId: this.supervisorDetails.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.getSupervisorDetails.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        getSupervisorDetails: function (err, result) {
            var routed = {
                institutionId: this.config.instId,
                accessType: result.accessType
            };
            var mongo = this.utils.initMongo(this.accesstypemodel, routed, this.tnxId);
            var resHandle = this.getSupervisorDetailsAccess.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        getSupervisorDetailsAccess: function (err, result) {
            this.success.privileges.userViews = {
                UserType: result.privilege.userViews.UserType,
                Accounts: {
                    Overview: this.success.privileges.userViews.Accounts.Overview && result.privilege.userViews.Accounts.Overview,
                    DetailsHistory: this.success.privileges.userViews.Accounts.DetailsHistory && result.privilege.userViews.Accounts.DetailsHistory,
                    Statements: this.success.privileges.userViews.Accounts.Statements && result.privilege.userViews.Accounts.Statements,
                    StatementsEnrollment: this.success.privileges.userViews.Accounts.StatementsEnrollment && result.privilege.userViews.Accounts.StatementsEnrollment
                },
                CheckDeposit: {
                    Deposit:  this.success.privileges.userViews.CheckDeposit.Deposit && result.privilege.userViews.CheckDeposit.Deposit,
                    DepositHistory:  this.success.privileges.userViews.CheckDeposit.DepositHistory && result.privilege.userViews.CheckDeposit.DepositHistory
                },
                Payments: {
                    BillPay: this.success.privileges.userViews.Payments.BillPay && result.privilege.userViews.Payments.BillPay,
                    PendingTransfer: this.success.privileges.userViews.Payments.PendingTransfer && result.privilege.userViews.Payments.PendingTransfer,
                    FundsTransfer: this.success.privileges.userViews.Payments.FundsTransfer && result.privilege.userViews.Payments.FundsTransfer,
                    TransferMoneyAtOtherFI: this.success.privileges.userViews.Payments.TransferMoneyAtOtherFI && result.privilege.userViews.Payments.TransferMoneyAtOtherFI,
                    PayOtherPeople: this.success.privileges.userViews.Payments.PayOtherPeople && result.privilege.userViews.Payments.PayOtherPeople,
                    ThirdPartyTransfer: this.success.privileges.userViews.Payments.ThirdPartyTransfer && result.privilege.userViews.Payments.ThirdPartyTransfer
                },
                PaymentsWireTransfer: {
                    WireTransferAuthorization: this.success.privileges.userViews.PaymentsWireTransfer.WireTransferAuthorization && result.privilege.userViews.PaymentsWireTransfer.WireTransferAuthorization,
                    WireTransferHistory: this.success.privileges.userViews.PaymentsWireTransfer.WireTransferHistory && result.privilege.userViews.PaymentsWireTransfer.WireTransferHistory,
                    WireTransferRequest: this.success.privileges.userViews.PaymentsWireTransfer.WireTransferRequest && result.privilege.userViews.PaymentsWireTransfer.WireTransferRequest,
                    ListBeneficiary: this.success.privileges.userViews.PaymentsWireTransfer.ListBeneficiary && result.privilege.userViews.PaymentsWireTransfer.ListBeneficiary,
                    RegisterBeneficiary: this.success.privileges.userViews.PaymentsWireTransfer.RegisterBeneficiary && result.privilege.userViews.PaymentsWireTransfer.RegisterBeneficiary
                },
                BusinessServicesACH: {
                    ACHFileImportAuthorization: this.success.privileges.userViews.BusinessServicesACH.ACHFileImportAuthorization && result.privilege.userViews.BusinessServicesACH.ACHFileImportAuthorization,
                    ACHFileImport: this.success.privileges.userViews.BusinessServicesACH.ACHFileImport && result.privilege.userViews.BusinessServicesACH.ACHFileImport,
                    ACHBatchAuthorization: this.success.privileges.userViews.BusinessServicesACH.ACHBatchAuthorization && result.privilege.userViews.BusinessServicesACH.ACHBatchAuthorization,
                    ACHRecipients: this.success.privileges.userViews.BusinessServicesACH.ACHRecipients && result.privilege.userViews.BusinessServicesACH.ACHRecipients,
                    ACHAddNewRecipients: this.success.privileges.userViews.BusinessServicesACH.ACHAddNewRecipients && result.privilege.userViews.BusinessServicesACH.ACHAddNewRecipients,
                    CreateNewBatch: this.success.privileges.userViews.BusinessServicesACH.CreateNewBatch && result.privilege.userViews.BusinessServicesACH.CreateNewBatch,
                    ACHBatchSummary: this.success.privileges.userViews.BusinessServicesACH.ACHBatchSummary && result.privilege.userViews.BusinessServicesACH.ACHBatchSummary
                },
                BusinessServicesWireTransfer: {
                    WireTransferAuthorization: this.success.privileges.userViews.BusinessServicesWireTransfer.WireTransferAuthorization && result.privilege.userViews.BusinessServicesWireTransfer.WireTransferAuthorization,
                    WireTransferHistory: this.success.privileges.userViews.BusinessServicesWireTransfer.WireTransferHistory && result.privilege.userViews.BusinessServicesWireTransfer.WireTransferHistory,
                    WireTransferRequest: this.success.privileges.userViews.BusinessServicesWireTransfer.WireTransferRequest && result.privilege.userViews.BusinessServicesWireTransfer.WireTransferRequest,
                    ListBeneficiary: this.success.privileges.userViews.BusinessServicesWireTransfer.ListBeneficiary && result.privilege.userViews.BusinessServicesWireTransfer.ListBeneficiary,
                    RegisterBeneficiary: this.success.privileges.userViews.BusinessServicesWireTransfer.RegisterBeneficiary && result.privilege.userViews.BusinessServicesWireTransfer.RegisterBeneficiary
                },
                BusinessServices: {
                    BusinessFundsTransfer: this.success.privileges.userViews.BusinessServices.BusinessFundsTransfer && result.privilege.userViews.BusinessServices.BusinessFundsTransfer,
                    BusinessThirdPartyTransfer: this.success.privileges.userViews.BusinessServices.BusinessThirdPartyTransfer && result.privilege.userViews.BusinessServices.BusinessThirdPartyTransfer,
                    PositivePay: this.success.privileges.userViews.BusinessServices.PositivePay && result.privilege.userViews.BusinessServices.PositivePay,
                    BillPay: this.success.privileges.userViews.BusinessServices.BillPay && result.privilege.userViews.BusinessServices.BillPay
                },
                OtherServices: {
                    OrderChecks: this.success.privileges.userViews.OtherServices.OrderChecks && result.privilege.userViews.OtherServices.OrderChecks,
                    StopPayments: this.success.privileges.userViews.OtherServices.StopPayments && result.privilege.userViews.OtherServices.StopPayments,
                    Alerts: this.success.privileges.userViews.OtherServices.Alerts && result.privilege.userViews.OtherServices.Alerts,
                    BankMail: this.success.privileges.userViews.OtherServices.BankMail && result.privilege.userViews.OtherServices.BankMail
                },
                ProfileManagement: {
                    ChangePassword: this.success.privileges.userViews.ProfileManagement.ChangePassword && result.privilege.userViews.ProfileManagement.ChangePassword,
                    ChangeSecurityQuestion: this.success.privileges.userViews.ProfileManagement.ChangeSecurityQuestion && result.privilege.userViews.ProfileManagement.ChangeSecurityQuestion,
                    ViewPersonalInfo: this.success.privileges.userViews.ProfileManagement.ViewPersonalInfo && result.privilege.userViews.ProfileManagement.ViewPersonalInfo,
                    Reminders: this.success.privileges.userViews.ProfileManagement.Reminders && result.privilege.userViews.ProfileManagement.Reminders
                },
                AdministrativeTools: {
                    SessionsReport: this.success.privileges.userViews.AdministrativeTools.SessionsReport && result.privilege.userViews.AdministrativeTools.SessionsReport
                },
                AdministrativeToolsUserManagement: {
                    CreateNewUsers: this.success.privileges.userViews.AdministrativeToolsUserManagement.CreateNewUsers && result.privilege.userViews.AdministrativeToolsUserManagement.CreateNewUsers,
                    Users: this.success.privileges.userViews.AdministrativeToolsUserManagement.Users && result.privilege.userViews.AdministrativeToolsUserManagement.Users
                },
                Calculators: {
                    Bond: this.success.privileges.userViews.Calculators.Bond && result.privilege.userViews.Calculators.Bond,
                    Retirement: this.success.privileges.userViews.Calculators.Retirement && result.privilege.userViews.Calculators.Retirement,
                    Savings: this.success.privileges.userViews.Calculators.Savings && result.privilege.userViews.Calculators.Savings,
                    Loan: this.success.privileges.userViews.Calculators.Loan && result.privilege.userViews.Calculators.Loan
                }
            };

            var routed = {
                institutionId: this.config.instId
            };
            var mongo = this.utils.initMongo(this.holidayCalenderModel, routed, this.tnxId);
            var resHandle = this.findHolidayCalender.bind(this);
            mongo.FindMethod(resHandle);
        },
        findHolidayCalender: function (err, result) {
            this.success.holidayCalender = {
                fundsTransfer: [],
                wireTransfer: [],
                achTransfer: []
            };
            if (result) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].type == 'fundsTransfer') {
                        this.success.holidayCalender.fundsTransfer.push(result[i].date);
                    }
                    if (result[i].type == 'wireTransfer') {
                        this.success.holidayCalender.wireTransfer.push(result[i].date);
                    }
                    if (result[i].type == 'achTransfer') {
                        this.success.holidayCalender.achTransfer.push(result[i].date);
                    }
                }
            }
            //FIND CURRENT DAY TRANSACTIONS
            var routed =
                [
                    {
                        "$match": {
                            customerId : this.success.customerId,
                            status : {$ne : "FAILED"},
                            $and : [{
                                transactionDate : {$gte : moment().startOf("day").toDate()}
                            },{
                                transactionDate : {$lte : moment().endOf("day").toDate()}
                            }]
                        }
                    },
                    {
                        "$group": {
                            _id: '$transactionType',
                            usedLimit: { $sum: {$add:'$amount'} },
                            totalTransactions : { $sum: 1 }
                        }
                    }
                ]
            var that = this;
            var fundsTransferStatusLogModel = require('../lib/models/dbModel').FundsTransferStatusLog;

            fundsTransferStatusLogModel.aggregate(
                routed , function (err, result) {
                    that.success.alertBefore.usedTransactionLimit = result;
                    that.callback(null, that.success);
                });
        },
        findLimitProfileForAccessType: function (err, result) {
            var routed = {
                institutionId: this.config.instId,
                '_id': result.limitProfile
            };
            var mongo = this.utils.initMongo(this.limitprofilemodel, routed, this.tnxId);
            var resHandle = this.findLimitProfileForUser.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        findLimitProfileForUser: function (err, result) {
            if (result) {
                // if (parseInt(result.transferLimitPerDay) > 0) {
                    this.success.limitsAvailable.fundsPerDayLimit = true;
                    this.success.privileges.limits.fundsLimits.fundsLimitPerDay = result.transferLimitPerDay;
                // }
                // if (parseInt(result.transferLimitPerTransaction) > 0) {
                    this.success.limitsAvailable.fundsPerTrancLimit = true;
                    this.success.privileges.limits.fundsLimits.fundsLimitPerTranc = result.transferLimitPerTransaction;
                // }
                // if (parseInt(result.wireTransferLimitPerDay) > 0) {
                    this.success.limitsAvailable.wirePerDayLimit = true;
                    this.success.privileges.limits.wireLimits.wireLimitPerDay = result.wireTransferLimitPerDay;
                // }
                // if (parseInt(result.wireTransferLimitPerTransaction) > 0) {
                    this.success.limitsAvailable.fundsPerTrancLimit = true;
                    this.success.privileges.limits.wireLimits.wireLimitPerTranc = result.wireTransferLimitPerTransaction;
                // }
                // if (parseInt(result.ACHCreditLimitPerDay) > 0) {
                    this.success.limitsAvailable.achCreditPerDayLimit = true;
                    this.success.privileges.limits.achLimits.achCreditLimitPerDay = result.ACHCreditLimitPerDay;
                // }
                // if (parseInt(result.ACHCreditLimitPerTransaction) > 0) {
                    this.success.limitsAvailable.achCreditPerTrancLimit = true;
                    this.success.privileges.limits.achLimits.achCreditLimitPerTranc = result.ACHCreditLimitPerTransaction;
                // }
                // if (parseInt(result.ACHDebitLimitPerDay) > 0) {
                    this.success.limitsAvailable.achDebitPerDayLimit = true;
                    this.success.privileges.limits.achLimits.achDebitLimitPerDay = result.ACHDebitLimitPerDay;
                // }
                // if (parseInt(result.ACHDebitLimitPerTransaction) > 0) {
                    this.success.limitsAvailable.achDebitPerTrancLimit = true;
                    this.success.privileges.limits.achLimits.achDebitLimitPerTranc = result.ACHDebitLimitPerTransaction;
                // }
            }
            var routed = {
                institutionId: this.config.instId
            };
            var mongo = this.utils.initMongo(this.holidayCalenderModel, routed, this.tnxId);
            var resHandle = this.findHolidayCalender.bind(this);
            mongo.FindMethod(resHandle);
        },
        getAccessTypePrivilege: function (xsType, completeUserAdd) {
            var accessType = accessTypeMethod(this.config, this.tnxId);
            var accessTypeObj = {
                accessType: xsType
            };
            accessType.listAccessType(accessTypeObj, completeUserAdd);
        },
        unLockUser: function (reqBody, callback) {

            this.callback = callback;
            this.userId = reqBody.listedUserId;

            var routed = {
                institutionId: this.config.instId,
                userId: this.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.completeUnLock.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        completeUnLock: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                var status = this.config.status.Verified;
                if (result.firstLogin) status = this.config.status.NotEnrolled;
                result.status = status;
                result.save();
                var lock = lockUserMethod(this.config, this.tnxId);
                lock.removeLoginCount(this.userId);
                this.callback(null, {
                    unLockData: {
                        attempts: 0,
                        customerId: result.customerId,
                        customerName: result.customerName,
                        customerType: result.customerType,
                        lastLogin: result.lastLogin,
                        status: status,
                        userId: result.userId,
                        userName: result.userName
                    }, message: 'User ID ' + result.userName + ' was unlocked successfully'
                });
                // redirecting to alerts core
                var vfxRequestId = generateId();
                var requestId = generateId();
                var requestObj = {
                    config: this.config,
                    requestId: requestId,
                    vfxRequestId: vfxRequestId,
                    requestBody: {
                        "REQUEST_NAME": "AlertRq",
                        "INSTANCE": {
                            "alertType": 'LOGIN RESET',
                            "bankId": result.institutionId,
                            "requestId": requestId,
                            "customerId": result.customerId,
                            "userId": result.userId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };

                if (this.utils.isSubUser(result.createdBy, result.originator)) {
                    requestObj.requestBody.INSTANCE.emailAddress = result.emailId;
                    requestObj.requestBody.INSTANCE.phoneNo = result.contact.phoneNo;
                }

                var validateResponse = function (error, response) {
                };


                var ws = alertWS(requestObj, validateResponse);
                ws.requestVsoftAlertServer();

            }
        },
        firstTimeLoginChange: function (reqBody, callback) {
            this.callback = callback;

            this.userId = reqBody.userId;
            this.userName = reqBody.userName;
            this.password = reqBody.password;
            this.securityQuestion = reqBody.securityQuestion;
            this.checkUserId = reqBody.checkUserId;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.firstTimeLoginUpdate.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        firstTimeLoginUpdate: function (err, result) {
            var error = this.errorResponse.UserNotFoundFailed;
            if (!result) {
                this.callback(error, null);
            } else {
                this.routed = result;
                this.customerName = result.customerName;
                this.changeFTLResponse = {
                    message: this.successResponse.updatedFirstTimeLoginMsg,
                    nextStep: this.config.nextStepTo.goToLogout,
                    otpForService: 'firstLogin'
                };

                var policy = policyMethod(this.config, this.tnxId);
                var resHandle = this.bankPolicyCheck.bind(this);
                this.checkHandle = this.ftlBankPolicyReturn.bind(this);
                this.userIdCheckHandler = this.changedAfterFTL.bind(this);
                if (this.checkUserId) {
                    if (this.routed.userName != this.userName && this.routed.password != this.password) {
                        policy.checkUserId(this.userName, resHandle);
                    } else {
                        error = this.errorResponse.NewInfoFailed;
                        this.callback(error, null);
                    }
                } else {
                    this.userIdCheckHandler = this.changedAfterFTLNoUserCheck.bind(this);
                    policy.checkUserId(this.userName, resHandle);
                }
            }
        },
        bankPolicyCheck: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserIdComplianceFailed;
                this.callback(error, null);
            } else {
                var userObj = {
                    userId: this.userName,
                    password: this.password,
                    customerName: this.customerName
                };

                var policy = policyMethod(this.config, this.tnxId);
                var resHandle = this.checkHandle;
                policy.checkPassword(userObj, resHandle);
            }
        },
        ftlBankPolicyReturn: function (err, result) {
            if (err) {
                var error = this.errorResponse.PasswordComplianceFailed;
                this.callback(error, null);
            } else {
                var changeHandler = this.changeUserName.bind(this);
                changeHandler(this.userName, this.userIdCheckHandler);
            }
        },
        changeUserPassword: function (reqBody, callback) {
            this.callback = callback;

            this.userId = reqBody.userId;
            this.reqBody = reqBody;
            this.newPassword = reqBody.newPassword;
            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            this.resHandle = this.userInfo.bind(this);
            var resHandle = this.getEncryptKey.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        userInfo: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            if (!this.finalResult) {
                var error = this.errorResponse.InCorrectPasswordFailed;
                this.callback(error, null);
            } else {
                this.result = this.finalResult;
                var encryptedPassword = this.encryptString(this.reqBody.currentPassword, this.encryptionKey);
                if (this.result.isTemporaryPassword) {
                    decryptedPassword = this.decryptString(this.result.tempPassword, this.encryptionKey);
                } else {
                    decryptedPassword = this.decryptString(this.result.password, this.encryptionKey);
                }
                if (this.reqBody.currentPassword == decryptedPassword) {
                    this.changedUP(this.result);
                } else {
                    var error = this.errorResponse.InCorrectPasswordFailed;
                    this.callback(error, null);
                }
            }
        },
        changedUP: function (result) {

            if (!result) {
                var error = this.errorResponse.InCorrectPasswordFailed;
                this.callback(error, null);
            } else {
                this.routed = result;
                this.userName = result.userName;
                this.password = this.newPassword;
                this.customerName = this.routed.customerName;

                this.checkHandle = this.changePasswordComplete.bind(this);
                this.bankPolicyCheck(null, true);
            }
        },
        changePasswordComplete: function (err, result) {
            if (!result) {
                var error = this.errorResponse.PasswordComplianceFailed;
                this.callback(error, null);
            } else {

                var password = lastPasswordMethod(this.config, this.tnxId);
                this.resHandle = this.checkPasswordHistory.bind(this);
                var resHandle = this.getEncryptKey.bind(this);
                password.isPasswordInHistory(this.userId, this.newPassword, resHandle);
            }
        },
        checkPasswordHistory: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            if (this.finalResult) {
                var error = this.errorResponse.SamePasswordFailed;
                this.callback(error, null);
            } else {

                var password = lastPasswordMethod(this.config, this.tnxId);
                password.addPasswordHistory(this.userId, this.newPassword);

                this.routed.password = this.encryptString(this.newPassword, this.encryptionKey);
                this.routed.tempPassword = null;
                this.routed.isTemporaryPassword = false;
                this.routed.changePasswordOnNextLogin = false;
                this.routed.passwordChangedOn = (new Date());
                this.routed.save();
                this.callback(null, {
                    message: this.successResponse.ChangePassword,
                    nextStep: this.config.nextStepTo.goToLogout,
                    otpForService: 'changePassword'
                });

                var msgObj = {
                    userName: this.routed.userName,
                    customerName: this.routed.customerName
                };

                var mailGenerator = mailer(this.config, this.tnxId);
                var msg = mailGenerator.getEmailMsg(msgObj, 'changedPassword');

                var vfxRequestId = generateId();
                var requestId = generateId();
                var requestObj = {
                    config: this.config,
                    requestId: requestId,
                    vfxRequestId: vfxRequestId,
                    requestBody: {
                        "REQUEST_NAME": "AlertRq",
                        "INSTANCE": {
                            "alertType": 'OTHER',
                            "bankId": this.config.instId,
                            "customerId": this.routed.customerId,
                            "emailInd": true,
                            "smsInd": false,
                            "subject": "Login Credentials Changed",
                            "emailAddress": null,
                            "message": msg,
                            "userId": this.routed.userId,
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };

                if (this.utils.isSubUser(this.routed.createdBy, this.routed.originator)) {
                    requestObj.requestBody.INSTANCE.emailAddress = this.routed.emailId
                }

                var validateResponse = function (error, response) {
                };


                var ws = alertWS(requestObj, validateResponse);
                ws.requestVsoftAlertServer();

            }
        },
        statementsEnrollment: function (reqBody, callback) {
            this.callback = callback;
            this.accountNumbers = [];
            this.req = reqBody;
            this.routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
            var resHandle = this.userInformation.bind(this);
            mongo.FindOneMethod(resHandle);

        },
        sendDeactivateBankMail: function (result) {
            var bankMail = bankMailMethod(this.config, this.tnxId);
            bankMail.statementsDeEnrollments(result);
        },
        userInformation: function (err, result) {
            if (result == null) {

            } else {
                this.userDetails = result;

                var mongo = this.utils.initMongo(this.statementsEnrollmentModel, this.routed, this.tnxId);
                this.mongo = mongo;
                var resHandle = this.statementsEnrolled.bind(this);
                this.resHandle = resHandle;
                mongo.FindOneMethod(resHandle);
            }
        },
        sendBankMail: function (result) {
            var bankMail = bankMailMethod(this.config, this.tnxId);
            bankMail.statementsEnrollments(result);
        },
        statementsEnrolled: function (err, result) {
            this.accountNumber = this.req.accountNumber;
            if (result == null) {
                this.routed.accountNumbers = [];
                this.routed.accountNumbers.push({
                    accountNumber: this.req.accountNumber,
                    createdOn: new Date()
                });
                this.mongo.Save(this.routed);
                this.sendBankMail({
                    accountNumber: this.req.accountNumber,
                    userId: this.userDetails.userId,
                    customerName: this.userDetails.customerName,
                    userName: this.userDetails.userName,
                    EmailId: this.userDetails.emailId,
                    date: new Date()
                });
                var success = {
                    message: this.successResponse.statementsEnrollMsg
                }
                this.callback(null, success);
            } else {
                if (!_.contains(result.accountNumbers, this.req.accountNumber))
                    result.accountNumbers.push({
                        accountNumber: this.req.accountNumber,
                        createdOn: new Date()
                    });

                result.save();
                this.sendBankMail({
                    accountNumber: this.req.accountNumber,
                    userId: result.userId,
                    customerName: this.userDetails.customerName,
                    userName: this.userDetails.userName,
                    EmailId: this.userDetails.emailId,
                    date: new Date()
                });
                var success = {
                    message: this.successResponse.statementsEnrollMsg
                }
                this.callback(null, success);
            }
        },
        enrollmentList: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId
            };
            this.routedReq = routed;

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.customerInformation.bind(this);
            mongo.FindOneMethod(resHandle);

        },
        customerInformation: function (err, result) {
            if (result == null) {
                this.callback(null, {message: error});
            } else {
                this.customerInfo = result;
                var mongo = this.utils.initMongo(this.statementsEnrollmentModel, this.routedReq, this.tnxId);
                var resHandle = this.enrollmentListReturn.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        enrollmentListReturn: function (err, result) {
            if (result == null) {
                var error = this.errorResponse.NoRecordsFound;
                this.callback(null, {message: error});
            } else {
                this.callback(null, result);
            }
        },
        deEnrollAccountNumbers: function (reqBody, callback) {
            this.callback = callback;
            this.req = reqBody;
            this.routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, this.routed, this.tnxId);
            var resHandle = this.custDetails.bind(this);
            mongo.FindOneMethod(resHandle);


        },
        custDetails: function (err, result) {
            if (result == null) {

            } else {
                this.custDetailsInfo = result;
                var mongo = this.utils.initMongo(this.statementsEnrollmentModel, this.routed, this.tnxId);
                this.mongo = mongo;
                var resHandle = this.deleteList.bind(this);
                this.resHandle = resHandle;
                mongo.FindOneMethod(resHandle);
            }
        },
        deleteList: function (err, result) {
            if (result == null) {
                var error = this.errorResponse.NoRecordsFound;
                this.callback(null, {message: error});
            } else {
                var accList = result.accountNumbers;
                for (var accNum in this.req.accountNumbersList) {
                    this.sendDeactivateBankMail({
                        accountNumber: this.req.accountNumbersList[accNum],
                        userId: result.userId,
                        customerName: this.custDetailsInfo.customerName,
                        EmailId: this.custDetailsInfo.emailId,
                        userName: this.custDetailsInfo.userName,
                        date: new Date()
                    });
                    for (var i = 0; i < result.accountNumbers.length; i++) {
                        if (result.accountNumbers[i]['accountNumber'] == this.req.accountNumbersList[accNum]) {
//                            result.accountNumbers = result.accountNumbers.splice(i, 1);
                        }
                    }
                }
                result.save();
                var success = {
                    message: this.successResponse.statementsDeEnrollMsg
                }
                this.callback(null, success);
            }
        },
        changeSecurityQuestion: function (reqBody, callback) {
            this.callback = callback;

            this.securityQuestion = reqBody.securityQuestion;
            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.changedSQ.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        changedSQ: function (err, result) {
            this.resHandle = this.changedSQNext.bind(this);
            this.getEncryptKey(err, result);
        },
        changedSQNext: function (err, result) {
            this.encryptionKey = result.encryptionKey;
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                this.finalResult.securityQuestion = [{
                    questionId: this.securityQuestion[0].questionId,
                    answer: this.encryptString(this.securityQuestion[0].answer, this.encryptionKey),
                }, {
                    questionId: this.securityQuestion[1].questionId,
                    answer: this.encryptString(this.securityQuestion[1].answer, this.encryptionKey),
                }, {
                    questionId: this.securityQuestion[2].questionId,
                    answer: this.encryptString(this.securityQuestion[2].answer, this.encryptionKey),
                }, {
                    questionId: this.securityQuestion[3].questionId,
                    answer: this.encryptString(this.securityQuestion[3].answer, this.encryptionKey),
                }, {
                    questionId: this.securityQuestion[4].questionId,
                    answer: this.encryptString(this.securityQuestion[4].answer, this.encryptionKey),
                }];

                this.finalResult.save();
                this.callback(null, {
                    message: this.successResponse.UpdateSecurityQuestion,
                    otpForService: 'changeSecurityQuestion',
                    nextStep: this.config.nextStepTo.goToChangeSecurityQuestion
                });
            }
        },
        verifyEmailId: function (reqBody, callback) {
            this.req = reqBody;
            this.callback = callback;
            this.emailId = reqBody.emailId;
            var routed = {
                institutionId: this.config.instId,
                emailId: reqBody.emailId
            };
            routed.emailId = {
                $regex: '^' + reqBody.emailId + '$',
                $options: "i"
            }

            var isForgotUserNameCaptchaEnabled = this.config.captcha.client.forgotUsername;
            if (isForgotUserNameCaptchaEnabled) {
                var model = mongoModelName.modelName.Captcha;
                this.routed = routed;
                var mongo = this.utils.initMongo(model, {uuid: reqBody.uuid}, generateId());
                var resHandle = this.checkCaptchaForForgotUserName.bind(this);
                mongo.FindOneMethod(resHandle);
            }
            else {
                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var resHandle = this.verifyEmailIdHandle.bind(this);
                mongo.FindMethod(resHandle);
            }
        },
        verifyEmailIdHandle: function (err, result) {
            var error = this.errorResponse.EmailNotFoundFailed;
            if (result.length == 0) {
                this.callback(error, null);
            } else {
                this.callback(null, {message: this.successResponse.userIdSentMsg});

                for (var i = 0; i < result.length; i++) {
                    var sendObj = {
                        customerName: result[i]['customerName'],
                        userId: result[i]['userName']
                    };

                    var mailGenerator = mailer(this.config, this.tnxId);
                    var msg = mailGenerator.getEmailMsg(sendObj, 'forgottenUserId');

                    var vfxRequestId = generateId();
                    var requestId = generateId();
                    var requestObj = {
                        config: this.config,
                        requestId: requestId,
                        vfxRequestId: vfxRequestId,
                        requestBody: {
                            "REQUEST_NAME": "AlertRq",
                            "INSTANCE": {
                                "alertType": 'OTHER',
                                "bankId": this.config.instId,
                                "customerId": '0',
                                "emailInd": true,
                                "smsInd": false,
                                "emailAddress": result[i]['emailId'],
                                "subject": "Forgotten UserID",
                                "message": msg,
                                "userId": result[i].userId,
                                "requestId": requestId,
                                "vfxRequestId": vfxRequestId
                            }
                        }
                    };


                    var validateResponse = function (error, response) {
                    };


                    var ws = alertWS(requestObj, validateResponse);
                    ws.requestVsoftAlertServer();

                    /*var sendingTo = {
                     subject: 'Forgotten UserID',
                     emailId: result[i]['emailId']
                     };
                     var postOffice = messenger(this.config , this.tnxId);
                     postOffice.sendMessage(sendingTo, sendObj, 'forgottenUserId');*/
                }

            }
        },
        verifyFPOTP: function (reqBody, callback) {
            this.callback = callback;

            var otp = otpMethod(this.config, this.tnxId);
            var resHandle = this.redirectFPOTP.bind(this);
            otp.validateForgotPasswordOtp(reqBody, resHandle);
        },
        redirectFPOTP: function (err, result) {
            if (!result) {
                var error = this.errorResponse.IncorrectOTPFailed;
                this.callback(error, null);
            } else {
                this.validateSQ = result.requestData.securityQuestion;

                var routed = {
                    institutionId: this.config.instId,
                    userId: result.userId
                };

                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var resHandle = this.goToValidateSQ.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        goToValidateSQ: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                this.result = result;
                this.verifySQHandle();
            }
        },
        verifyUserSQ: function (reqBody, callback) {
            this.callback = callback;
            this.forgotData = reqBody;
            this.validateSQ = reqBody.securityQuestion;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.verifySQRedirect.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        verifySQRedirect: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                this.result = result;
                var otp = otpConfigHandler(this.config, this.tnxId);
                var resHandle = this.validateFPSQ.bind(this);
                otp.isOtpConfigAvailable('forgotPassword', resHandle);
            }
        },
        validateFPSQ: function (isOtpRequired, result) {
            if (isOtpRequired) {
                this.forgotData.otpData = result;
                this.forgotData.otpData["emailId"] = this.result.emailId;

                var otp = otpMethod(this.config, this.tnxId);
                otp.createForgotOTP(this.forgotData, this.callback);
            } else {
                this.verifySQHandle(null, result);
            }
        },
        verifySQHandle: function (err, result) {
            this.resHandle = this.verifySQHandle2.bind(this);
            this.getEncryptKey(err, result);
        },
        verifySQHandle2: function (err, result) {
            this.encryptionKey = result.encryptionKey;

            var incorrectFound = false;
            var userSQ = this.result.securityQuestion;

            for (var i = 0; i < this.validateSQ.length; i++) {
                var sqId = this.validateSQ[i].questionId;
                var answer = this.encryptString(this.validateSQ[i].answer, this.encryptionKey);
                var found = _.findWhere(userSQ, {questionId: sqId, answer: answer});
                if (typeof found == "undefined") incorrectFound = true;
            }

            if (incorrectFound) {
                error = this.errorResponse.UserSQValidationFailed;
                this.callback(error, null);
            } else {
                var bank = bankPolicyMethod(this.config, this.tnxId);
                this.result.customerName = this.result['customerName'];
                this.resHandle = this.completeVerifySQ.bind(this);
                var resHandle = this.getEncryptKey.bind(this);
                bank.getBankPolicy({}, resHandle);
            }
        },
        completeVerifySQ: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            if (!this.finalResult) this.finalResult = {};

            this.result.tempPassword = this.encryptString(this.createPassword(this.finalResult), this.encryptionKey);
            this.result.password = null;
            this.result.changePasswordOnNextLogin = true;
            this.result.passwordChangedOn = (new Date());
            this.result.isTemporaryPassword = true;
            this.result.status = "Verified";
            this.result.save();

            var lock = lockUserMethod(this.config, this.tnxId);
            lock.resetLoginCount(this.result.userId);

            this.callback(null, {
                message: this.successResponse.ResetPassword,
                otpForService: 'forgotPassword',
                nextStep: this.config.nextStepTo.goToForgotPassword
            });

            var sendObj = {
                customerName: this.result.customerName,
                password: this.decryptString(this.result.tempPassword, this.encryptionKey)
            };
            var sendingTo = {
                subject: 'New Password',
                emailId: this.result['emailId'],
                phoneNo: this.result['phoneNo']
            };

            // redirecting to alerts core
            var vfxRequestId = generateId();
            var requestId = generateId();
            var requestObj = {
                config: this.config,
                requestId: requestId,
                vfxRequestId: vfxRequestId,
                requestBody: {
                    "REQUEST_NAME": "AlertRq",
                    "INSTANCE": {
                        "alertType": 'OTHER',
                        "bankId": this.result.institutionId,
                        "customerId": this.result.customerId,
                        "emailInd": true,
                        "smsInd": false,
                        "subject": "Forgotten Password",
                        "message": '<p>Dear ' + sendObj.customerName + ',</p><p>As per your request we have reset your password. Your new password is <b>' + sendObj.password + '</b><br/><br/>For security reasons we recommend you not to share your password with anyone including bank staff. You are requested to change this password on login.</p><br/>',
                        "userId": this.result.userId,
                        "requestId": requestId,
                        "vfxRequestId": vfxRequestId
                    }
                }
            };
            if (this.utils.isSubUser(this.result.createdBy, this.result.originator)) {
                requestObj.requestBody.INSTANCE.emailAddress = this.result.emailId;
                requestObj.requestBody.INSTANCE.phoneNo = this.result.contact.phoneNo;
            }

            var validateResponse = function (error, response) {
            };

            var ws = alertWS(requestObj, validateResponse);
            ws.requestVsoftAlertServer();


        },
        securityQuestionMFA: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId
            };

            var fields = 'userId userName securityQuestion.questionId';
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId, fields);
            var resHandle = this.MFARandomQ.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        MFARandomQ: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                var sqSample = _.sample(result.securityQuestion, 2);
                //----------------------//
                var secretQuestions = this.config.secretQuestions[this.config.setLang]
                var secretQuestionsList = null || [];
                for (var data in secretQuestions) {
                    secretQuestionsList = secretQuestionsList.concat(this.config.secretQuestions[this.config.setLang][data]);
                }
                for (var i = 0; i < secretQuestionsList.length; i++) {
                    if (secretQuestionsList[i].SNo == sqSample[0].questionId) {
                        sqSample[0] = JSON.parse(JSON.stringify(sqSample[0]));
                        sqSample[0]["question"] = secretQuestionsList[i].Question;
                    }
                    if (secretQuestionsList[i].SNo == sqSample[1].questionId) {
                        sqSample[1] = JSON.parse(JSON.stringify(sqSample[1]));
                        sqSample[1].question = secretQuestionsList[i].Question;
                    }
                }
//----------------------//
                this.callback(null, {userId: result.userId, securityQuestion: sqSample});
            }
        },
        verifyMFAQuestion: function (reqBody, callback) {
            this.rememberDevice = reqBody.rememberDevice;
            this.reqBody = reqBody;
            this.callback = callback;

            this.validateSQ = reqBody.securityQuestion;

            var routed = {
                institutionId: this.config.instId
            };
            var mongo = this.utils.initMongo(this.initmodel, routed, this.tnxId);
            var resHandle = this.checkSecurityAnswerCaseSensitive.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        checkSecurityAnswerCaseSensitive: function (err, result) {
            this.bankPolicy = result
            var routed = {
                institutionId: this.config.instId,
                userId: this.reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.MFAQuestionHandle.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        MFAQuestionHandle: function (err, result) {
            this.resHandle = this.MFAQuestionHandle2.bind(this);
            this.getEncryptKey(err, result);
        },
        MFAQuestionHandle2: function (err, result) {
            this.encryptionKey = result.encryptionKey;

            var error = this.errorResponse.UserNotFoundFailed;
            if (!result) {
                this.callback(error, null);
            } else {

                var userSQ = this.finalResult.securityQuestion;
                var sqId1 = this.validateSQ[0].questionId;
                var answer1 = this.validateSQ[0].answer;
                var sqId2 = this.validateSQ[1].questionId;
                var answer2 = this.validateSQ[1].answer;
                var found1, found2;

                var isSecurityAnswerCaseSensitive = true;
                if (this.bankPolicy.authRestrictions == undefined || typeof(this.bankPolicy.authRestrictions.isSecurityAnswerCaseSensitive) != 'boolean') {
                    if (this.config.isSecurityAnswerCaseSensitive != undefined) {
                        isSecurityAnswerCaseSensitive = this.config.isSecurityAnswerCaseSensitive;
                    }
                } else if (this.bankPolicy.authRestrictions != undefined && typeof(this.bankPolicy.authRestrictions.isSecurityAnswerCaseSensitive) == 'boolean') {
                    isSecurityAnswerCaseSensitive = this.bankPolicy.authRestrictions.isSecurityAnswerCaseSensitive;
                }
                if (isSecurityAnswerCaseSensitive) {
                    found1 = _.findWhere(userSQ, {
                        questionId: sqId1,
                        answer: this.encryptString(answer1, this.encryptionKey)
                    });
                    found2 = _.findWhere(userSQ, {
                        questionId: sqId2,
                        answer: this.encryptString(answer2, this.encryptionKey)
                    });
                } else {
                    var q1 = _.findWhere(userSQ, {questionId: sqId1});
                    var q2 = _.findWhere(userSQ, {questionId: sqId2});
                    var a1 = this.decryptString(q1.answer, this.encryptionKey);
                    var a2 = this.decryptString(q2.answer, this.encryptionKey);
                    if (a1.toLowerCase() == answer1.toLowerCase()) {
                        found1 = true
                    }
                    if (a2.toLowerCase() == answer2.toLowerCase()) {
                        found2 = true
                    }
                }

                if (!found1 || !found2) {
                    error = this.errorResponse.UserSQValidationFailed;
                    error.nextStep = this.config.nextStepTo.goToLogout;
                    this.callback(error, null);
                } else {
                    var xFactor = null;
                    var responseObj = {
                        message: '',
                        'x-factor': {},
                        nextStep: this.config.nextStepTo.goToAccountOverview,
                        otpForService: 'multiFactorAuthentication'
                    }
                    if (this.rememberDevice == 'true' || this.rememberDevice == true) {
                        xFactor = this.randomString(64);
                        this.finalResult.lastLoginXFactorCollection.push(xFactor);
                        responseObj['x-factor'][this.finalResult.userName] = xFactor;
                    }
                    this.finalResult.save();
                    this.callback(null, responseObj);
                }
            }
        },
        randomString: function (length) {
            return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
        },
        getAllUserSQ: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId
            };

            var fields = 'userId userName securityQuestion';
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId, fields);
            var resHandle = this.userAllSQList.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        userAllSQList: function (err, result) {
            this.resHandle = this.userAllSQList2.bind(this);
            this.getEncryptKey(err, result);
        },
        userAllSQList2: function (err, result) {
            this.encryptionKey = result.encryptionKey;
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                this.finalResult.securityQuestion = [{
                    questionId: this.finalResult.securityQuestion[0].questionId,
                    answer: this.decryptString(this.finalResult.securityQuestion[0].answer, this.encryptionKey),
                }, {
                    questionId: this.finalResult.securityQuestion[1].questionId,
                    answer: this.decryptString(this.finalResult.securityQuestion[1].answer, this.encryptionKey),
                }, {
                    questionId: this.finalResult.securityQuestion[2].questionId,
                    answer: this.decryptString(this.finalResult.securityQuestion[2].answer, this.encryptionKey),
                }, {
                    questionId: this.finalResult.securityQuestion[3].questionId,
                    answer: this.decryptString(this.finalResult.securityQuestion[3].answer, this.encryptionKey),
                }, {
                    questionId: this.finalResult.securityQuestion[4].questionId,
                    answer: this.decryptString(this.finalResult.securityQuestion[4].answer, this.encryptionKey),
                }];
                this.callback(null, {
                    userId: this.finalResult.userId,
                    securityQuestions: this.finalResult.securityQuestion
                });
            }
        },
        getUserSQ: function (reqBody, callback) {
            this.req = reqBody;
            this.callback = callback;
            var routed = {
                institutionId: this.config.instId
            };

            var isForgotPwdCaptchaEnabled = this.config.captcha.client.forgotPassword;
            if (isForgotPwdCaptchaEnabled) {
                var model = mongoModelName.modelName.Captcha;
                this.routed = routed;
                var mongo = this.utils.initMongo(model, {uuid: this.req.uuid}, generateId());
                var resHandle = this.checkCaptchaForForgotPwd.bind(this);
                mongo.FindOneMethod(resHandle);
            }
            else {
                var mongo = this.utils.initMongo(this.initmodel, routed, this.tnxId);
                var resHandle = this.checkUserIdCaseSensitive.bind(this);
                mongo.FindOneMethod(resHandle);
            }


        },

        checkUserIdCaseSensitive: function (err, result) {
            var reqBody = this.req;
            var routed = {};
            var isUserNameCaseSensitive = true;
            if (result.authRestrictions == undefined || typeof(result.authRestrictions.isUserNameCaseSensitive) != 'boolean') {
                if (this.config.isUserNameCaseSensitive != undefined) {
                    isUserNameCaseSensitive = this.config.isUserNameCaseSensitive;
                }
            } else if (result.authRestrictions != undefined && typeof(result.authRestrictions.isUserNameCaseSensitive) == 'boolean') {
                isUserNameCaseSensitive = result.authRestrictions.isUserNameCaseSensitive;
            }

            if (isUserNameCaseSensitive) {
                routed.institutionId = this.config.instId;
                routed.userName = reqBody.userName;
            } else {
                routed.institutionId = this.config.instId;
                routed.userName = {
                    $regex: '^' + reqBody.userName + '$',
                    $options: "i"
                }
            }
            var fields = 'userId userName securityQuestion.questionId firstLogin';
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId, fields);
            var resHandle = this.userSQList.bind(this);
            mongo.FindOneMethod(resHandle);

        },

        userSQList: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                if (result.firstLogin) {
                    this.callback(this.errorResponse.UserNotEnrolledFailed, null);
                    return true;
                }
                if (result.securityQuestion.length == 0) {
                    this.callback(null, this.errorResponse.SecurityQuestionsPasswordReset);
                    return true;
                }

                var sqSample = _.sample(result.securityQuestion, 2);
                //----------------------//
                var secretQuestions = this.config.secretQuestions[this.config.setLang]
                var secretQuestionsList = null || [];
                for (var data in secretQuestions) {
                    secretQuestionsList = secretQuestionsList.concat(this.config.secretQuestions[this.config.setLang][data]);
                }
                for (var i = 0; i < secretQuestionsList.length; i++) {
                    if (secretQuestionsList[i].SNo == sqSample[0].questionId) {
                        sqSample[0] = JSON.parse(JSON.stringify(sqSample[0]));
                        sqSample[0]["question"] = secretQuestionsList[i].Question;
                    }
                    if (secretQuestionsList[i].SNo == sqSample[1].questionId) {
                        sqSample[1] = JSON.parse(JSON.stringify(sqSample[1]));
                        sqSample[1].question = secretQuestionsList[i].Question;
                    }
                }
//----------------------//
                this.callback(null, {userId: result.userId, securityQuestions: sqSample});
            }
        },
        changeUserName: function (userName, callback) {
            var routed = {
                institutionId: this.config.instId,
                userName: userName
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.FindOneMethod(callback);
        },
        changedAfterPI: function (err, result) {
            if (!result) {
                this.changePIObj.userName = this.userName;
                this.changePIObj.save();
                this.changePIResponse.nextStep = this.config.nextStepTo.goToLogout;

                this.sendUpdatedInfoEmail();
                this.callback(null, this.changePIResponse);
            } else {
                var error = this.errorResponse.UserExistsFailed;
                this.callback(error, null);
            }
        },
        changedAfterFTLNoUserCheck: function (err, result) {
            if (result) {
                this.routed.password = this.password;
                this.routed.securityQuestion = this.securityQuestion;
                this.routed.firstLogin = false;
                this.routed.isTemporaryPassword = false;
                this.routed.status = this.config.status.Verified;
                this.routed.changePasswordOnNextLogin = false;
                this.routed.passwordChangedOn = (new Date());
                this.resHandle = this.changedAfterFTLNoUserCheckNext.bind(this);
                this.getEncryptKey(err, null);
            } else {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            }
        },
        changedAfterFTLNoUserCheckNext: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            this.routed.password = this.encryptString(this.password, this.encryptionKey);
            this.routed.securityQuestion = [{
                questionId: this.securityQuestion[0].questionId,
                answer: this.encryptString(this.securityQuestion[0].answer, this.encryptionKey),
            }, {
                questionId: this.securityQuestion[1].questionId,
                answer: this.encryptString(this.securityQuestion[1].answer, this.encryptionKey),
            }, {
                questionId: this.securityQuestion[2].questionId,
                answer: this.encryptString(this.securityQuestion[2].answer, this.encryptionKey),
            }, {
                questionId: this.securityQuestion[3].questionId,
                answer: this.encryptString(this.securityQuestion[3].answer, this.encryptionKey),
            }, {
                questionId: this.securityQuestion[4].questionId,
                answer: this.encryptString(this.securityQuestion[4].answer, this.encryptionKey),
            }];

            this.routed.save();

            var password = lastPasswordMethod(this.config, this.tnxId);
            password.addPasswordHistory(this.userId, this.routed.password);

            this.callback(null, this.changeFTLResponse);

        },
        changedAfterFTLNext: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            this.routed.password = this.encryptString(this.password, this.encryptionKey);
            this.routed.securityQuestion = [{
                questionId: this.securityQuestion[0].questionId,
                answer: this.encryptString(this.securityQuestion[0].answer, this.encryptionKey),
            }, {
                questionId: this.securityQuestion[1].questionId,
                answer: this.encryptString(this.securityQuestion[1].answer, this.encryptionKey),
            }, {
                questionId: this.securityQuestion[2].questionId,
                answer: this.encryptString(this.securityQuestion[2].answer, this.encryptionKey),
            }, {
                questionId: this.securityQuestion[3].questionId,
                answer: this.encryptString(this.securityQuestion[3].answer, this.encryptionKey),
            }, {
                questionId: this.securityQuestion[4].questionId,
                answer: this.encryptString(this.securityQuestion[4].answer, this.encryptionKey),
            }];

            this.routed.save();
            var password = lastPasswordMethod(this.config, this.tnxId);
            password.addPasswordHistory(this.userId, this.routed.password);

            this.callback(null, this.changeFTLResponse);

            var msgObj = {
                userName: this.routed.userName,
                customerName: this.routed.customerName
            };

            var mailGenerator = mailer(this.config, this.tnxId);
            var msg = mailGenerator.getEmailMsg(msgObj, 'changedFTL');

            var vfxRequestId = generateId();
            var requestId = generateId();
            var requestObj = {
                config: this.config,
                requestId: requestId,
                vfxRequestId: vfxRequestId,
                requestBody: {
                    "REQUEST_NAME": "AlertRq",
                    "INSTANCE": {
                        "alertType": 'OTHER',
                        "bankId": this.config.instId,
                        "customerId": this.routed.customerId,
                        "emailInd": true,
                        "smsInd": false,
                        "emailAddress": null,
                        "subject": "Login Credentials Changed",
                        "message": msg,
                        "userId": this.routed.userId,
                        "requestId": requestId,
                        "vfxRequestId": vfxRequestId
                    }
                }
            };

            if (this.utils.isSubUser(this.routed.createdBy, this.routed.originator)) {
                requestObj.requestBody.INSTANCE.emailAddress = this.routed.emailId
            }

            var validateResponse = function (error, response) {
            };


            var ws = alertWS(requestObj, validateResponse);
            ws.requestVsoftAlertServer();
        },
        changedAfterFTL: function (err, result) {
            if (!result) {
                this.routed.userName = this.userName;
                this.routed.securityQuestion = this.securityQuestion;
                this.routed.firstLogin = false;
                this.routed.isTemporaryPassword = false;
                this.routed.changePasswordOnNextLogin = false;
                this.routed.passwordChangedOn = (new Date());
                this.routed.status = this.config.status.Verified;
                this.resHandle = this.changedAfterFTLNext.bind(this);
                this.getEncryptKey(err, null);
            } else {
                var error = this.errorResponse.UserExistsFailed;
                this.callback(error, null);
            }
        },
        changePersonalInfo: function (reqBody, callback) {
            this.callback = callback;

            this.reqBody = reqBody;
            this.userName = reqBody.userName;
            this.emailId = reqBody.emailId;
            this.changeInfo = reqBody.changeInfo;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.changedPInfo.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        changedPInfo: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                this.changePIObj = result;
                this.changePIResponse = {
                    message: this.successResponse.ChangePersonalInformation,
                    nextStep: this.config.nextStepTo.doNothing
                };
                if (this.emailId != "") this.changePIObj.emailId = this.emailId;
                if (this.userName != this.changePIObj.userName) {
                    var changeHandler = this.changeUserName.bind(this);
                    var resHandle = this.changedAfterPI.bind(this);
                    changeHandler(this.userName, resHandle);
                } else {
                    this.changePIObj.save();
                    this.sendUpdatedInfoEmail();
                    this.callback(null, this.changePIResponse);
                }
            }
        },
        sendUpdatedInfoEmail: function () {
            if (this.changeInfo) {
                /*var sendingTo = {
                 subject: 'Update Personal Info'
                 };
                 var postOffice = messenger(this.config, this.tnxId);
                 postOffice.sendMessage(sendingTo, this.reqBody, 'updateInfo');

                 */

                var mailGenerator = mailer(this.config, this.tnxId);
                var msg = mailGenerator.getEmailMsg(this.reqBody, 'updateInfo');

                var vfxRequestId = generateId();
                var requestId = generateId();
                var requestObj = {
                    config: this.config,
                    requestId: requestId,
                    vfxRequestId: vfxRequestId,
                    requestBody: {
                        "REQUEST_NAME": "AlertRq",
                        "INSTANCE": {
                            "alertType": 'OTHER',
                            "bankId": this.config.instId,
                            "customerId": '0',
                            "emailInd": true,
                            "smsInd": false,
                            "emailAddress": this.config.customerDataInfoSendTo,
                            "subject": "Update Personal Info",
                            "message": msg,
                            "userId": this.changePIObj.userId,
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };


                var validateResponse = function (error, response) {
                };


                var ws = alertWS(requestObj, validateResponse);
                ws.requestVsoftAlertServer();

                var bankMail = bankMailMethod(this.config, this.tnxId);
                bankMail.addChangePersonalInfo(this.reqBody);
            } else {
                this.utils.log(this.tnxId, 'Nothing was changed for personal info, no email will be sent', 'console.log');
            }
        },
        checkAvailability: function (reqBody, callback) {
            this.callback = callback;

            this.userName = reqBody.userName;

            var routed = {
                institutionId: this.config.instId,
                userName: {
                    $regex: '^' + reqBody.userName + '$',
                    $options: "i"
                }
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.UNameAvailable.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        UNameAvailable: function (err, result) {
            if (!result) {
                this.callback(null, {availability: true, message: 'User ID  ' + this.userName + ' is available'});
            } else {
                this.callback(null, {availability: false, message: 'User ID ' + this.userName + ' already exists'});
            }
        },
        listCreatedUser: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                createdBy: reqBody.userId
            };

            var fields = 'userId emailId customerId customerName userName contact customerType privilege defaultScreen securityQuestion status';
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId, fields);
            var resHandle = this.usersFound.bind(this);
            mongo.FindMethod(resHandle);
        },
        usersFound: function (err, result) {
            if (err) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null, result);
            }
        },
        changeTransactionLimit: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;

            this.limitsAvailable = this.checkValidLimits(reqBody.userLimits);
            this.transactionLimit = reqBody.userLimits;
            // if(this.reqBody.userLimits.fundsLimits.fundsLimitPerDay != 0 ) {
                var routed = {
                    userId: reqBody.listedUserId,
                    bankId: this.config.instId,
                    "instructions.amount":{
                        $gt : reqBody.userLimits.fundsLimits.fundsLimitPerDay
                    },
                    "instructions.endDate":{
                        "$gte": moment().toDate()
                    }
                };
                var mongo = this.utils.initMongo(this.transferInstructionModel, routed, this.tnxId);
                var resHandle = this.transactionLimitChangesNext.bind(this);
                mongo.FindOneMethod(resHandle);

            // } else {
            //     this.transactionLimitChangesDo();
            // }
        },
        transactionLimitChangesNext: function (err, result) {
           if (result){
                var error = this.errorResponse.TransferAlreadyExistForGreaterAmount;
                this.callback(error, null);
           } else {
               this.transactionLimitChangesDo();
           }
        },
        transactionLimitChangesDo : function(){
            var routed = {
                institutionId: this.config.instId,
                userId: this.reqBody.listedUserId,
                createdBy: this.reqBody.userId
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.transactionLimitChanges.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        transactionLimitChanges: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                result.privilege.limits = this.transactionLimit;
                result.limitsAvailable = this.limitsAvailable;
                result.save();
                this.callback(null, {message: this.successResponse.ChangeTransactionLimit});
            }
        },
        changeAccountAccess: function (reqBody, callback) {
            this.callback = callback;

            this.access = reqBody.accountAccess;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.listedUserId,
                createdBy: reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.accountAccessChanges.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        accountAccessChanges: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                var accountsAccessOld = result.privilege.access.accountsAccess;
                var accountsAccessNew = this.access.accountsAccess;

                for (var i = 0; i < accountsAccessNew.length; i++) {
                    for (var j = 0; j < accountsAccessOld.length; j++) {
                        if (accountsAccessNew[i].accountNo == accountsAccessOld[j].accountNo) {
                            accountsAccessOld[j].existInNew = true;
                        }
                    }
                }
                for (var j = 0; j < accountsAccessOld.length; j++) {
                    if (!accountsAccessOld[j].existInNew) {
                        var vfxRequestId = generateId();
                        var requestId = generateId();
                        var requestObj = {
                            config: this.config,
                            requestId: requestId,
                            vfxRequestId: vfxRequestId,
                            requestBody: {
                                "REQUEST_NAME": "AlertSubUserDeleteRq",
                                "INSTANCE": {
                                    "bankId": result.institutionId,
                                    "customerId": result.customerId,
                                    "emailAddress": result.emailId,
                                    "accountNo": accountsAccessOld[j].accountNo,
                                    "userId": result.userId,
                                    "requestId": requestId,
                                    "vfxRequestId": vfxRequestId
                                }
                            }
                        };
                        var validateResponse = function (error, response) {

                        };
                        var ws = alertWS(requestObj, validateResponse);
                        ws.requestVsoftAlertServer();

                    }
                }

                result.privilege.access = this.access;
                result.save();
                this.callback(null, {message: this.successResponse.ChangeAccountAccess});
            }
        },
        changeSubuserProfile: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;

            var routed = {
                institutionId: this.config.instId,
                userId: this.reqBody.listedUserId,
                createdBy: this.reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.subuserProfileChanges.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        subuserProfileChanges: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                this.oldEmailId = result.emailId;
                this.userId = result.userId;
                this.oldMobileNo = result.contact.mobileNo;
                result.emailId = this.reqBody.emailId;
                result.customerName = this.reqBody.custName;
                result.contact = {
                    mobileNo: this.reqBody.mobileNo,
                    phoneNo: this.reqBody.mobileNo
                };
                var resHandle = this.subuserProfileChangesDone.bind(this);
                result.save(resHandle);
            }
        },
        subuserProfileChangesDone: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null, {message: this.successResponse.ChangeProfile});

                var vfxRequestId = generateId();
                var requestId = generateId();
                var requestObj = {
                    config: this.config,
                    requestId: requestId,
                    vfxRequestId: vfxRequestId,
                    requestBody: {
                        "REQUEST_NAME": "AlertSubUserEditRq",
                        "INSTANCE": {
                            "bankId": result.institutionId,
                            "customerId": result.customerId,
                            "oldEmailAddress": this.oldEmailId,
                            "newEmailAddress": this.reqBody.emailId,
                            "phoneNo": this.reqBody.mobileNo,
                            "userId": this.reqBody.listedUserId,
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };
                var validateResponse = function (error, response) { };
                var ws = alertWS(requestObj, validateResponse);
                ws.requestVsoftAlertServer();

            }
        },
        changePrivileges: function (reqBody, callback) {
            this.callback = callback;

            this.userViews = reqBody.userViewAccess;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.listedUserId,
                createdBy: reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.privilegeChanges.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        privilegeChanges: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                result.privilege.userViews = this.userViews;
                var resHandle = this.privilegeChangesX.bind(this);
                result.save(resHandle);
            }
        },
        privilegeChangesX: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null, {message: this.successResponse.ChangeUserView});
            }
        },
        userSQChangeBySupervisor: function (reqBody, callback) {
            this.callback = callback;

            this.securityQuestion = reqBody.securityQuestion;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.listedUserId,
                createdBy: reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.changedSQ.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        reactivateUser: function (reqBody, callback) {
            this.callback = callback;

            this.listedUserId = reqBody.listedUserId;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.listedUserId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.reactivateUserNext.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        reactivateUserNext: function (err, result) {

            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                if (result.firstLogin) {
                    result.status = "Not Enrolled";
                } else {
                    result.status = "Verified";
                }
                var resHandle = this.reactivateUserDone.bind(this);
                result.save(resHandle);
            }
        },
        reactivateUserDone: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                var success = {
                    message: this.successResponse.ReactivateUser
                };
                this.callback(null, success);
            }
        },
        userDeleteBySupervisor: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;

            this.listedUserId = reqBody.listedUserId;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.listedUserId
                //createdBy                   : reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.removeUserComplete.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        removeUserComplete: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error, null);
            } else {
                var reqBody = result;
                this.seletedUserDetails = result;


                var vfxRequestId = generateId();
                var requestId = generateId();
                var requestObj = {
                    config: this.config,
                    requestId: requestId,
                    vfxRequestId: vfxRequestId,
                    requestBody: {
                        "REQUEST_NAME": "AlertSubUserDeleteRq",
                        "INSTANCE": {
                            "bankId": result.institutionId,
                            "customerId": result.customerId,
                            "emailAddress": result.emailId,
                            "userId": result.userId,
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };
                var validateResponse = function (error, response) {

                };
                var ws = alertWS(requestObj, validateResponse);
                ws.requestVsoftAlertServer();

                var routed = {
                    institutionId: this.config.instId,
                    createdBy: result.userId
                }
                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var resHandle = this.findAllSubUser.bind(this);
                mongo.FindMethod(resHandle);

                this.callback(null, {message: reqBody.userName + this.successResponse.RemoveUser});
            }
        },
        findAllSubUser : function(err,result){
            this.seletedUserSubUsersDetails = result;
            for(var i = 0 ; i < result.length ; i++){

                var vfxRequestId = generateId();
                var requestId = generateId();
                var requestObj = {
                    config: this.config,
                    requestId: requestId,
                    vfxRequestId: vfxRequestId,
                    requestBody: {
                        "REQUEST_NAME": "AlertSubUserDeleteRq",
                        "INSTANCE": {
                            "bankId": result.institutionId,
                            "customerId": result.customerId,
                            "emailAddress": result.emailId,
                            "userId": result.userId,
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };
                var validateResponse = function (error, response) {

                };
                var ws = alertWS(requestObj, validateResponse);
                ws.requestVsoftAlertServer();
            }
            var resHandle = this.getUserAlerts.bind(this);
            var alert = alertMethod(this.config , this.tnxId);
            var reqBody = {
                userId : this.reqBody.listedUserId,
                customersId : this.seletedUserDetails.customerId
            };
            alert.listAlerts(reqBody , resHandle);
        },
        getUserAlerts : function(err,result){
            var alertList = [];
            if(result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    alertList.push({alertId: result[i].alertId})
                }
                var alert = alertMethod(this.config, this.tnxId);
                var reqBody = {
                    userId: this.reqBody.listedUserId,
                    alertList: alertList
                };
                alert.deleteAlerts(reqBody, null);
            }
            this.getSubUsersAlerts();
        },
        getSubUsersAlerts : function () {
            this.SubUsersAlertsList = null || [];
            this.SubUsersAlertsListIndex = 0;
            for(var i = 0 ; i < this.seletedUserSubUsersDetails.length; i++) {
                var resHandle = this.getSubUsersAlertsNext.bind(this);
                var alert = alertMethod(this.config , this.tnxId);
                var reqBody = {
                    userId : this.seletedUserSubUsersDetails[i].userId,
                    customersId : this.seletedUserSubUsersDetails[i].customerId
                };
                alert.listAlerts(reqBody , resHandle);
            }
            if(this.seletedUserSubUsersDetails.length == 0){
                this.getSubUsersAlertsNext(null,[]);
            }
        },
        getSubUsersAlertsNext : function(err,result){
            if(this.seletedUserSubUsersDetails.length > 0) {
                this.SubUsersAlertsListIndex++;
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        this.SubUsersAlertsList.push({alertId: result[i].alertId})
                    }
                }
            }
            if(this.SubUsersAlertsListIndex == this.seletedUserSubUsersDetails.length){
                this.deleteSubUsersAlerts();
            }
        },
        deleteSubUsersAlerts : function () {
            if(this.SubUsersAlertsList.length > 0) {
                var alert = alertMethod(this.config , this.tnxId);
                var reqBody = {
                    userId: this.reqBody.listedUserId,
                    alertList: this.SubUsersAlertsList
                };
                var resHandle = this.deleteUserThirdPartyTransferMoneyReciepients.bind(this);
                alert.deleteAlerts(reqBody, resHandle);
            } else {
                this.deleteUserThirdPartyTransferMoneyReciepients();
            }
        },
        deleteUserThirdPartyTransferMoneyReciepients : function(err,result){
            var routed = {
                institutionId : this.config.instId,
                userId : this.seletedUserDetails.userId
            };
            var mongo = this.utils.initMongo(this.thirdPartyBeneficiaryModel, routed, this.tnxId);
            var resHandle = this.deleteSubUserThirdPartyTransferMoneyReciepients.bind(this);
            mongo.FindMethod(resHandle);
        },
        deleteSubUserThirdPartyTransferMoneyReciepients : function(err,result){
            for(var i = 0 ; i < result.length; i++) {
                result[i].remove()
            }
            var userId = [];
            for(var i = 0 ; i < this.seletedUserSubUsersDetails.length; i++) {
                userId.push(this.seletedUserSubUsersDetails[i].userId);
            }
            var routed = {
                institutionId: this.config.instId,
                userId: {"$in":userId}
            };
            var mongo = this.utils.initMongo(this.thirdPartyBeneficiaryModel, routed, this.tnxId);
            var resHandle = this.deleteUserTransferInstruction.bind(this);
            mongo.FindMethod(resHandle);
        },
        deleteUserTransferInstruction : function(err,result){
            for(var i = 0 ; i < result.length; i++) {
                result[i].remove()
            }
            var routed = {
                bankId : this.config.instId,
                userId : this.seletedUserDetails.userId
            };
            var mongo = this.utils.initMongo(this.transferInstructionModel, routed, this.tnxId);
            var resHandle = this.deleteSubUserTransferInstruction.bind(this)
            mongo.FindMethod(resHandle);
        },
        deleteSubUserTransferInstruction : function(err,result) {
            if(result) {
                for(var i = 0 ; i < result.length; i++) {
                    result[i].remove()
                }
            }
            var userId = [];
            for(var i = 0 ; i < this.seletedUserSubUsersDetails.length; i++) {
                userId.push(this.seletedUserSubUsersDetails[i].userId);
            }
            var routed = {
                bankId: this.config.instId,
                userId: {"$in":userId}
            };
            var mongo = this.utils.initMongo(this.transferInstructionModel, routed, this.tnxId);
            var resHandle = this.deleteUsers.bind(this)
            mongo.FindMethod(resHandle);
        },
        deleteUsers : function (err,result) {
            for(var i = 0 ; i < result.length; i++) {
                result[i].remove()
            }
            if(this.config.isUserPhysicalDelete){
                this.seletedUserDetails.remove();
            } else {
                this.seletedUserDetails.status = "Deleted";
                this.seletedUserDetails.save();
            }
            for(var i = 0 ; i < this.seletedUserSubUsersDetails.length; i++) {
                if (this.config.isUserPhysicalDelete) {
                    this.seletedUserSubUsersDetails[i].remove();
                } else {
                    this.seletedUserSubUsersDetails[i].status = "Deleted";
                    this.seletedUserSubUsersDetails[i].save()
                }
            }
        },
        /*deleteUserWireReciepients : function(err,result){
            var routed = {
                institutionId : this.config.instId,
                userId : this.seletedUserDetails.userId
            };
            var mongo = this.utils.initMongo(this.beneficiaryModel, routed, this.tnxId);
            mongo.Remove();
            this.deleteSubUserWireReciepients()
        },
        deleteSubUserWireReciepients : function(){
            for(var i = 0 ; i < this.seletedUserSubUsersDetails.length; i++) {
                var routed = {
                    institutionId: this.config.instId,
                    userId: this.seletedUserSubUsersDetails[i].userId
                };
                var mongo = this.utils.initMongo(this.beneficiaryModel, routed, this.tnxId);
                mongo.Remove();
            }
            this.;//NEXT DELETE
        },*/
        // logic for date validation and to get next date.


        is_year_valid: function (year) {
            if (year > 1582)
                return true;
            return false;
        },

        is_leap_year: function (year) {
            if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))
                return true;
            return false;
        },

        is_month_valid: function (month) {
            return month >= 1 && month <= 12;
        },

        days_in_month: function (month, year) {
            if (month == 2)
                return this.is_leap_year(year) ? 29 : 28;
            else if (month == 4 || month == 6 || month == 9 || month == 11) {
                return 30;
            } else {
                return 31;
            }
        },
        is_day_valid: function (year, month, day) {
            if (day == 0) {
                return false;
            }

            if (month == 2) {
                if (this.is_leap_year(year)) {
                    return day <= 29;
                } else {
                    return day <= 28;
                }
            } else if (month == 4 || month == 6 || month == 9 || month == 11) {
                return day <= 30;
            } else {
                return day <= 31;
            }
        },
        is_date_valid: function (year, month, day) {
            return this.is_year_valid(year) && this.is_month_valid(month) && this.is_day_valid(year, month, day);
        },
        addZeroToDateOrMonth: function (arr) {
            if (arr[1].length == 1)
                arr[1] = '0' + arr[1].toString();
            if (arr[2].length == 1)
                arr[2] = '0' + arr[2].toString();
            return arr;
        },
        getNextDay: function (year, month, day) {
            if (this.is_date_valid(year, month, day)) {
                if (month == 2) {
                    if (this.is_leap_year(year)) {
                        if (day == 29) {
                            var nextDay = 1;
                            var nextMonth = +month + 1;
                            var nextYear = year;
                        } else {
                            var nextDay = +day + 1;
                            var nextMonth = month;
                            var nextYear = year;
                        }
                        var arr = this.addZeroToDateOrMonth([nextYear, nextMonth.toString(), nextDay.toString()]);
                        return arr.join('-');

                    } else {
                        if (day == 28) {
                            var nextDay = 1;
                            var nextMonth = +month + 1;
                            var nextYear = year;
                        } else {
                            var nextDay = +day + 1;
                            var nextMonth = month;
                            var nextYear = year;
                        }
                        var arr = this.addZeroToDateOrMonth([nextYear, nextMonth.toString(), nextDay.toString()]);
                        return arr.join('-');
                    }
                } else if (month == 4 || month == 6 || month == 9 || month == 11) {
                    if (day == 30) {
                        var nextDay = 1;
                        var nextMonth = +month + 1;
                        var nextYear = year;
                    } else {
                        var nextDay = +day + 1;
                        var nextMonth = month;
                        var nextYear = year;
                    }
                    var arr = this.addZeroToDateOrMonth([nextYear, nextMonth.toString(), nextDay.toString()]);
                    return arr.join('-');
                } else {
                    if (day == 31) {
                        var nextDay = 1;
                        var nextMonth = month;
                        if (month == 12) {
                            var nextMonth = 1;
                            var nextYear = +year + 1;
                        }
                        else
                            var nextYear = year;
                    } else {
                        var nextDay = +day + 1;
                        var nextMonth = month;
                        var nextYear = year;
                    }

                    var arr = this.addZeroToDateOrMonth([nextYear, nextMonth.toString(), nextDay.toString()]);
                    return arr.join('-');
                }
            }
        },


        searchForAdmin: function (reqBody, callback) {
            this.reqBody = reqBody;
            this.callback = callback;
            this.queryBy = '';
            this.routed = {};
            var routed = {
                institutionId: this.config.instId
            };

            this.concatDate = function (input) {
                var output;
                output = input.concat('T00:00:00Z');
                return output;
            };

            // var regExp = new RegExp(reqBody.customerName);
            if (reqBody.customerName) {
                this.routed.customerName = reqBody.customerName;
                // routed.customerName = {$regex: regExp, $options: 'si'};
                routed.customerName = {$regex: reqBody.customerName, $options: 'si'};
                this.queryBy = 'Name "' + reqBody.customerName + '"';
            } else if (reqBody.userName) {
                // regExp = new RegExp(reqBody.userName);
                this.routed.userName = reqBody.userName;
                routed.userName = {$regex: reqBody.userName, $options: 'si'};
                this.queryBy = 'User ID "' + reqBody.userName + '"';
            } else if (reqBody.customerId) {
                // regExp = new RegExp(reqBody.customerId);
                this.routed.customerId = reqBody.customerId;
                routed.customerId = {$regex: reqBody.customerId, $options: 'si'};
                this.queryBy = 'Customer ID "' + reqBody.customerId + '"';
            } else if (reqBody.status || reqBody.date) {
                if (reqBody.date == '') {
                    // regExp = new RegExp(reqBody.status);
                    this.routed.status = reqBody.status;
                    routed.status = {$regex: reqBody.status, $options: 'si'};
                    this.queryBy = 'status "' + reqBody.status + '"';
                } else {
                    var arr = reqBody.date.split('-');
                    if (this.is_date_valid(+arr[2], +arr[0], +arr[1])) {
                        var temp = null;
                        temp = arr[2];
                        arr[2] = arr[1];
                        arr[1] = temp;
                        var arrDate = this.addZeroToDateOrMonth([arr[1], arr[0].toString(), arr[2].toString()]);
                        var selectedDate = arrDate.join('-');
                        var selectedDateWithTime = this.concatDate(selectedDate);
                        var selectedNextDate = this.getNextDay(arr[1], arr[0], arr[2]);
                        var selectedNextDateWithTime = this.concatDate(selectedNextDate);
                    }
                    routed.status = reqBody.status;
                    routed.createdOn = {"$gte": selectedDateWithTime, "$lt": selectedNextDateWithTime};
//                    this.queryBy = 'Created On "'+ { "createdOn" : { "$gte" : selectedDateWithTime, "$lt" : selectedNextDateWithTime }} +'"';
                    this.queryBy = 'Created On "' + reqBody.date + '"';
                }

            }

            var options = {
                skip: this.reqBody.start,
                limit: this.reqBody.length,
                sortFirst: {}
            };
            if (this.reqBody.order) {
                if (this.reqBody.order[0].column == 1) {
                    options.sortFirst = {
                        customerId: -1
                    }
                    if (this.reqBody.order[0].dir == "asc") {
                        options.sortFirst = {
                            customerId: 1
                        }
                    }
                }
                if (this.reqBody.order[0].column == 2) {
                    options.sortFirst = {
                        userName: -1
                    }
                    if (this.reqBody.order[0].dir == "asc") {
                        options.sortFirst = {
                            userName: 1
                        }
                    }
                }
                if (this.reqBody.order[0].column == 3) {
                    options.sortFirst = {
                        customerName: -1
                    }
                    if (this.reqBody.order[0].dir == "asc") {
                        options.sortFirst = {
                            customerName: 1
                        }
                    }
                }
                if (this.reqBody.order[0].column == 4) {
                    options.sortFirst = {
                        createdOn: -1
                    }
                    if (this.reqBody.order[0].dir == "asc") {
                        options.sortFirst = {
                            createdOn: 1
                        }
                    }
                }
            }
            this.searchRouted = routed;
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId, {"_id": 0}, options);
            var resHandle = this.returnAdminSearch.bind(this);
            mongo.FindWithOptionsMethod(resHandle);
        },
        deletedUserFound: function (err, result) {
            if (!result) {
                this.callback(null, []);
            } else {
                this.callback(null, {message: this.successResponse.customerWithMsg + this.queryBy + this.successResponse.hasDeletedMsg});
            }
        },
        returnAdminSearch: function (err, result) {
            if (result.length <= 0) {
                var model = mongoModelName.modelName.DeletedUser;
                var mongo = this.utils.initMongo(model, this.routed, this.tnxId);
//                var resHandler = this.deletedUserFound.bind(this);
//                mongo.FindOneMethod(resHandler);
                this.callback(null, {message: this.errorResponse.NoCustomersFound});
            } else {
                this.userObj = [];
                for (var i = 0; i < result.length; i++) {
                    var lock = lockUserMethod(this.config, this.tnxId);
                    var updateTo = this.addCounterInfo.bind(this);
                    var done = null;

                    var isTempPasswordExpired = false;
                    var today = new Date();
                    today = moment([today.getFullYear(), today.getMonth(), today.getDate()]);

                    var passwordChangedOn = new Date(result[i].passwordChangedOn);
                    passwordChangedOn = moment([passwordChangedOn.getFullYear(), passwordChangedOn.getMonth(), passwordChangedOn.getDate()]);
                    if (today.diff(passwordChangedOn, 'days') > this.config.temporaryCredentialsExpiration.client.password) {
                        isTempPasswordExpired = true;
                    }

                    var userObj = {
                        userId: result[i].userId,
                        isTemporaryPassword: result[i].isTemporaryPassword,
                        customerId: result[i].customerId,
                        customerName: result[i].customerName,
                        userName: result[i].userName,
                        customerType: result[i].customerType,
                        userType: result[i].privilege.userViews.UserType,
                        lastLogin: result[i].lastLogin || '',
                        status: result[i].status,
                        createdOn: result[i].createdOn,
                        emailId: result[i].emailId,
                        accessType: result[i].accessType,
                        limitProfile: result[i].limitProfile,
                        mobileNo: result[i].contact.mobileNo,
                        isSubUser: this.utils.isSubUser(result[i].createdBy, result[i].originator),
                        isTempPasswordExpired: isTempPasswordExpired
                    };

                    if (result.length == i + 1) done = true;

                    var userCounter = new AdminSearchUserCounter(userObj, updateTo, done);
                    var resHandle = userCounter.getTheCounter.bind(userCounter);
                    lock.getLoginCount(result[i].userId, resHandle);
                }
            }
        },
        addCounterInfo: function (result, done) {
            this.userObj.push(result);

            if (done) {
                var handler = this.sendAdminSearchUser.bind(this);
                handler();
            }
        },
        sendAdminSearchUser: function () {
            var routed = {
                institutionId: this.config.instId
            };

            var mongo = this.utils.initMongo(this.accessTypeModel, routed, this.tnxId);
            var resHandle = this.allUsersReturnNext.bind(this);
            mongo.FindMethod(resHandle);
        },
        allUsersReturnNext: function (err, result) {
            if (err) {
                var error = this.errorResponse.LimitProfileListFoundFailed;
                this.callback(error, null);
            } else {
                for (var i = 0; i < this.userObj.length; i++) {
                    if (this.userObj[i].limitProfile == undefined || this.userObj[i].limitProfile == null || this.userObj[i].limitProfile == "") {
                        for (var j = 0; j < result.length; j++) {
                            if (this.userObj[i].accessType == result[j].accessType) {
                                this.userObj[i].limitProfile = result[j].limitProfile;
                                this.userObj[i].isLimitProfileOverridden = false;
                                break;
                            }
                        }
                    }
                }
                var mongo = this.utils.initMongo(this.model, this.searchRouted, this.tnxId);
                var resHandle = this.allUsersReturned.bind(this);
                mongo.Count(resHandle);
            }
        },
        allUsersReturned: function (err, result) {
            if (this.reqBody.order) {
                if (this.reqBody.order[0].column == 1) {
                    if (this.reqBody.order[0].dir == "asc") {
                        this.userObj = _.sortBy(this.userObj, 'customerId');
                    } else {
                        this.userObj = _.sortBy(this.userObj, 'customerId');
                        this.userObj.reverse();
                    }
                }

                if (this.reqBody.order[0].column == 2) {
                    if (this.reqBody.order[0].dir == "asc") {
                        this.userObj = _.sortBy(this.userObj, 'userName');
                    } else {
                        this.userObj = _.sortBy(this.userObj, 'userName');
                        this.userObj.reverse();
                    }
                }

                if (this.reqBody.order[0].column == 3) {
                    if (this.reqBody.order[0].dir == "asc") {
                        this.userObj = _.sortBy(this.userObj, 'customerName');
                    } else {
                        this.userObj = _.sortBy(this.userObj, 'customerName');
                        this.userObj.reverse();
                    }
                }

                if (this.reqBody.order[0].column == 4) {
                    if (this.reqBody.order[0].dir == "asc") {
                        this.userObj = _.sortBy(this.userObj, 'createdOn');
                    } else {
                        this.userObj = _.sortBy(this.userObj, 'createdOn');
                        this.userObj.reverse();
                    }
                }

            }
            var finalResponse = {
                recordsTotal: result,
                data: this.userObj
            }
            this.callback(null, finalResponse);
        },
        searchForCustomerExclusion: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;
            this.queryBy = '';
            this.routed = {};
            var routed = {
                institutionId: this.config.instId
            };

            this.concatDate = function (input) {
                var output;
                output = input.concat('T00:00:00Z');
                return output;
            };

            // var regExp = new RegExp(reqBody.customerName);
            if (reqBody.customerName) {
                this.routed.customerName = reqBody.customerName;
                routed.customerName = {$regex: reqBody.customerName, $options: 'si'};
                this.queryBy = 'Name "' + reqBody.customerName + '"';
            } else if (reqBody.userName) {
                // regExp = new RegExp(reqBody.userName);
                this.routed.userName = reqBody.userName;
                routed.userName = {$regex: reqBody.userName, $options: 'si'};
                this.queryBy = 'User ID "' + reqBody.userName + '"';
            } else if (reqBody.customerId) {
                // regExp = new RegExp(reqBody.customerId);
                this.routed.customerId = reqBody.customerId;
                routed.customerId = {$regex: reqBody.customerId, $options: 'si'};
                this.queryBy = 'Customer ID "' + reqBody.customerId + '"';
            }
            var options = {
                skip: this.reqBody.start,
                limit: this.reqBody.length,
                sortFirst: {}
            };
            if (this.reqBody.order) {
                if (this.reqBody.order[0].column == 1) {
                    options.sortFirst = {
                        customerId: -1
                    }
                    if (this.reqBody.order[0].dir == "asc") {
                        options.sortFirst = {
                            customerId: 1
                        }
                    }
                }
                if (this.reqBody.order[0].column == 2) {
                    options.sortFirst = {
                        userName: -1
                    }
                    if (this.reqBody.order[0].dir == "asc") {
                        options.sortFirst = {
                            userName: 1
                        }
                    }
                }
                if (this.reqBody.order[0].column == 3) {
                    options.sortFirst = {
                        customerName: -1
                    }
                    if (this.reqBody.order[0].dir == "asc") {
                        options.sortFirst = {
                            customerName: 1
                        }
                    }
                }

            }
            var isMainUserQuery = { '$or': [ { 'createdBy': 'admin' }, { '$and': [ {'createdBy' : 'System'},{ '$or': [ {'originator': 'System' },{ 'originator': 'File'}]}]} , { 'originator': 'Branch' } ] };
            routed = _.extend(routed, isMainUserQuery);
            this.searchRouted = routed;
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId, {"_id": 0}, options);
            var resHandle = this.returnExclusionAdminSearch.bind(this);
            mongo.FindWithOptionsMethod(resHandle);
        },
        returnExclusionAdminSearch: function (err, result) {
            if (result.length <= 0) {
                this.callback(null, {message: this.errorResponse.NoCustomersFound});
            } else {
                this.users = null || [];
                this.users = result;
                var mongo = this.utils.initMongo(this.model, this.searchRouted, this.tnxId);
                var resHandle = this.returnExclusionAdminSearchNext.bind(this);
                mongo.Count(resHandle);
                //this.callback(null, users);
            }
        },
        returnExclusionAdminSearchNext: function (err, result) {
            if (this.reqBody.order) {
                if (this.reqBody.order[0].column == 1) {
                    if (this.reqBody.order[0].dir == "asc") {
                        this.users = _.sortBy(this.users, 'customerId');
                    } else {
                        this.users = _.sortBy(this.users, 'customerId');
                        this.users.reverse();
                    }
                }

                if (this.reqBody.order[0].column == 2) {
                    if (this.reqBody.order[0].dir == "asc") {
                        this.users = _.sortBy(this.users, 'userName');
                    } else {
                        this.users = _.sortBy(this.users, 'userName');
                        this.users.reverse();
                    }
                }

                if (this.reqBody.order[0].column == 3) {
                    if (this.reqBody.order[0].dir == "asc") {
                        this.users = _.sortBy(this.users, 'customerName');
                    } else {
                        this.users = _.sortBy(this.users, 'customerName');
                        this.users.reverse();
                    }
                }



            }
            var finalResponse = {
                recordsTotal: result,
                data: this.users
            }
            this.callback(null, finalResponse);

        },
        resetSecurityQ: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.listedUserId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.securityQResetComplete.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        securityQResetComplete: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.result = result;
                var bank = bankPolicyMethod(this.config, this.tnxId);
                var resHandle = this.resetSecurityQWithBankPolicy.bind(this);
                bank.getBankPolicy({}, resHandle);
            }
        },
        resetSecurityQWithBankPolicy: function (err, result) {

            if (!result) result = {};
            this.result.securityQuestion = [];
            this.result.save();
            this.callback(null, {message: this.successResponse.securityQuestionResetMsg});
            // redirecting to alerts core
            var vfxRequestId = generateId();
            var requestId = generateId();
            var requestObj = {
                config: this.config,
                requestId: requestId,
                vfxRequestId: vfxRequestId,
                requestBody: {
                    "REQUEST_NAME": "AlertRq",
                    "INSTANCE": {
                        "alertType": 'OTHER',
                        "bankId": this.result.institutionId,
                        "emailInd": true,
                        "smsInd": false,
                        "customerId": this.result.customerId,
                        "subject": "Reset Security Questions",
                        "message": '<p>Dear ' + this.result.customerName + ',</p><p>As per your request we have reset your security questions. You are requested to change security questions on login.</p><br/>',
                        "userId": this.result.userId,
                        "requestId": requestId,
                        "vfxRequestId": vfxRequestId
                    }
                }
            };

            if (this.utils.isSubUser(this.result.createdBy, this.result.originator)) {
                requestObj.requestBody.INSTANCE.emailAddress = this.result.emailId;
                requestObj.requestBody.INSTANCE.phoneNo = this.result.contact.phoneNo;
            }

            var validateResponse = function (error, response) {
                if (error || response.status.statusCode != "00") {
                    var errorObj = error || response;
                    errorObj.status.statusCode = (typeof errorObj.status.statusCode == "undefined") ? '500' : errorObj.status.statusCode;
                    //errorObj = errorObj.status.statusDescription || errorCode;
                    this.callback(errorObj, null);
                } else {
                    var resObj = response.responses[requestId];
                    var validator = validate(schema.addAlert, resObj);
                    this.callback(null, validator.validateCoreResponse());
                }
            };
            var ws = alertWS(requestObj, validateResponse);
            ws.requestVsoftAlertServer();
        }
        ,
        resetPassword: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;

            var routed = {
                institutionId: this.config.instId,
                userId: this.reqBody.listedUserId
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.passwordResetComplete.bind(this);
            mongo.FindOneMethod(resHandle);
        }
        ,
        passwordResetComplete: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.result = result;
                var bank = bankPolicyMethod(this.config, this.tnxId);
                this.resHandle = this.resetWithBankPolicy.bind(this);
                var resHandle = this.getEncryptKey.bind(this);
                bank.getBankPolicy({}, resHandle);
            }
        }
        ,
        resetWithBankPolicyDone: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                var routed = {
                    institutionId: this.config.instId,
                    userId: result.userId
                };
                /*if(this.config.systemConfiguration.admin.userLoginSupport.showResetPassword) {
                 this.mailType = 'Temporary Password';
                 this.replaceWhat = 'password';
                 this.replaceUser = 'customerName';
                 var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                 this.resHandle = this.createWordingLetter.bind(this);
                 var resHandle = this.getEncryptKey.bind(this);
                 mongo.FindOneMethod(resHandle);
                 }else{*/
                this.callback(null, {message: this.successResponse.passwordResetMsg, userName: result.userName});
                //}

                var sendObj = {
                    customerName: result.customerName,
                    password: result.password
                };

                var decryptedPassword = this.decryptString(result.tempPassword, this.encryptionKey);

                var sendingTo = {
                    subject: 'Reset Password',
                    emailId: result.emailId
                };
                /*var postOffice = messenger(this.config , this.tnxId);
                 postOffice.sendMessage(sendingTo, sendObj, 'resetPassword');*/

                var vfxRequestId = generateId();
                var requestId = generateId();
                var requestObj = {
                    config: this.config,
                    requestId: requestId,
                    vfxRequestId: vfxRequestId,
                    requestBody: {
                        "REQUEST_NAME": "AlertRq",
                        "INSTANCE": {
                            "bankId": result.institutionId,
                            "customerId": result.customerId,
                            "alertType": "PASSWORD RESET",
                            "emailInd": true,
                            "smsInd": false,
                            "userId": result.userId,
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId,
                            "param1": decryptedPassword,
                            "param2": null
                        }
                    }
                };
                if (this.utils.isSubUser(result.createdBy, result.originator)) {
                    requestObj.requestBody.INSTANCE.emailAddress = result.emailId;
                    requestObj.requestBody.INSTANCE.phoneNo = result.contact.phoneNo;
                }

                var validateResponse = function (error, response) {
                };

                var ws = alertWS(requestObj, validateResponse);
                ws.requestVsoftAlertServer();
            }
        }
        ,
        resetWithBankPolicy: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            if (!this.finalResult) this.finalResult = {};
            this.result.password = null;
            this.result.tempPassword = this.encryptString(this.createPassword(this.finalResult), this.encryptionKey);
            this.result.changePasswordOnNextLogin = true;
            this.result.passwordChangedOn = (new Date());
            this.result.isTemporaryPassword = true;
            var resHandle = this.resetWithBankPolicyDone.bind(this);
            this.result.save(resHandle);

        }
        ,
        getCurrentBankPolicy: function (reqBody, callback) {
            this.callback = callback;
            var resHandle = this.handlePolicy.bind(this);
            var bank = bankPolicyMethod(this.config, this.tnxId);
            bank.getBankPolicy(reqBody, resHandle);
        }
        ,
        handlePolicy: function (err, result) {
            if (!result) {
                //var error = this.errorResponse.OperationFailed;
                this.callback(null, {});
            } else {
                this.policyResult = result;
                var routed = {
                    institutionId: this.config.instId,
                    type: 'client'
                };
                //
                var mongo = this.utils.initMongo(this.menuhelpmappermodel, routed);
                var resHandle = this.getLinkMapper.bind(this);
                mongo.FindMethod(resHandle);
            }
        }
        ,
        getLinkMapper: function (err, result) {
            if (!result) {
                this.callback(null, {});
            } else {
                var finalResult = {
                    linkMenu: result
                };
                finalResult = _.extend(JSON.parse(JSON.stringify(this.policyResult)), finalResult)
                this.callback(null, finalResult);
            }
        }
        ,
        inActiveUsers: function (reqBody, callback) {
            this.callback = callback;

            var fields = 'userId customerId customerName userName customerType status createdOn';
            var routed = {
                institutionId: this.config.instId,
                status: this.config.status.NotEnrolled
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId, fields);
            var resHandle = this.inActiveList.bind(this);
            mongo.FindMethod(resHandle);
        }
        ,
        findUsers: function (reqBody, callback) {
            this.callback = callback;

            var fields = 'userId customerId customerName userName customerType status';
            var routed = {
                institutionId: this.config.instId,
                emailId: reqBody.emailId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId, fields);
            var resHandle = this.inActiveList.bind(this);
            mongo.FindMethod(resHandle);
        }
        ,
        inActiveList: function (err, result) {
            if (err) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null, result);
            }
        },
        activeUsers: function (reqBody, callback) {
            this.reqBody = reqBody;
            // this.userId = reqBody.userId;
            this.callback = callback;
            this.doDownload = this.reqBody.download ? true :false;

            this.routed = {};

            this.downloadMethod = downloader(this.config , 'csv' ,'ActiveUsers' ,this.userId, this.tnxId);

            var that = this;
            var sessionsreports = require('../lib/models/dbModel').SessionReport;
            var minDate = new Date(reqBody.fromDate);
            var maxDate = new Date(reqBody.fromDate)
            maxDate = new Date(maxDate.setDate(parseInt(maxDate.getDate()) + 1))
            sessionsreports.aggregate(
                [
                    {
                        "$project": {
                            "userName": {
                                "$toLower": "$userName"
                            },
                            "message": "$transaction.message",
                            "ipAddress": "$transaction.ipAddress",
                            "moduleType": "$moduleType",
                            "sessionReportDate": "$sessionReportDate",
                            "customerName": "$transaction.request.customerName",
                            "customersId": "$transaction.request.customersId"
                        }
                    },
                    {
                        "$match": {
                            "$and": [
                                {
                                    "message": {
                                        "$regex": "successful",
                                        "$options": "i"
                                    }
                                },
                                {
                                    "moduleType": "LOGIN"
                                },
                                {
                                    "sessionReportDate": {
                                        "$gte": minDate
                                    }
                                },
                                {
                                    "sessionReportDate": {
                                        "$lt": maxDate
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "$group": {
                            "_id": "$userName",
                            "total": {
                                "$sum": 1
                            },
                            "lastLoginIp": {
                                "$last": "$ipAddress"
                            },
                            "customerName": {
                                "$last": "$customerName"
                            },
                            "customersId": {
                                "$last": "$customersId"
                            }
                        }
                    }
                ], function (err, result) {
                    if(err){
                        var error = that.errorResponse.OperationFailed;
                        callback(error ,null);
                    } else {
                        if(that.doDownload) {
                            that.activeUsersNext(null, result);
                        } else {
                            callback(null ,result);
                        }
                    }
                });
        },
        activeUsersNext:function(err, result){
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                if (result.length == 0) {
                    var error = this.errorResponse.NoActiveUsers;
                    this.callback(error, null);
                } else {
                    var jsonArray = [];
                    var headers = ['Customer Id', 'UserId', 'Customer Name', 'Last Login IP', 'Login Count'];
                    for (var i = 0; i < result.length; i++) {
                        var jsonObj = {
                            customersId: result[i].customersId,
                            userId: result[i]._id,
                            customerName: result[i].customerName,
                            lastLoginIp: result[i].lastLoginIp,
                            loginCount: result[i].total
                        };
                        jsonArray.push(jsonObj);
                    }
                    jsonArray = _.sortBy(jsonArray, 'customerId');
                    this.downloadMethod.parseData(jsonArray, headers, this.callback, 'activeUsersReport', null, this.userId);
                }
            }
        },
        printUserIdTemplate: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.listedUserId
            };

            this.mailType = 'Temporary User ID';
            this.replaceWhat = 'userName';
            this.replaceUser = 'customerName';
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            this.resHandle = this.createWordingLetter.bind(this);
            var resHandle = this.getEncryptKey.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        printPasswordTemplate: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.listedUserId
            };

            this.mailType = 'Temporary Password';
            this.replaceWhat = 'password';
            this.replaceUser = 'customerName';
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            this.resHandle = this.createWordingLetter.bind(this);
            var resHandle = this.getEncryptKey.bind(this);
            mongo.FindOneMethod(resHandle);
        }
        ,

        createWordingLetter: function (err, result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            if (!this.finalResult) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                var that = this;
                var request = require('request');
                var params = "bankId="+that.config.instId+"&customerId="+ that.finalResult.customerId;
                new request({
                        url: encodeURI("http://"+ that.config.vsoftServer.hostname+":"+that.config.vsoftServer.port+ '/core/customer/mailingAddress?'+params),
                        method: 'GET',
                        rejectUnauthorized:false,
                        checkServerIdentity: function (host, cert) {
                            return undefined;
                        }
                    },  function(error, response, body){
                        if(error) {
                            console.error('Contact Request Failed : ' + error);
                            that.callback(that.errorResponse.OperationFailed, null);
                        } else {
                            console.info('Contact Request Responded At: ' + (new Date() - that.startedAt) + ' ms')
                            console.log('Contact return Object : ' + body);
                            try{
                                body = JSON.parse(body);
                            } catch(e){
                                console.log(e)
                            }
                            that.finalResult.password = that.decryptString(that.finalResult.tempPassword, that.encryptionKey);
                            var replaceCustomerNameString = body.legalName ? body.legalName : "";
                            var replaceAddress1String = body.addressLine1 ? body.addressLine1 : "";
                            var replaceAddress2String = body.addressLine2 ? body.addressLine2 : "";
                            var replaceUserString = that.finalResult[that.replaceUser];
                            var replaceString = that.finalResult[that.replaceWhat];
                            var wording = mailWordingMethod(that.config, that.tnxId);
                            var resHandle = that.returnWordingTemplate.bind(that);
                            wording.replaceWording(that.mailType, replaceUserString, replaceString, resHandle,replaceCustomerNameString,replaceAddress1String,replaceAddress2String);
                        }
                    }
                );

            }
        }
        ,
        returnWordingTemplate: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                var wordObj = {
                    letter: result
                };

                this.callback(null, wordObj);
            }
        }
        ,
        createPassword: function (bankPolicy) {
            var PassLen = '6';
            var special = '0';
            var nums = '1';
            var uppers = '1';
            var lowers = '1';
            if (bankPolicy.passwordRestrictions) {
                PassLen = bankPolicy.passwordRestrictions.minimumLength;
                special = bankPolicy.passwordRestrictions.minimumSpecialChars;
                nums = bankPolicy.passwordRestrictions.minimumNumericChars;
                uppers = bankPolicy.passwordRestrictions.minimumUpperCaseChars;
                lowers = bankPolicy.passwordRestrictions.minimumLowerCaseChars;
            }

            return genPass.generate(PassLen, {specials: special, nums: nums, uppers: uppers, lowers: lowers});
        }
        ,
        defaultMethod: function (routed, callback) {
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.FindOneMethod(callback);
        }
        ,
        defaultAllMethod: function (routed, callback) {
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.FindMethod(callback);
        }
        ,
        updateNickName: function (reqBody, callback) {
            this.callback = callback;
            this.req = reqBody;
            var routed = {
                institutionId: this.config.instId,
                userName: this.req.userName
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.updateNickNameNext.bind(this);
            mongo.FindOneMethod(resHandle);
        }
        ,
        updateNickNameNext: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.routed = result;
                var found = false;
                for (var i = 0; i < this.routed.accountsInformation.length; i++) {
                    if (this.routed.accountsInformation[i].accountNo == this.req.accountNo) {
                        this.routed.accountsInformation[i].nickName = this.req.nickName;
                        found = true;
                    }
                }
                if(!found){
                    this.routed.accountsInformation.push({
                        accountNo : this.req.accountNo,
                        nickName : this.req.nickName
                    });
                }
                this.routed.save();
                var success = {
                    message: 'Nick Name Updated Successfully'
                };
                this.callback(null, success);
            }
        }
        ,
        getContactDetailsForUser: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;
            var routed = {
                institutionId: this.config.instId,
                userId: this.reqBody.targetUserId
            };
            var resHandle = this.getContactDetailsForUserNext.bind(this);
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.FindOneMethod(resHandle);
        }
        ,
        getContactDetailsForUserNext: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                if (this.utils.isSubUser(result.createdBy, result.originator)) {
                    var success = {
                        mobileNo: result.contact.mobileNo,
                        emailId: result.emailId
                    };
                    this.callback(null, success);
                } else {
                    var routed = {
                        customerId: this.reqBody.customerId,
                        userId: this.reqBody.targetUserId
                    };
                    var inquiry = customerInquiry.CustomerInquiry(routed, this.config, this.tnxId);
                    var resHandle = this.getContactDetailsForUserDone.bind(this);
                    inquiry.directCoreCaller(resHandle);
                }
            }
        }
        ,
        getContactDetailsForUserDone: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                var success = {
                    mobileNo: result.cellPhoneNumberData.phoneNumber || null,
                    emailId: result.emailAddress || null
                };
                this.callback(null, success);
            }
        }
        ,
        inquiryCustomer: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;
            var routed = {
                institutionId: this.config.instId,
                customerId: this.reqBody.customerId,
                userId: this.reqBody.userId
            }
            var resHandle = this.inquiryCustomerNext.bind(this);
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.FindOneMethod(resHandle);
        }
        ,
        inquiryCustomerNext: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UnauthorizedAccess;
                this.callback(error, null);
            } else {
                var customer = customerMethod(this.config, this.callback, this.tnxId);
                customer.inquiryCustomer(this.reqBody);
            }
        }
        ,
        inquiryAccount: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;
            var routed = {
                institutionId: this.config.instId,
                customerId: this.reqBody.customerId,
                "accountsInformation.accountNo": this.reqBody.accountNo,
                userId: this.reqBody.userId
            }
            var resHandle = this.inquiryAccountNext.bind(this);
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.FindOneMethod(resHandle);
        }
        ,
        inquiryAccountNext: function (err, result) {
            if (!result) {
                var error = this.errorResponse.UnauthorizedAccess;
                this.callback(error, null);
            } else {
                var customer = customerMethod(this.config, this.callback, this.tnxId);
                customer.inquiryAccount(this.reqBody);
            }
        }
        ,
        adminInquiryCustomer: function (reqBody, callback) {

            this.callback = callback;
            this.reqBody = reqBody;
            var routed = {
                customerId: this.reqBody.customerId,
                userId: this.reqBody.targetUserId
            };
            var inquiry = customerInquiry.CustomerInquiry(routed, this.config, this.tnxId);
            var resHandle = this.getAccountDetailsForUserDone.bind(this);
            inquiry.directCoreCaller(resHandle);
        }
        ,
        getAccountDetailsForUserDone: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.coreResult = null || {
                        fullName: result.fullName,
                        organizationName: result.organizationName,
                        customerType: result.customerType,
                        accounts: null || []
                    };
                for (var i = 0; i < result.customerAccounts.length; i++) {
                    this.coreResult.accounts.push({
                        accountNo: result.customerAccounts[i].accountNo,
                        accountType: result.customerAccounts[i].accountType,
                        productName: result.customerAccounts[i].productTypeName,
                        excluded: false
                    })
                }
                var routed = {
                    institutionId: this.config.instId,
                    userId: this.reqBody.targetUserId
                };
                var resHandle = this.getAccountDetailsForUserComplete.bind(this);
                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                mongo.FindOneMethod(resHandle);
            }
        }
        ,
        getAccountDetailsForUserComplete: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                for (var i = 0; i < result.excludedAccounts.length; i++) {
                    this.coreResult.accounts.push({
                        accountNo: result.excludedAccounts[i].accountNo,
                        accountType: result.excludedAccounts[i].accountType,
                        productName: result.excludedAccounts[i].productName,
                        excluded: true
                    })
                }
                this.callback(null, this.coreResult);

            }
        },
        accountExclusionForCustomer: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;
            this.isRequestForSubUser = reqBody.isRequestForSubUser || false;
            this.totalUserTransferInstruction = [];
            if(reqBody.checkTransactions){
                var userAccs = [];
                for (var i = 0; i < reqBody.userAccountExclusion.length; i++) {
                    userAccs.push(reqBody.userAccountExclusion[i].accountNo);
                }
                var that = this;

                var matchPipeline = {
                    customerId:reqBody.targetCustomerId,
                    bankId :this.config.instId,
                    "instructions.endDate": {$gte:moment().toDate()}
                };
                if(this.isRequestForSubUser){
                    matchPipeline.userId = this.reqBody.userIdForSubUser
                }
                transferInstructionModel.aggregate(
                    {"$match":matchPipeline},
                    { $unwind: '$instructions' },
                    {
                        "$match": {
                            "$or": [
                                {
                                    "instructions.sourceAccountNo": {$in:userAccs}
                                },
                                {
                                    "instructions.targetAccountNo": {$in:userAccs}
                                }
                            ]
                        }
                    },
                    /*{
                        "$group": {
                            _id: '$instructions.sourceAccountNo',
                            totalTransactions: {$sum: 1}
                        }
                    },*/
                    function (err, result) {
                        if(err){
                            var error = that.errorResponse.OperationFailed;
                            callback(error ,null);
                        } else {
                            function getFinalCount(result) {
                                var allAccounts = [];
                                for(var i = 0 ; i < result.length ; i++){
                                    if(userAccs.indexOf(result[i].instructions.sourceAccountNo)>=0){
                                        allAccounts.push(result[i].instructions.sourceAccountNo)
                                    } else {
                                        allAccounts.push(result[i].instructions.targetAccountNo)
                                    }
                                }
                                var accounts = {};
                                allAccounts.forEach(function(x) { accounts[x] = (accounts[x] || 0)+1; });
                                var response = []
                                for(var account in accounts){
                                    response.push({ _id: account, totalTransactions: accounts[account] })
                                }
                                return response;
                                // { _id: '994210016969', totalTransactions: 2 }
                            }
                            var finalCounts = getFinalCount(result)
                            if(finalCounts.length >0){
                                callback(null ,{
                                    result: finalCounts,
                                    nextStep: that.config.nextStepTo.goTocheckFutureTransactions
                                });
                            }else{
                                if(that.isRequestForSubUser){
                                    that.callback(null,true);
                                }else {
                                    that.accountExclusionForCustomer2(that.reqBody, that.callback)
                                }
                            }

                        }
                    });

            }else{
                var userAccs = [];
                for (var i = 0; i < reqBody.userAccountExclusion.length; i++) {
                    userAccs.push(reqBody.userAccountExclusion[i].accountNo);
                }
                var that = this;

                var matchPipeline = {
                    customerId:reqBody.targetCustomerId,
                    bankId :this.config.instId,
                    "instructions.endDate": {$gte:moment().toDate()}
                };
                if(this.isRequestForSubUser){
                    matchPipeline.userId = this.reqBody.userIdForSubUser
                }
                transferInstructionModel.aggregate(
                    {
                        "$match": matchPipeline
                    },
                    { $unwind: '$instructions' },
                    {
                        "$match": {
                            "$or": [
                                {
                                    "instructions.sourceAccountNo": {$in:userAccs}
                                },
                                {
                                    "instructions.targetAccountNo": {$in:userAccs}
                                }
                            ]
                        }
                    }, function (err, result) {
                        if(!result){
                            var error = that.errorResponse.OperationFailed;
                            callback(error ,null);
                        } else {
                            for (var j = 0; j < result.length; j++) {
                                that.totalUserTransferInstruction.push({instructionId : result[j].instructions["_id"].toString(),userId : result[j].userId})
                            }
                            that.deleteUserTransferInstructionNext();
                        }
                    });
            }
        },
        deleteUserTransferInstructionNext:function(){
            var allUsers = []
            for(var i = 0 ; i < this.totalUserTransferInstruction.length; i++){
                if(allUsers.indexOf(this.totalUserTransferInstruction[i].userId) < 0){
                    allUsers.push(this.totalUserTransferInstruction[i].userId)
                }
            }
            var routed = {
                userId : {$in : allUsers}
            };
            var resHandle = this.deleteUserTransferInstructionDone.bind(this);
            var mongo = this.utils.initMongo(this.transferInstructionModel, routed, this.tnxId);
            mongo.FindMethod(resHandle);

        },
        deleteUserTransferInstructionDone:function(err,result){
            this.totalInst = result.length;
            this.totalDeletedInst = 0
            for(var j = 0; j < result.length  ; j++){
                for(var k = 0; k < result[j].instructions.length ; k++){
                    for(var i = 0 ; i <this.totalUserTransferInstruction.length; i++) {
                        if (result[j].instructions[k]["_id"] == this.totalUserTransferInstruction[i].instructionId) {
                            result[j].instructions.splice(k, 1);
                            continue;
                        }
                    }
                }
                var res = this.deleteUserTransferInstructionComplete.bind(this)
                result[j].save(res)
            }
        },
        deleteUserTransferInstructionComplete:function(err,result) {
            this.totalDeletedInst++;
            if(this.totalDeletedInst == this.totalInst){
                if(this.isRequestForSubUser){
                    this.callback(null,true);
                }else {
                    this.accountExclusionForCustomer2(this.reqBody, this.callback)
                }
            }
        },
        accountExclusionForCustomer2: function (reqBody, callback) {
            var routed = {
                institutionId: this.config.instId,
                customerId: this.reqBody.targetCustomerId
            };

            var resHandle = this.accountExclusionForCustomerNext.bind(this);
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.FindMethod(resHandle);
        },
        checkFutureTransactions: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                if(result.length > 0){
                    this.callback(null, {
                        message: "",
                        nextStep: this.config.nextStepTo.goTocheckFutureTransactions
                    });
                }
            }
        },
        accountExclusionForCustomerNext: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.oldUsersResultSet = result;
                this.usersToProcess = result.length;
                this.usersProcessed = 0;
                this.isUsersToProcessFailed = false;
                for(var i=0;i<result.length;i++){
                    if (this.utils.isSubUser(result[i].createdBy, result[i].originator)) {
                        var accountsAccess = result[i].privilege.access.accountsAccess ;
                        var accountsTransferAccess = result[i].privilege.access.accountsTransferAccess;
                        var accountsWireAccess = result[i].privilege.access.accountsWireAccess ;
                        var accountsACHAccess = result[i].privilege.access.accountsACHAccess ;
                        var accountsEStatementsAccess = result[i].privilege.access.accountsEStatementsAccess ;
                        for(var j=0;j< this.reqBody.userAccountExclusion.length ; j++){
                            for(var k=0;k< accountsAccess.length ; k++){
                                if (this.reqBody.userAccountExclusion[j].accountNo == accountsAccess[k].accountNo) {
                                    result[i].privilege.access.accountsAccess.splice(k, 1);
                                    continue;
                                }
                            }
                            for(var k=0;k< accountsTransferAccess.length ; k++){
                                if (this.reqBody.userAccountExclusion[j].accountNo == accountsTransferAccess[k].accountNo) {
                                    result[i].privilege.access.accountsTransferAccess.splice(k, 1);
                                    continue;
                                }
                            }
                            for(var k=0;k< accountsWireAccess.length ; k++){
                                if (this.reqBody.userAccountExclusion[j].accountNo == accountsWireAccess[k].accountNo) {
                                    result[i].privilege.access.accountsWireAccess.splice(k, 1);
                                    continue;
                                }
                            }
                            for(var k=0;k< accountsACHAccess.length ; k++){
                                if (this.reqBody.userAccountExclusion[j].accountNo == accountsACHAccess[k].accountNo) {
                                    result[i].privilege.access.accountsACHAccess.splice(k, 1);
                                    continue;
                                }
                            }
                            for(var k=0;k< accountsEStatementsAccess.length ; k++){
                                if (this.reqBody.userAccountExclusion[j].accountNo == accountsEStatementsAccess[k].accountNo) {
                                    result[i].privilege.access.accountsEStatementsAccess.splice(k, 1);
                                    continue;
                                }
                            }
                        }
                    }else{
                        result[i].excludedAccounts = null || this.reqBody.userAccountExclusion;
                    }
                    var resHandle = this.accountExclusionForCustomerDone.bind(this);
                    result[i].save(resHandle)
                }
            }
        },
        accountExclusionForCustomerDone: function (err, result) {
            this.usersProcessed++;
            if (!result) {
                this.isUsersToProcessFailed = true;
            }
            if(this.usersToProcess == this.usersProcessed) {
                if (this.isUsersToProcessFailed) {
                    for (var i = 0; i < this.oldUsersResultSet.length; i++) {
                        this.oldUsersResultSet.save()
                    }
                    var error = this.errorResponse.OperationFailed;
                    this.callback(error, null);
                } else {
                    var success = {
                        message: 'Account Exclusion Updated Successfully'
                    };
                    this.callback(null, success);
                }
            }
        },
        overrideAccessType: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;
            var routed = {
                institutionId: this.config.instId,
                userId: this.reqBody.targetUserId
            };
            var resHandle = this.getUSerForOverrideAccessType.bind(this);
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.FindOneMethod(resHandle);
        },
        getUSerForOverrideAccessType: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.result = result;
                this.result.accessType = this.reqBody.accessType;

                var routed = {
                    institutionId: this.config.instId,
                    accessType: this.reqBody.accessType
                };
                var resHandle = this.getUserAccessType.bind(this);
                var mongo = this.utils.initMongo(this.accessTypeModel, routed, this.tnxId);
                mongo.FindOneMethod(resHandle);
            }
        },
        getUserAccessType: function (err, result) {
            this.result.privilege.userViews.UserType = result.privilege.userViews.UserType;
            var resHandle = this.overrideAccessTypeDone.bind(this);
            this.result.save(resHandle)
        },
        overrideAccessTypeDone: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                var success = {
                    message: 'Access Type Updated Successfully'
                };
                this.callback(null, success);
            }
        }
        ,
        getFile: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;
            var jwt = require('jsonwebtoken');

            var decoded = jwt.decode(this.reqBody.jwt);
            this.reqBody.userId = decoded.userId;
            this.reqBody.date = decoded.date;
            this.reqBody.fileName = decoded.fileName;
            this.reqBody.fileExt = decoded.fileExt;
            var filePath = path.resolve('./nodedb/contentFiles/');
            var fileName = this.reqBody.fileName;
            var fileExt = this.reqBody.fileExt;
            var fullPath = filePath + "/" + this.config.instId + "/" + this.reqBody.userId + "/" + this.reqBody.date + "/" + fileName + "." + fileExt;
            var that = this;
            fs.stat(fullPath, function (err, stats) {
                setTimeout(function () {
                    fs.unlink(fullPath, function (err) {
                        if (err) throw err;
                        console.info('File successfully deleted : ' + fullPath);
                    });
                }, (that.config.fileDownloadTimeout * 60000))
                that.callback(null, {filePath: fullPath, fileName: fileName, fileExt: fileExt});
            })
        },
        fundsTransferLogs: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;

            var fromDate = moment(reqBody.fromDate,'MM/DD/YYYY').startOf("day");
            var toDate = moment(reqBody.toDate,'MM/DD/YYYY').endOf("day");

            var routed = {
                institutionId: this.config.instId,
                "$and" : [{
                        createdOn : { "$gte" :fromDate}
                    }, {
                        createdOn : { "$lte" :toDate}
                }]
            };
            if(reqBody.onlyRejects){
                routed.status = "FAILED";
            }
            var options = {
                sortFirst: {
                    createdOn : -1
                }
            }
            var resHandle = this.fundsTransferLogsNext.bind(this);
            var mongo = this.utils.initMongo(this.fundsTransferStatusLog, routed, this.tnxId,{},options);
            mongo.FindWithOptionsMethod(resHandle);
        },
        fundsTransferLogsNext : function (err, result) {
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null,result);
            }
        },
        getUserLimits: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;

            var fundsTransferEODdate = this.config.eodTiming.fundsTransferEodAt;
            var startDate, endDate;
            if( moment() < moment(fundsTransferEODdate, "hh:mm A")) {
                startDate = moment(fundsTransferEODdate, "hh:mm A").subtract(1, 'day');
                endDate = moment(fundsTransferEODdate, "hh:mm A");
            } else {
                startDate = moment(fundsTransferEODdate, "hh:mm A");
                endDate = moment(fundsTransferEODdate, "hh:mm A").add(1, 'day');
            }

            var routed = {
                institutionId: this.config.instId,
                customerId: reqBody.customersId,
                transactionType: "TRANSFERMONEY",
                status: "SUCCESS",
                $and:[
                    {transactionDate: {$gte : startDate.toDate()}},
                    {transactionDate: {$lt : endDate.toDate()}}
                    ]
            };

            var resHandle = this.getUserLimitsNext.bind(this);
            var mongo = this.utils.initMongo(this.fundsTransferStatusLog, routed, this.tnxId);
            mongo.FindMethod(resHandle);

        },
        getUserLimitsNext : function (err, result) {
            var sumOfUserTransactions = 0;

            if(result){
               for(var i=0;i<result.length;i++){
                   sumOfUserTransactions += Number(result[i].amount);
               }
            }
            this.customerUsedLimit = sumOfUserTransactions;
            var fundsTransferEODdate = this.config.eodTiming.fundsTransferEodAt;
            var startDate = moment(fundsTransferEODdate, "hh:mm A").subtract(1, 'day');
            var endDate = moment(fundsTransferEODdate, "hh:mm A");

            var routed = {
                institutionId: this.config.instId,
                userId: this.reqBody.userId,
                transactionType: "TRANSFERMONEY",
                $and:[
                    {transactionDate: {$gte : startDate.toDate()}},
                    {transactionDate: {$lt : endDate.toDate()}}
                ]
            };

            var resHandle = this.getUserLimitsNext2.bind(this);
            var mongo = this.utils.initMongo(this.fundsTransferStatusLog, routed, this.tnxId);
            mongo.FindMethod(resHandle);
        },
        getUserLimitsNext2 : function (err, result) {
            var sumOfUserTransactions = 0;

            if(result){
               for(var i=0;i<result.length;i++){
                   sumOfUserTransactions += Number(result[i].amount);
               }
            }
            this.userUsedLimit = sumOfUserTransactions;
            var resHandle = this.getUserLimitsNext3.bind(this);
            var routed = {
                institutionId: this.config.instId,
                userId: this.reqBody.userId
            }
            this.defaultMethod(routed,resHandle);
        },
        getUserLimitsNext3 : function (err, result) {
            this.userDetails = result;
            this.userRemainingLimit = null;
            this.customerRemainingLimit = null;
            if (this.utils.isSubUser(result.createdBy, result.originator)) {
                this.userRemainingLimit = Number(result.privilege.limits.fundsLimits.fundsLimitPerDay)-Number(this.userUsedLimit);
                var resHandle = this.getUserLimitsNext4.bind(this);
                var routed = {
                    institutionId: this.config.instId,
                    userId: result.createdBy
                };
                this.defaultMethod(routed, resHandle);
            } else {
                this.getUserLimitsNext4(null,result);
            }
        },
        getUserLimitsNext4 : function (err, result) {
            if (this.utils.isSubUser(result.createdBy, result.originator)) {
                this.getUserLimitsNext5(null, result);
            } else {
                if (!result.isLimitProfileOverridden) {
                    var routed = {
                        institutionId: this.config.instId,
                        accessType: result.accessType
                    };
                    var mongo = this.utils.initMongo(this.accesstypemodel, routed, this.tnxId);
                    var resHandle = this.getUserLimitsNext5.bind(this);
                    mongo.FindOneMethod(resHandle);
                } else {
                    this.getUserLimitsNext5(null, {limitProfile: result.limitProfile});
                }
            }
        },
        getUserLimitsNext5: function (err, result) {
            var routed = {
                institutionId: this.config.instId,
                '_id': result.limitProfile
            };
            var mongo = this.utils.initMongo(this.limitprofilemodel, routed, this.tnxId);
            var resHandle = this.getUserLimitsNext6.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        getUserLimitsNext6: function (err, result) {
            this.customerLimitAvailable = false;
            // if (parseInt(result.transferLimitPerDay) > 0) {
            this.customerLimitAvailable = true;
            this.customerRemainingLimit = Number(result.transferLimitPerDay) - Number(this.customerUsedLimit);
            // }
            var response = {
                limitAvailable : false,
                remainingLimit : null
            }
            if (this.utils.isSubUser(this.userDetails.createdBy, this.userDetails.originator)) {
                if(this.customerLimitAvailable){
                    response.limitAvailable = true;
                    response.remainingLimit = (this.customerRemainingLimit > this.userRemainingLimit ) ? this.userRemainingLimit : this.customerRemainingLimit;
                } else {
                    response.limitAvailable = true;
                    response.remainingLimit = this.userRemainingLimit;
                }
            } else {
                if(this.customerLimitAvailable){
                    response.limitAvailable = true;
                    response.remainingLimit = this.customerRemainingLimit;
                } else {
                    response.limitAvailable = false;
                    response.remainingLimit = 0;
                }
            }

            this.callback(null,response)
        },
        getReconciliationUserReport: function (reqBody, callback) {
            this.callback = callback;
            this.reqBody = reqBody;
            this.doDownload = this.reqBody.download ? true :false;
            this.eodTransactions = [];
            this.memoTransactions = [];

            this.downloadMethod = downloader(this.config , 'csv' ,'ReconciliationReport' ,this.userId, this.tnxId);
            this.fundsTransferEODtime = this.config.eodTiming.fundsTransferEodAt;

            var routed = {
                institutionId : this.config.instId,
                eodDate : {$lte : moment(this.reqBody.toDate, "MM/DD/YYYY").endOf("day").toDate()}
            }
            var options = {
                limit: 1,
                sortFirst: { eodDate : -1 }
            };

            this.searchRouted = routed;
            var mongo = this.utils.initMongo(this.fundsTransferLogsAckModel, routed, this.tnxId, {}, options);
            var resHandle = this.getReconciliationUserReportNext.bind(this);
            mongo.FindWithOptionsMethod(resHandle);
        },
        getReconciliationUserReportNext:function(err,result){
            if(result[0]) {
                if (moment(result[0].eodDate).format("MMDDYYYY") == moment(this.reqBody.toDate + " " + this.fundsTransferEODtime, "MM/DD/YYYY HH:mm A").format("MMDDYYYY")) {
                    var currentEodResultDate = moment(moment(result[0].eodDate).format("MMDDYYYY") + " " + this.fundsTransferEODtime, "MMDDYYYY hh:mm A").subtract(1, 'day').endOf("day")
                    var routed = {
                        institutionId: this.config.instId,
                        eodDate: {$lt: currentEodResultDate.toDate()}
                    }
                    var options = {
                        limit: 1,
                        sortFirst: {eodDate: -1}
                    };

                    this.searchRouted = routed;
                    var mongo = this.utils.initMongo(this.fundsTransferLogsAckModel, routed, this.tnxId, {}, options);
                    var resHandle = this.getReconciliationUserReportNext1_1.bind(this);
                    mongo.FindWithOptionsMethod(resHandle);
                } else if (moment(result[0].eodDate) < moment(this.reqBody.toDate + " " + this.fundsTransferEODtime, "MM/DD/YYYY HH:mm A")) {
                    this.startDate = moment(moment(result[0].eodDate).format("MMDDYYYY") + " " + this.fundsTransferEODtime, "MMDDYYYY hh:mm A")
                    this.endDate = moment(this.reqBody.toDate + " " + this.fundsTransferEODtime, "MM/DD/YYYY HH:mm A");
                    this.eodTransactions = [];
                    var routed = {
                        institutionId: this.config.instId,
                        transactionType: "TRANSFERMONEY",
                        status: "SUCCESS",
                        $and: [
                            {transactionDate: {$gte: this.startDate.toDate()}},
                            {transactionDate: {$lt: this.endDate.toDate()}}
                        ]
                    };
                    var resHandle = this.getReconciliationUserReportNext1_3.bind(this);
                    var mongo = this.utils.initMongo(this.fundsTransferStatusLog, routed, this.tnxId);
                    mongo.FindMethod(resHandle);
                } else if (moment(result[0].eodDate) > moment(this.reqBody.toDate + " " + this.fundsTransferEODtime, "MM/DD/YYYY HH:mm A")) {
                    var currentEodResultDate = moment(this.reqBody.toDate + " " + this.fundsTransferEODtime, "MM/DD/YYYY HH:mm A")
                    var routed = {
                        institutionId: this.config.instId,
                        eodDate: {$lt: currentEodResultDate.toDate()}
                    }
                    var options = {
                        limit: 1,
                        sortFirst: {eodDate: -1}
                    };

                    this.searchRouted = routed;
                    var mongo = this.utils.initMongo(this.fundsTransferLogsAckModel, routed, this.tnxId, {}, options);
                    var resHandle = this.getReconciliationUserReportNext.bind(this);
                    mongo.FindWithOptionsMethod(resHandle);
                }
            } else {
                this.getReconciliationUserReportReturn()
            }

        },
        getReconciliationUserReportNext1_1:function(err,result){
            this.startDate = moment(moment(result[0].eodDate).format("MMDDYYYY") +" "+this.fundsTransferEODtime, "MMDDYYYY hh:mm A")
            this.endDate = moment(this.reqBody.toDate +" "+this.fundsTransferEODtime, "MM/DD/YYYY HH:mm A");
            var routed = {
                institutionId: this.config.instId,
                $and:[
                    {transactionDate: {$gte : this.startDate.toDate()}},
                    {transactionDate: {$lt : this.endDate.toDate()}}
                ]
            };
            var resHandle = this.getReconciliationUserReportNext1_2.bind(this);
            var mongo = this.utils.initMongo(this.fundsTransferLogsAckModel, routed, this.tnxId);
            mongo.FindMethod(resHandle);
        },
        getReconciliationUserReportNext1_2:function(err,result){
            this.eodTransactions = result;
            var routed = {
                institutionId: this.config.instId,
                transactionType: "TRANSFERMONEY",
                status: "SUCCESS",
                $and:[
                    {transactionDate: {$gte : this.startDate.toDate()}},
                    {transactionDate: {$lt : this.endDate.toDate()}}
                ]
            };
            var resHandle = this.getReconciliationUserReportNext1_3.bind(this);
            var mongo = this.utils.initMongo(this.fundsTransferStatusLog, routed, this.tnxId);
            mongo.FindMethod(resHandle);
        },
        getReconciliationUserReportNext1_3 : function(err,result){
            this.memoTransactions = result;
            this.getReconciliationUserReportReturn();
        },
        getReconciliationUserReportReturn:function(){
            this.callback(null, {memoTransactions : this.memoTransactions,eodTransactions:this.eodTransactions})
        }
    };

    var AdminSearchUserCounter = function (resultObj, updateFunc, done) {
        this.userObj = resultObj;
        this.update = updateFunc;
        this.done = done;
    };

    AdminSearchUserCounter.prototype = {
        getTheCounter: function (countObj) {
            this.userObj.attempts = countObj.counter;

            this.update(this.userObj, this.done);
        }
    };

    var AdminExclusionSearchUserCounter = function (resultObj, updateFunc, done) {
        this.userObj = resultObj;
        this.update = updateFunc;
        this.done = done;
    };

    AdminExclusionSearchUserCounter.prototype = {
        getTheCounter: function (countObj) {
            this.userObj.attempts = countObj.counter;

            this.update(this.userObj, this.done);
        }
    };

    module.exports = function (config, tnxId) {
        return (new User(config, tnxId));
    };
})();