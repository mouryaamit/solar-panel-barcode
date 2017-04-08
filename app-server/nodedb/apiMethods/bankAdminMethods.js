(function(){

    var utils = require('../lib/utils/utils');

    var _ = require('underscore');

    var genPass = require('password.js');
    genPass.charsLowerCase = 'abcdefghjkmnpqrstuvwxyz';
    genPass.charsUpperCase = 'ABCDEFGHJKMNPQRSTUVWXYZ';

    var invalidLoginMethod = require('./inValidLoginMethods');

    var bankConfigMethod = require('./bankConfigMethods');

    var policyMethod = require('../supportMethods/policyRestrictionMethods');

    var bankPasswordRuleMethod = require('../supportMethods/bankPasswordRuleMethods');

    var messenger = require('../lib/emailGenerator/messenger');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var mailer = require('../lib/emailGenerator/emailMethods');

    var alertWS = require('../server/WsAlerts/vsoftAlertWs');

    var generateId = require('time-uuid/time');

    var aesCrypto = require('aes-cross');

    var session = require('../gen/sessionMethods');

    function BankAdmin(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.BankAdmin;
        this.menuhelpmappermodel = mongoModelName.modelName.MenuHelpMapper;
        this.bankConfig = bankConfigMethod(config,tnxId);
    }

    BankAdmin.prototype = {
        encryptString: function (password, key) {
            var encrypted = aesCrypto.encText(password, key);
            return encrypted.toString();
        },
        decryptString: function (encpassword, key) {
            var decrypted = aesCrypto.decText(encpassword, key);
            return decrypted.toString();
        },
        createAdmin: function(reqBody , callback){
            this.callback = callback;

            var adminId = this.utils.getToken();

            this.routed = {
                institutionId                           : this.config.instId,
                name                                    : reqBody.name,
                adminId                                 : adminId,
                emailId                                 : reqBody.emailId,
                userName                                : reqBody.userName,
                status                                  : 'Not Enrolled',
                password                                : 'password!23',
                phoneNo                                 : reqBody.phoneNo,
                viewAccess                              : reqBody.viewAccess,
                firstLogin                              : true
            };

            var adminPolicy = bankPasswordRuleMethod(this.config , this.tnxId);
            this.resHandle = this.createdBankPasswordWithBankPolicy.bind(this);
            var resHandle = this.getEncryptKey.bind(this);
            adminPolicy.getBankPasswordRule(null , resHandle);
        },
        getEncryptKey: function(err , result){
            this.finalResult = result;
            this.bankConfig.getBankConfig(this.resHandle);
        },
        createdBankPasswordWithBankPolicy: function(err , result){
            this.encryptionKey = result.encryptionKey.toString('base64');
            this.routed.password = this.encryptString(this.createBankPassword(this.finalResult), this.encryptionKey);
            this.routed.passwordExp = new Date();

            var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
            var resHandle = this.creationComplete.bind(this);
            mongo.Save(resHandle);
        },
        createBankPassword: function(err , result){
            var PassLen = '6';var special = '0';var nums = '1';var uppers = '1';var lowers = '1';
            if(result){
                PassLen = result.minimumLength;special = result.minimumSpecialChars;nums = result.minimumNumericChars;uppers = result.minimumUpperCaseChars;lowers = result.minimumLowerCaseChars;
            }

            return genPass.generate(PassLen, { specials: special, nums: nums, uppers: uppers, lowers: lowers});
        },
        creationComplete: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                var success = {
                    message                 : 'Bank Admin Created Successfully',
                    nextStep                : ''
                };

                this.callback(null , success);

                this.routed.password = this.decryptString(this.routed.password, this.encryptionKey) ;

                var mailGenerator = mailer(this.config , this.tnxId);
                var msg = mailGenerator.getEmailMsg(this.routed, 'bankAdminPassword');

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
                            "customerId":'0',
                            "emailInd":true,
                            "smsInd":false,
                            "emailAddress":this.routed.emailId,
                            "subject": "Bank Admin Login",
                            "message": msg,
                            "userId":"admin",
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };


                var validateResponse = function(error , response){};


                var ws = alertWS(requestObj , validateResponse);
                ws.requestVsoftAlertServer();

            }
        },
        changeAdminPassword: function(reqBody , callback){
            this.callback = callback;

            this.reqBody = reqBody;

            var routed = {
                adminId                                 : reqBody.adminId,
                institutionId                           : this.config.instId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            this.resHandle = this.userInfo.bind(this);
            var resHandle = this.getEncryptKey.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        userInfo: function (err, result) {
            var error = '';
            this.encryptionKey = result.encryptionKey.toString('base64');
            if (!this.finalResult) {
                error = this.errorResponse.PasswordComplianceFailed;
                this.callback(error , null);
            } else {
                this.result = this.finalResult;
                var encryptedPassword = this.encryptString(this.reqBody.oldPassword, this.encryptionKey);
                var decryptedPassword = this.decryptString(this.result.password, this.encryptionKey);
                if (this.reqBody.oldPassword == decryptedPassword) {
                    this.updatePassword(this.result);
                } else {
                    error = this.errorResponse.PasswordComplianceFailed;
                    this.callback(error , null);
                }
            }
        },
        updatePassword: function(result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.result = result;

                var policyObj = {
                    password: this.reqBody.newPassword,
                    userId: result.userName,
                    customerName: result.name
                };

                var policy = policyMethod(this.config , this.tnxId);
                var resHandle = this.changePasswordComplete.bind(this);
                policy.checkAdminPassword(policyObj, resHandle);
            }
        },
        changePasswordComplete: function(err , result){
            if(!result){
                var error = this.errorResponse.PasswordComplianceFailed;
                this.callback(error , null);
            }else {
                var lastPasswordMethod = require('./adminLastPasswordMethods');

                var dated = new Date();
                dated.setDate(parseInt(dated.getDate())+parseInt(result.passwordExpirationInfo.numberOfDaysPasswordExpire));
                this.result.passwordExp = dated;

                var password = lastPasswordMethod(this.config , this.tnxId);
                var resHandle = this.checkPasswordHistory.bind(this);
                password.isPasswordInHistory(this.result.adminId , this.reqBody.newPassword , resHandle);
            }
        },
        checkPasswordHistory: function(err , result){
            if(result){
                var error = this.errorResponse.SamePasswordFailed;
                this.callback(error , null);
            }else{
                var lastPasswordMethod = require('./adminLastPasswordMethods');

                var password = lastPasswordMethod(this.config , this.tnxId);
                password.addPasswordHistory(this.result.adminId , this.reqBody.newPassword);

                this.result.password = this.encryptString(this.reqBody.newPassword, this.encryptionKey);

                this.result.save();

                var successObj = {
                    message                 : 'Bank Admin Password Changed Successfully',
                    nextStep                : ''
                };

                this.callback(null , successObj);
                var mailGenerator = mailer(this.config , this.tnxId);
                var msg = mailGenerator.getEmailMsg(null, 'bankAdminPasswordChanged');

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
                            "customerId":'0',
                            "emailInd":true,
                            "smsInd":false,
                            "emailAddress":this.result.emailId,
                            "subject": "Bank Admin Password Changed Successfully",
                            "message": msg,
                            "userId":"admin",
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };


                var validateResponse = function(error , response){};


                var ws = alertWS(requestObj , validateResponse);
                ws.requestVsoftAlertServer();

            }
        },
        editAdmin: function(reqBody , callback){
            this.callback = callback;

            this.reqBody = reqBody;

            var routed = {
                adminId                                 : reqBody.adminId,
                institutionId                           : this.config.instId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.updateAdmin.bind(this);
            mongo.FindOneMethod(resHandle);

        },
        updateAdmin: function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                result.name = this.reqBody.name;
                result.emailId = this.reqBody.emailId;
                result.phoneNo = this.reqBody.phoneNo;
                result.viewAccess = this.reqBody.viewAccess;

                result.save();
                var success = {
                    message                 : 'Bank Admin Updated Successfully',
                    nextStep                : ''
                };

                this.callback(null , success);

                var mailGenerator = mailer(this.config , this.tnxId);
                var msg = mailGenerator.getEmailMsg(null, 'bankAdminProfileChanged');

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
                            "customerId":'0',
                            "emailInd":true,
                            "smsInd":false,
                            "emailAddress":result.emailId,
                            "subject": "Bank Admin Profile Changed Successfully",
                            "message": msg,
                            "userId":"admin",
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };


                var validateResponse = function(error , response){};


                var ws = alertWS(requestObj , validateResponse);
                ws.requestVsoftAlertServer();
            }
        },
        checkAdminAvailability: function(reqBody , callback){
            this.callback = callback;

            this.userName = reqBody.userName;
            var routed = {
                institutionId   : this.config.instId,
                userName        : {
                    $regex: '^' + this.userName + '$',
                    $options: "i"
                }
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.returnAvailability.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        returnAvailability: function(err , result){
            if(!result){
                this.callback(null , {availability : true ,message: 'User ID  '+ this.userName +' is available'});
            }else {
                this.callback(null, {availability: false, message: 'User ID ' + this.userName + ' already exists'});
            }
        },
        listAdmin: function(reqBody , callback){
            this.callback = callback;
            var routed = {
                institutionId       : this.config.instId,
                status              : {
                    $in: [
                        'Active',
                        'Locked',
                        'Not Enrolled'
                    ]
                }
            };
            //'Deleted'
            var fields = 'name adminId emailId userName phoneNo viewAccess createdOn status';
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId , fields);
            var resHandle = this.returnAllAdmin.bind(this);
            mongo.FindMethod(resHandle);
        },
        returnAllAdmin: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        },
        validateLogin: function(reqBody , callback){
            this.callback = callback;
            this.req = reqBody;
            this.reqBody = reqBody.request.body;
            this.password = reqBody.request.body.password;


            var isLoginCaptchaEnabled = this.config.captcha.admin.login;
            if(isLoginCaptchaEnabled){
                var model = mongoModelName.modelName.Captcha;
                var mongo = this.utils.initMongo(model,{uuid:reqBody.request.body.uuid}, generateId());
                var resHandle = this.checkCaptchaForLogin.bind(this);
                mongo.FindOneMethod(resHandle);
            }
            else {
                var adminPolicy = bankPasswordRuleMethod(this.config , this.tnxId);
                var resHandle = this.doLogin.bind(this);
                adminPolicy.getBankPasswordRule(null , resHandle);
            }


        },
        checkCaptchaForLogin: function(err,result){
            if(result) {
                if(result.captcha==this.req.request.body.captcha) {
                    var adminPolicy = bankPasswordRuleMethod(this.config , this.tnxId);
                    var resHandle = this.doLogin.bind(this);
                    adminPolicy.getBankPasswordRule(null , resHandle);

                    return true;
                }
            }

            var error = this.errorResponse.InvalidCaptcha;
            this.loginInfo = {
                userType        : 'bankAdmin',
                userId          : this.req.request.body.userName,
                validUser       : 'No',
                ipAddress       : this.config.userCurrentIp
            };


            this.invalidLogin = invalidLoginMethod(this.config , this.tnxId);
            this.invalidLogin.addInvalidLogin(this.loginInfo);
            this.callback(error , null);
        },
        doLogin: function(err , result) {

            this.loginInfo = {
                userType        : 'bankAdmin',
                userId          : this.reqBody.userName,
                validUser       : 'No',
                ipAddress       : this.config.userCurrentIp
            };

            var routed = {
                institutionId       : this.config.instId,
                userName            : this.reqBody.userName
            };

            var isUserNameCaseSensitive = true;
            if(typeof(result.isUserNameCaseSensitive) != 'boolean'){
                if(this.config.isUserNameCaseSensitive != undefined) {
                    isUserNameCaseSensitive = this.config.isUserNameCaseSensitive;
                }
            } else if(typeof(result.isUserNameCaseSensitive) == 'boolean'){
                isUserNameCaseSensitive = result.isUserNameCaseSensitive;
            }

            if (isUserNameCaseSensitive) {
                routed.userName = this.reqBody.userName;
            }else {
                routed.userName = {
                    $regex: '^'+this.reqBody.userName+'$',
                    $options: "i"
                }
            }

            this.invalidLogin = invalidLoginMethod(this.config , this.tnxId);
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.getAdminPolicy.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        getAdminPolicy: function(err , result){
            this.userDetails = result;
            var adminPolicyMethod = require('../supportMethods/bankPasswordRuleMethods');
            var adminPolicy = adminPolicyMethod(this.config , null);
            this.resHandle = this.validationDone.bind(this);
            var resHandle = this.getEncryptKey.bind(this);
            adminPolicy.getBankPasswordRule(null,resHandle);
        },
        validationDone: function(err , result){
            var error = {};
            this.encryptionKey = result.encryptionKey.toString('base64');
            if(!this.userDetails){
                this.invalidLogin.addInvalidLogin(this.loginInfo);
                error = this.errorResponse.UserNotFoundFailed;
                this.callback(error , null);
            }else{
                this.loginInfo.validUser = 'Yes';
                var decryptedPassword = this.decryptString(this.userDetails.password, this.encryptionKey);
                var jsSHA = require("jssha");
                var shaObj = new jsSHA("SHA-256", "TEXT");
                shaObj.update(decryptedPassword);
                var hash = shaObj.getHash("HEX");
                decryptedPassword = hash;
                if(this.userDetails.status == "Locked"){
                    error = this.errorResponse.UserLoginFailedLocked;
                    this.callback(error , null);
                } else if(this.userDetails.status == "Deleted"){
                    error = this.errorResponse.UserLoginFailedDeleted;
                    this.callback(error , null);
                } else if(this.password != decryptedPassword){
                    this.invalidLogin.addInvalidLogin(this.loginInfo);
                    if(this.userDetails.invalidLoginCount != null && this.userDetails.invalidLoginCount != undefined) {
                        this.userDetails.invalidLoginCount = this.userDetails.invalidLoginCount + 1;
                    } else {
                        this.userDetails.invalidLoginCount = 0;
                    }
                    error = this.errorResponse.UserLoginFailed;
                    if(this.userDetails.invalidLoginCount > (this.finalResult.failedLoginAttempts - 1)){
                        this.userDetails.status = 'Locked';
                        error = this.errorResponse.UserLoginFailedLocked;

                        var mailGenerator = mailer(this.config , this.tnxId);
                        var msg = mailGenerator.getEmailMsg(null, 'bankAdminLocked');

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
                                    "customerId":'0',
                                    "emailInd":true,
                                    "smsInd":false,
                                    "emailAddress":this.userDetails.emailId,
                                    "subject": "Bank Admin Locked",
                                    "message": msg,
                                    "userId":"admin",
                                    "requestId": requestId,
                                    "vfxRequestId": vfxRequestId
                                }
                            }
                        };

                        var validateResponse = function(error , response){};

                        var ws = alertWS(requestObj , validateResponse);
                        ws.requestVsoftAlertServer();
                    }
                    this.userDetails.save();
                    this.callback(error , null);
                }else {
                    var success = {
                        adminId: this.userDetails.adminId,
                        message: 'Bank Admin Login Successful',
                        viewAccess: this.userDetails.viewAccess,
                        nextStep: 'welcome',
                        currency: this.config.currency,
                        userId: this.userDetails.userName,
                        customerOnboarding: this.config.customerOnboarding,
                        customerName: this.userDetails.name,
                        lastLogin: this.userDetails.lastLogin || '',
                        systemConfiguration: this.config.systemConfiguration.admin,
                        sessionValidity: (this.config.adminSession.timedOut) * 60000,
                        alertBefore: (this.config.adminSession.alertBefore) * 1000,
                        isMFAEnabledInAdmin : this.config.isMFAEnabledInAdmin,
                        moduleConfig       : this.config.moduleConfig.client,
                        adminModuleConfig       : this.config.moduleConfig.admin,
                        isAccountMasked: this.config.isAccountMasked
                    };


                    success.viewAccess ={
                        FiSecurityOptions: {
                            ChangePassword :this.config.moduleConfig.admin.fiSecurity.changePassword && this.userDetails.viewAccess.FiSecurityOptions.ChangePassword,
                            BankPassword  :this.config.moduleConfig.admin.fiSecurity.fiUserPasswordRules && this.userDetails.viewAccess.FiSecurityOptions.BankPassword,
                            UserSecurity  :this.config.moduleConfig.admin.fiSecurity.fiAdminUser && this.userDetails.viewAccess.FiSecurityOptions.UserSecurity,
                            GroupMail     :this.userDetails.viewAccess.FiSecurityOptions.GroupMail
                        },
                        CustomerSupport: {
                            CustomerOnboarding              : {
                                BranchOnboarding            :this.config.moduleConfig.admin.customerSupport.customerOnBoarding && this.userDetails.viewAccess.CustomerSupport.CustomerOnboarding.BranchOnboarding
                            },
                            CustomerLoginMaintenance       :this.config.moduleConfig.admin.customerSupport.userLoginSupport && this.userDetails.viewAccess.CustomerSupport.CustomerLoginMaintenance,
                            AccountExclusion               :this.config.moduleConfig.admin.customerSupport.accountExclusion && this.userDetails.viewAccess.CustomerSupport.AccountExclusion,
                            BankMail                       :this.config.moduleConfig.admin.customerSupport.irisMail && this.userDetails.viewAccess.CustomerSupport.BankMail,
                            MailWording                    :this.config.moduleConfig.admin.customerSupport.setupMailTemplate && this.userDetails.viewAccess.CustomerSupport.MailWording,
                            DeleteCustomer                 :this.userDetails.viewAccess.CustomerSupport.DeleteCustomer,
                            UserActivityReport             :this.config.moduleConfig.admin.customerSupport.userActivityReport && this.userDetails.viewAccess.CustomerSupport.UserActivityReport,
                            FindUserDetail                 :this.config.moduleConfig.admin.customerSupport.findUserDetails && this.userDetails.viewAccess.CustomerSupport.FindUserDetail
                        },
                        FiPolicies: {
                            AccessType                  :this.config.moduleConfig.admin.fiPolicies.accessTypes && this.userDetails.viewAccess.FiPolicies.AccessType,
                            CustomerUserIdPassword      :this.config.moduleConfig.admin.fiPolicies.customerUseridPasswordRules && this.userDetails.viewAccess.FiPolicies.CustomerUserIdPassword,
                            OtpConfiguration            :this.config.moduleConfig.admin.fiPolicies.otpConfiguration && this.userDetails.viewAccess.FiPolicies.OtpConfiguration,
                            LimitProfile                :this.config.moduleConfig.admin.fiPolicies.transactionLimitProfile && this.userDetails.viewAccess.FiPolicies.LimitProfile,
                            MultiLingual                :this.config.moduleConfig.admin.fiPolicies.languageOptions && this.userDetails.viewAccess.FiPolicies.LimitProfile,
                            Site                        :this.config.moduleConfig.admin.fiPolicies.siteCustomization && this.userDetails.viewAccess.FiPolicies.Site
                        },
                        FileProcessing: {
                            ExtractDownload             :this.config.moduleConfig.admin.fileProcessing.extractDownload && this.userDetails.viewAccess.FileProcessing.ExtractDownload
                        },
                        Reports: {
                            DowntimeReport                 :this.config.moduleConfig.admin.reports.downtimeReport && this.userDetails.viewAccess.Reports.DowntimeReport,
                            InactivityReport               :this.config.moduleConfig.admin.reports.inactiveUsers && this.userDetails.viewAccess.Reports.InactivityReport,
                            InvalidLoginAttemptsReport     :this.config.moduleConfig.admin.reports.loginAttemptsReport && this.userDetails.viewAccess.Reports.InvalidLoginAttemptsReport,
                            CustomerWisePageHits           :this.userDetails.viewAccess.Reports.CustomerWisePageHits,
                            PageHitsReport                 :this.config.moduleConfig.admin.reports.pageHitsReport && this.userDetails.viewAccess.Reports.PageHitsReport,
                            FundTransferReport             :this.config.moduleConfig.admin.reports.fundTransferReport && this.userDetails.viewAccess.Reports.FundTransferReport,
                            ReconciliationReport           :this.config.moduleConfig.admin.reports.reconciliationReport && this.userDetails.viewAccess.Reports.ReconciliationReport

                        }

                    };

                    if(!(_.contains(this.userDetails.lastLoginIPCollection, this.config.userCurrentIp))) {
                        this.userDetails.lastLoginIPCollection.push(this.config.userCurrentIp);
                    }
                    if(this.config.isMFAEnabledInAdmin) {
                        success.nextStep = this.config.nextStepTo.goToMFA;

                        if (this.userDetails.securityQuestion.length == 0) success.nextStep = this.config.nextStepTo.goToAddNewSecurityQ;
                    }

                    if(new Date() > this.userDetails.passwordExp) success.nextStep = this.config.nextStepTo.goToChangePassword;

                    if (this.userDetails.firstLogin) success.nextStep = this.config.nextStepTo.goToFirstTimeLogin;

                    this.userDetails.lastLogin = new Date();//(dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
                    this.userDetails.invalidLoginCount = 0;
                    this.userDetails.save();
                    this.req.request.body.userId = this.userDetails.adminId;
                    this.req.request.body.customerName = this.userDetails.name;
                    this.req.request.body.userInfo = {
                        emailId : this.userDetails.emailId,
                        phoneNo : this.userDetails.phoneNo
                    };
                    this.req.request.body.viewAccess = this.userDetails.viewAccess;

                    this.policyResult = success;
                    var handleSession = session.SessionHandle(this.req, this.tnxId);
                    var resHandle = this.getLinkMapper.bind(this);
                    handleSession.login(resHandle);
                }
            }
        },
        getLinkMapper: function(err , result){
            var routed = {
                institutionId       : this.config.instId,
                type                : 'admin'
            };
            var mongo = this.utils.initMongo(this.menuhelpmappermodel ,routed);
            var resHandle = this.getLinkMapperNext.bind(this);
            mongo.FindMethod(resHandle);
        },
        getLinkMapperNext: function(err , result){
            if(!result){
                this.callback(null , {});
            }else{
                var finalResult = {
                    linkMenu : result
                };
                finalResult = _.extend(JSON.parse(JSON.stringify(this.policyResult)),finalResult)
                this.callback(null , finalResult);
            }
        },
        defaultMethod: function(routed , callback){
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindOneMethod(callback);
        },
        defaultAllMethod: function(routed , callback){
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            mongo.FindMethod(callback);
        },
        changeStatusBankAdmin: function(reqBody , callback){
            this.callback = callback;

            this.reqBody = reqBody;

            var routed = {
                adminId                                 : reqBody.adminId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.changeStatusBankAdminDo.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        changeStatusBankAdminDo :function(err,result){
            if(result){
                if(this.reqBody.status == "Active") {
                    result.invalidLoginCount = 0;
                }
                result.status = this.reqBody.status;
                result.save();
                if(this.reqBody.status == "Deleted") {
                    this.callback(null, {message: this.successResponse.AdminDeleted});

                    var mailGenerator = mailer(this.config , this.tnxId);
                    var msg = mailGenerator.getEmailMsg(null, 'bankAdminDeleted');

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
                                "customerId":'0',
                                "emailInd":true,
                                "smsInd":false,
                                "emailAddress":result.emailId,
                                "subject": "Bank Admin Deactivated",
                                "message": msg,
                                "userId":"admin",
                                "requestId": requestId,
                                "vfxRequestId": vfxRequestId
                            }
                        }
                    };


                    var validateResponse = function(error , response){};


                    var ws = alertWS(requestObj , validateResponse);
                    ws.requestVsoftAlertServer();

                } else if(this.reqBody.status == "Locked"){
                    this.callback(null, {message: this.successResponse.AdminLocked});
                    var mailGenerator = mailer(this.config , this.tnxId);
                    var msg = mailGenerator.getEmailMsg(null, 'bankAdminLockedBySupervisor');

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
                                "customerId":'0',
                                "emailInd":true,
                                "smsInd":false,
                                "emailAddress":result.emailId,
                                "subject": "Bank Admin Locked",
                                "message": msg,
                                "userId":"admin",
                                "requestId": requestId,
                                "vfxRequestId": vfxRequestId
                            }
                        }
                    };


                    var validateResponse = function(error , response){};


                    var ws = alertWS(requestObj , validateResponse);
                    ws.requestVsoftAlertServer();

                } else if(this.reqBody.status == "Active"){
                    this.callback(null, {message: this.successResponse.AdminUnlocked});
                    var mailGenerator = mailer(this.config , this.tnxId);
                    var msg = mailGenerator.getEmailMsg(null, 'bankAdminUnlocked');

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
                                "customerId":'0',
                                "emailInd":true,
                                "smsInd":false,
                                "emailAddress":result.emailId,
                                "subject": "Bank Admin Unlocked",
                                "message": msg,
                                "userId":"admin",
                                "requestId": requestId,
                                "vfxRequestId": vfxRequestId
                            }
                        }
                    };


                    var validateResponse = function(error , response){};


                    var ws = alertWS(requestObj , validateResponse);
                    ws.requestVsoftAlertServer();

                }
            } else {
                 var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }
        },
        resetPasswordAdmin: function(reqBody , callback){
            this.callback = callback;

            this.reqBody = reqBody;
            var routed = {
                institutionId               : this.config.instId,
                adminId                                 : reqBody.adminId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.resetPasswordAdminComplete.bind(this);
            mongo.FindOneMethod(resHandle);

        },
        resetPasswordAdminComplete : function(error, result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.result = result;

                var adminPolicy = bankPasswordRuleMethod(this.config , this.tnxId);
                this.resHandle = this.resetBankPasswordWithBankPolicy.bind(this);
                var resHandle = this.getEncryptKey.bind(this);
                adminPolicy.getBankPasswordRule(null , resHandle);
            }
        },
        resetBankPasswordWithBankPolicy: function(err , result) {
            this.encryptionKey = result.encryptionKey.toString('base64');
            if (!this.finalResult) this.finalResult = {};
            this.result.password = this.encryptString(this.createBankPassword(this.finalResult), this.encryptionKey);
            this.result.passwordExp = new Date();

            var resHandle = this.resetBankPasswordWithBankPolicyDone.bind(this);
            this.result.save(resHandle)


        },
        resetBankPasswordWithBankPolicyDone: function(err , result) {
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null, {message: this.successResponse.passwordResetMsg});

                result.password = this.decryptString(result.password, this.encryptionKey) ;

                var mailGenerator = mailer(this.config , this.tnxId);
                var msg = mailGenerator.getEmailMsg(result, 'bankAdminPassword');

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
                            "customerId":'0',
                            "emailInd":true,
                            "smsInd":false,
                            "emailAddress":this.result.emailId,
                            "subject": "Bank Admin Reset Password",
                            "message": msg,
                            "userId":"admin",
                            "requestId": requestId,
                            "vfxRequestId": vfxRequestId
                        }
                    }
                };


                var validateResponse = function(error , response){};


                var ws = alertWS(requestObj , validateResponse);
                ws.requestVsoftAlertServer();
            }

        },
        getAllAdminSQ: function(reqBody , callback) {
            this.callback = callback;

            var routed = {
                institutionId                       : this.config.instId,
                adminId                              : reqBody.userId
            };

            var fields = 'userId userName securityQuestion';
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId , fields);
            var resHandle = this.adminAllSQList.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        adminAllSQList: function(err , result){
            this.resHandle = this.adminAllSQList2.bind(this);
            this.getEncryptKey(err,result);
        },
        adminAllSQList2: function(err , result){
            this.encryptionKey = result.encryptionKey;
            if(!result){
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error , null);
            }else{
                this.finalResult.securityQuestion = [{
                    questionId : this.finalResult.securityQuestion[0].questionId,
                    answer : this.decryptString(this.finalResult.securityQuestion[0].answer,this.encryptionKey),
                },{
                    questionId : this.finalResult.securityQuestion[1].questionId,
                    answer : this.decryptString(this.finalResult.securityQuestion[1].answer,this.encryptionKey),
                },{
                    questionId : this.finalResult.securityQuestion[2].questionId,
                    answer : this.decryptString(this.finalResult.securityQuestion[2].answer,this.encryptionKey),
                },{
                    questionId : this.finalResult.securityQuestion[3].questionId,
                    answer : this.decryptString(this.finalResult.securityQuestion[3].answer,this.encryptionKey),
                },{
                    questionId : this.finalResult.securityQuestion[4].questionId,
                    answer : this.decryptString(this.finalResult.securityQuestion[4].answer,this.encryptionKey),
                }];
                this.callback(null , {adminId: this.finalResult.userId, securityQuestions: this.finalResult.securityQuestion});
            }
        },
        changeSecurityQuestion: function(reqBody , callback) {
            this.callback = callback;

            this.securityQuestion = reqBody.securityQuestion;
            var routed = {
                institutionId                       : this.config.instId,
                adminId                              : reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.changedSQ.bind(this);
            mongo.FindOneMethod(resHandle);

        },
        changedSQ: function(err , result){
            this.resHandle = this.changedSQNext.bind(this);
            this.getEncryptKey(err,result);
        },
        changedSQNext: function(err , result){
            this.encryptionKey = result.encryptionKey;
            if(!result){
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error , null);
            }else{
                this.finalResult.securityQuestion = [{
                    questionId : this.securityQuestion[0].questionId,
                    answer : this.encryptString(this.securityQuestion[0].answer,this.encryptionKey),
                },{
                    questionId : this.securityQuestion[1].questionId,
                    answer : this.encryptString(this.securityQuestion[1].answer,this.encryptionKey),
                },{
                    questionId : this.securityQuestion[2].questionId,
                    answer : this.encryptString(this.securityQuestion[2].answer,this.encryptionKey),
                },{
                    questionId : this.securityQuestion[3].questionId,
                    answer : this.encryptString(this.securityQuestion[3].answer,this.encryptionKey),
                },{
                    questionId : this.securityQuestion[4].questionId,
                    answer : this.encryptString(this.securityQuestion[4].answer,this.encryptionKey),
                }];
                this.finalResult.save();
                this.callback(null , {message: this.successResponse.UpdateSecurityQuestion});
            }
        },
        securityQuestionMFA: function(reqBody , callback) {
            this.callback = callback;

            var routed = {
                institutionId                       : this.config.instId,
                adminId                              : reqBody.userId
            };

            var fields = 'adminId userName securityQuestion.questionId';
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId , fields);
            var resHandle = this.MFARandomQ.bind(this);
            mongo.FindOneMethod(resHandle);

        },
        MFARandomQ: function(err , result){
            if(!result){
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error , null);
            }else{
                var sqSample = _.sample(result.securityQuestion , 2);
                //----------------------//
                var secretQuestions = this.config.secretQuestions[this.config.setLang]
                var secretQuestionsList = null || [];
                for(var data in secretQuestions) {
                    secretQuestionsList = secretQuestionsList.concat(this.config.secretQuestions[this.config.setLang][data]);
                }
                for(var i = 0;i<secretQuestionsList.length; i++){
                    if (secretQuestionsList[i].SNo == sqSample[0].questionId) {
                        sqSample[0]= JSON.parse(JSON.stringify(sqSample[0]));
                        sqSample[0]["question"] = secretQuestionsList[i].Question;
                    }
                    if (secretQuestionsList[i].SNo == sqSample[1].questionId) {
                        sqSample[1]= JSON.parse(JSON.stringify(sqSample[1]));
                        sqSample[1].question = secretQuestionsList[i].Question;
                    }
                }
                this.callback(null , {adminId: result.adminId, securityQuestion: sqSample});
            }
        },
        verifyMFAQuestion: function(reqBody , callback) {
            this.reqBody = reqBody;
            this.callback = callback;

            this.validateSQ = reqBody.securityQuestion;

            var routed = {
                institutionId : this.config.instId
            };
            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.checkSecurityAnswerCaseSensitive.bind(this);
            mongo.FindOneMethod(resHandle);

        },
        checkSecurityAnswerCaseSensitive: function (err, result) {
            this.bankPolicy = result;
            var routed = {
                institutionId                       : this.config.instId,
                adminId                              : this.reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.MFAQuestionHandle.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        MFAQuestionHandle: function(err , result){
            this.resHandle = this.MFAQuestionHandle2.bind(this);
            this.getEncryptKey(err,result);
        },
        MFAQuestionHandle2: function(err , result){
            this.encryptionKey = result.encryptionKey;

            var error = this.errorResponse.UserNotFoundFailed;
            if(!result){
                this.callback(error , null);
            }else{

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
                    found1 = _.findWhere(userSQ , {questionId: sqId1 , answer : this.encryptString(answer1,this.encryptionKey)});
                    found2 = _.findWhere(userSQ , {questionId: sqId2 , answer : this.encryptString(answer2,this.encryptionKey)});
                } else {
                    var q1 = _.findWhere(userSQ , {questionId: sqId1});
                    var q2 = _.findWhere(userSQ , {questionId: sqId2});
                    var a1 = this.decryptString(q1.answer,this.encryptionKey);
                    var a2 = this.decryptString(q2.answer,this.encryptionKey);
                    if(a1.toLowerCase() == answer1.toLowerCase()){
                        found1 = true
                    }
                    if(a2.toLowerCase() == answer2.toLowerCase()){
                        found2 = true
                    }
                }

                if(!found1 || !found2){
                    error = this.errorResponse.UserSQValidationFailed;
                    error.nextStep = this.config.nextStepTo.goToLogout;
                    this.callback(error , null);
                }else{
                    var responseObj = {message : '',  nextStep: this.config.nextStepTo.goToWelcome}
                    this.callback(null , responseObj);
                }
            }
        },
        firstTimeLoginChange: function(reqBody , callback) {
            this.callback = callback;

            this.userId = reqBody.userId;
            this.userName = reqBody.userName;
            this.password = reqBody.password;
            this.securityQuestion = reqBody.securityQuestion;
            this.checkUserId = reqBody.checkUserId;

            var routed = {
                institutionId                       : this.config.instId,
                adminId                              : reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.firstTimeLoginUpdate.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        firstTimeLoginUpdate: function(err , result){
            var error = this.errorResponse.UserNotFoundFailed;
            if(!result){
                this.callback(error , null);
            }else{
                this.UserResult = result;
                this.customerName = result.name;
                this.changeFTLResponse = {message: this.successResponse.updatedFirstTimeLoginMsg , nextStep : this.config.nextStepTo.goToLogout };

                var adminPolicyMethod = require('../supportMethods/bankPasswordRuleMethods');
                var adminPolicy = adminPolicyMethod(this.config , null);
                var resHandle = this.firstTimeLoginDone.bind(this);
                adminPolicy.getBankPasswordRule(null,resHandle);

            }
        },
        firstTimeLoginDone: function(err , result){
            this.resHandle = this.firstTimeLoginDone2.bind(this);
            this.getEncryptKey(err,result);
        },
        firstTimeLoginDone2: function(err , result){
            this.encryptionKey = result.encryptionKey.toString('base64');
            this.UserResult.password = this.encryptString(this.password, this.encryptionKey);
            var dated = new Date();
            dated.setDate(dated.getDate()+this.finalResult.passwordExpirationInfo.numberOfDaysPasswordExpire);
            this.UserResult.passwordExp = dated;
            this.UserResult.securityQuestion = [{
                questionId : this.securityQuestion[0].questionId,
                answer : this.encryptString(this.securityQuestion[0].answer,this.encryptionKey),
            },{
                questionId : this.securityQuestion[1].questionId,
                answer : this.encryptString(this.securityQuestion[1].answer,this.encryptionKey),
            },{
                questionId : this.securityQuestion[2].questionId,
                answer : this.encryptString(this.securityQuestion[2].answer,this.encryptionKey),
            },{
                questionId : this.securityQuestion[3].questionId,
                answer : this.encryptString(this.securityQuestion[3].answer,this.encryptionKey),
            },{
                questionId : this.securityQuestion[4].questionId,
                answer : this.encryptString(this.securityQuestion[4].answer,this.encryptionKey),
            }];

            this.UserResult.firstLogin = false;
            this.UserResult.status = "Active";
            this.UserResult.save();
            var lastPasswordMethod = require('./adminLastPasswordMethods');

            var password = lastPasswordMethod(this.config , this.tnxId);
            password.addPasswordHistory(this.userId , this.password);
            this.callback(null , {
                message: this.successResponse.updatedFirstTimeLoginMsg,
                nextStep: this.config.nextStepTo.goToLogout
            });
            var msgObj = {
                userName : this.UserResult.userName,
                customerName : this.UserResult.name
            };

            var mailGenerator = mailer(this.config , this.tnxId);
            var msg = mailGenerator.getEmailMsg(msgObj, 'changedPassword');

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
                        "customerId":'0',
                        "emailInd":true,
                        "smsInd":false,
                        "emailAddress":this.UserResult.emailId,
                        "subject": "Login Credentials Changed",
                        "message": msg,
                        "userId":this.UserResult.adminId,
                        "requestId": requestId,
                        "vfxRequestId": vfxRequestId
                    }
                }
            };


            var validateResponse = function(error , response){};


            var ws = alertWS(requestObj , validateResponse);
            ws.requestVsoftAlertServer();
        },
        changeAdminSecurityQuestion: function(reqBody , callback){
            this.callback = callback;

            this.securityQuestion = reqBody.securityQuestion;
            var routed = {
                institutionId                       : this.config.instId,
                adminId                              : reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.changedAdminSQ.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        changedAdminSQ: function(err , result){
            this.resHandle = this.changedAdminSQNext.bind(this);
            this.getEncryptKey(err,result);
        },
        changedAdminSQNext: function(err , result){
            this.encryptionKey = result.encryptionKey;
            if(!result){
                var error = this.errorResponse.UserNotFoundFailed;
                this.callback(error , null);
            }else{
                this.finalResult.securityQuestion = [{
                    questionId : this.securityQuestion[0].questionId,
                    answer : this.encryptString(this.securityQuestion[0].answer,this.encryptionKey),
                },{
                    questionId : this.securityQuestion[1].questionId,
                    answer : this.encryptString(this.securityQuestion[1].answer,this.encryptionKey),
                },{
                    questionId : this.securityQuestion[2].questionId,
                    answer : this.encryptString(this.securityQuestion[2].answer,this.encryptionKey),
                },{
                    questionId : this.securityQuestion[3].questionId,
                    answer : this.encryptString(this.securityQuestion[3].answer,this.encryptionKey),
                },{
                    questionId : this.securityQuestion[4].questionId,
                    answer : this.encryptString(this.securityQuestion[4].answer,this.encryptionKey),
                }];

                this.finalResult.save();
                this.callback(null , {message: this.successResponse.UpdateSecurityQuestion, otpForService: 'changeSecurityQuestion', nextStep: this.config.nextStepTo.goToWelcome });
            }
        },
        resetSecurityQuest: function(reqBody , callback){
            this.callback = callback;

            this.reqBody = reqBody;
            var routed = {
                institutionId               : this.config.instId,
                adminId                                 : reqBody.adminId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.resetSecurityQuestComplete.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        resetSecurityQuestComplete: function(err , result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.result = result;

                var adminPolicy = bankPasswordRuleMethod(this.config , this.tnxId);
                this.resHandle = this.resetSecurityQuestWithBankPolicy.bind(this);
                var resHandle = this.getEncryptKey.bind(this);
                adminPolicy.getBankPasswordRule(null , resHandle);
            }
        },
        resetSecurityQuestWithBankPolicy: function(err , result){
            if(!result) result = {};
            this.result.securityQuestion = [];
            this.result.save();
            this.callback(null , {message : this.successResponse.securityQuestionResetMsg});

            var msgObj = {
                userName : this.result.userName,
                customerName : this.result.name
            };

            var mailGenerator = mailer(this.config , this.tnxId);
            var msg = mailGenerator.getEmailMsg(msgObj, 'resetSecurityQuestions');

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
                        "customerId":'0',
                        "emailInd":true,
                        "smsInd":false,
                        "emailAddress":this.result.emailId,
                        "subject": "Reset Security Questions",
                        "message": msg,
                        "userId":this.result.adminId,
                        "requestId": requestId,
                        "vfxRequestId": vfxRequestId
                    }
                }
            };


            var validateResponse = function(error , response){};


            var ws = alertWS(requestObj , validateResponse);
            ws.requestVsoftAlertServer();
        }



    };

    module.exports = function(config , tnxId){
        return (new BankAdmin(config , tnxId));
    };
})();