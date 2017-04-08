(function () {
    "use strict";

    var _ = require('underscore');

    var jwt = require('jsonwebtoken');

    var jsSHA = require("jssha");

    var handleSession = require('../lib/prop/session');

    var accessHandler = require('../lib/prop/checkViewAccess');

    var globalConn = require('../lib/prop/globalConnObj');
    //OTP Require
    var entry = require('../api/solar/entryApi');



    module.exports.apiCalls = {

        entry              : 'entry'
    };

    function Route(app , rin) {
        var routes = [
            {
                api                 : 'entry',
                isEncrypted         : false,
                func                : entry.entryApi
            }
        ];

        return function(callback){
            var router = new RouteApi(rin , routes);
            var resHandle = router.sessionController.bind(router);
            resHandle(callback);
        };
    }

    var RouteApi = function(rin , routes){
        this.rin = rin;
        this.rin.config.populate();
        this.rin.config = this.rin.config.getConfig();
        this.rin.config.userCurrentIp = this.rin.header['x-forwarded-for'] || this.ip;
        this.rin.config.instId = this.rin.header['x-inst-id'] || '1';
        this.rin.config.setLang = this.rin.header['x-lang'] || 'EN';
        this.tnxId = rin.header['x-request-id'] || '';
        this.routes = routes;
        this.apiObj = _.findWhere(routes , {api : this.rin.callApi});
    };

    RouteApi.prototype = {
        sessionReturn : function(error , success){
            if(error){
                this.callback(null , error);
            }else{
                var viewPerm = this.apiObj.viewPerm;
                var accessObj = this.rin.session.viewAccess;
                var viewAccess = accessHandler(viewPerm, accessObj, this.rin.config);
                var resHandle = this.checkUserAccess.bind(this);
                viewAccess.checkViewAccess(resHandle);
                //this.apiObj.func(this.rin, this.callback);
            }
        },
        sessionController: function(callback){
            this.callback = callback;

            if(this.apiObj.isEncrypted) {
                var that = this;
                var token = this.rin.request.body.data;
                var isMobileApp = this.rin.request.body.data2;
                var key, shaObj, hash, decoded, download;

                if(isMobileApp == 'bf0ba73833f0998a22430c7d000785ddb7549c13ac9acf0c09d3166a3425b9ed'){
                    decoded = jwt.decode(token)
                    download = this.rin.request.body.download;
                    this.rin.request.body = decoded
                    this.rin.request.body.download = (download) ? download : this.rin.request.body.download;
                }else {
                    var headers = null || [];
                    var header = this.rin.request.headers.cookie.split(';');
                    for (var i = 0; i < header.length; i++) {
                        headers[header[i].split("=")[0].trim()] = unescape(header[i].split("=")[1]).trim();
                    }
                    key = headers['IRIS-Digital-Banking.sig']
                    shaObj = new jsSHA("SHA-256", "TEXT");
                    shaObj.update(key);
                    hash = shaObj.getHash("HEX");
                    if (hash == this.rin.request.body.data2) {
                        try {
                            decoded = jwt.verify(token, key, {algorithms: ["HS256"]})
                            download = this.rin.request.body.download;
                            this.rin.request.body = decoded
                            this.rin.request.body.download = (download) ? download : this.rin.request.body.download;
                        } catch (err) {
                            this.rin.body = {status: 401, responseData: {message: 'Unauthorized Access'}};
                            this.rin.status = 401;
                            return this.callback(null, this.rin);
                        }
                    } else {
                        this.rin.body = {status: 401, responseData: {message: 'Unauthorized Access'}};
                        this.rin.status = 401;
                        return this.callback(null, this.rin);
                    }
                }
            }
            if(globalConn.isDown('Channel') && this.rin.method == "POST"){
                this.rin.body = {status: 400 ,responseData: {message: 'Database Service Not available'}};
                this.rin.status = 400;
                return this.callback(null , this.rin);
            }

            ///multipart/form-data; boundary=----WebKitFormBoundaryT9j7yrBlYg9mN0Em multipartHeader =

            var multiHead = (this.rin.header['content-type']) || '';
            var multipartHeader = multiHead.split(';');
            if(!this.apiObj.contentType || this.apiObj.contentType == this.rin.header['content-type'] || this.apiObj.contentType == multipartHeader[0]){

                if(this.apiObj.inSession) {
                    var resHandle = this.sessionReturn.bind(this);
                    var sessionManagement = handleSession.handleSession(this.rin, resHandle);
                    var sessionHandle = sessionManagement.sessionCaller.bind(sessionManagement);
                    sessionHandle();
                }else{
                    this.apiObj.func(this.rin , this.callback);
                }

            }else{
                this.rin.body = {status: 415 ,responseData: {message: 'Unsupported Media Type'}};
                this.rin.status = 415;
                return this.callback(null , this.rin);
            }
        },
        checkUserAccess: function(error , isAccess){
            if(error){
                this.rin.body = error;
                this.rin.status = error.status;
                this.callback(null , this.rin);
            }else{
                //check if otp is required
                var otpService = this.apiObj.otpService;
                if(otpService && otpService != ''){
                    var otpConfig = otpConfigHandler(this.rin.config , this.tnxId);
                    var resHandle = this.handleOtpService.bind(this);
                    otpConfig.isOtpConfigAvailable(otpService , resHandle);
                }else{
                    this.apiObj.func(this.rin, this.callback);
                }
            }
        },
        handleOtpService: function(isOtpRequired , otpData){
            this.apiObj.func(this.rin, this.callback);
        }
    };

    module.exports.route = function(app , rin){

        return (new Route(app , rin));
    };
})();
/*
 {
 "FiSecurityOptions": {
 "ChangePassword": true,
 "BankPassword": true,
 "UserSecurity": true,
 "GroupMail": false
 },
 "CustomerSupport": {
 "CustomerOnboarding": {
 "BranchOnboarding": true
 },
 "CustomerLoginMaintenance": true,
 "AccountExclusion": true,
 "BankMail": true,
 "MailWording": true,
 "DeleteCustomer": false,
 "UserActivityReport": true,
 "FindUserDetail": true
 },
 "FiPolicies": {
 "AccessType": true,
 "CustomerUserIdPassword": true,
 "OtpConfiguration": true,
 "LimitProfile": true,
 "MultiLingual": true,
 "Site": true
 },
 "FileProcessing": {
 "ExtractDownload": true
 },
 "Reports": {
 "DowntimeReport": true,
 "InactivityReport": true,
 "InvalidLoginAttemptsReport": true,
 "CustomerWisePageHits": false,
 "PageHitsReport": true
 }
 }*/
/*
{
 "UserType": "Business",
 "Accounts": {
 "Overview": true,
 "DetailsHistory": true,
 "Statements": true,
 "StatementsEnrollment": true
 },
 "CheckDeposit": {
 "Deposit": true,
 "DepositHistory": true
 },
 "Payments": {
 "BillPay": false,
 "PendingTransfer": false,
 "FundsTransfer": false,
 "TransferMoneyAtOtherFI": false,
 "PayOtherPeople": false,
 "ThirdPartyTransfer": false
 },
 "PaymentsWireTransfer": {
 "WireTransferAuthorization": false,
 "WireTransferRequest": false,
 "ListBeneficiary": false,
 "RegisterBeneficiary": false
 },
 "PaymentsThirdPartyTransfer": {
 "ListThirdPartyBeneficiary": false,
 "RegisterThirdPartyBeneficiary": false
 },
 "BusinessServicesACH": {
 "ACHFileImportAuthorization": true,
 "ACHFileImport": true,
 "ACHBatchAuthorization": true,
 "ACHRecipients": true,
 "ACHAddNewRecipients": true,
 "CreateNewBatch": true,
 "ACHBatchSummary": true
 },
 "BusinessServicesWireTransfer": {
 "WireTransferAuthorization": true,
 "WireTransferRequest": true,
 "ListBeneficiary": true,
 "RegisterBeneficiary": true
 },
 "BusinessServices": {
 "BusinessFundsTransfer": true,
 "BusinessThirdPartyTransfer": true,
 "PositivePay": false,
 "BillPay": true
 },
 "OtherServices": {
 "OrderChecks": true,
 "StopPayments": true
 },
 "ProfileManagement": {
 "ChangePassword": true,
 "ChangeSecurityQuestion": true,
 "ViewPersonalInfo": true,
 "Reminders": true,
 "Alerts": true
 },
 "AdministrativeTools": {
 "SessionsReport": false,
 "BankMail": true
 },
 "AdministrativeToolsUserManagement": {
 "CreateNewUsers": true,
 "Users": true
 },
 "Calculators": {
 "Bond": true,
 "Retirement": false,
 "Savings": true,
 "Loan": true
 }
 }
 */