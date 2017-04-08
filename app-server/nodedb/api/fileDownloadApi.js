(function(){

    var sessionReportMethod = require('../apiMethods/sessionReportMethods');

    var userActivityMethod = require('../apiMethods/userActivityMethods');

    var inValidLoginMethod = require('../apiMethods/inValidLoginMethods');

    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');

    var fileDownloadApi = function fileDownloadApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    fileDownloadApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);

        var body = this.response.request.body;

        if(this.response.gotoRequest == "sessionReport"){
            var splitString = this.body.moduleType.split(',');

            var moduleType = [];
            for(var i = 0 ; i < splitString.length; i++){

                var queryString = (splitString[i]).trim();
                if(queryString.length > 0) moduleType.push(queryString);
            }

            this.body.moduleType = moduleType;

            var session = sessionReportMethod(this.response.config , this.tnxId);
            session.getSessionReport(this.body , resHandle);
        }else if(this.response.gotoRequest == "userActivity"){

            this.body = {};

            this.body.userId = body.userId;
            this.body.customersId = body.customersId;
            this.body.customerType = body.customerType;
            this.body.customerName = body.customerName;
            this.body.download = body.download;

            if(body.userName) this.body.userName = body.userName;
            if(body.passwordExpirationFrom && body.passwordExpirationTo) this.body.passwordExpirationBetween = {fromDate : body.passwordExpirationFrom , lessThan : body.passwordExpirationTo };
            if(body.noBankingSince) this.body.noBankingSince = body.noBankingSince;
            if(body.loginAttemptsFrom && body.loginAttemptsTo) this.body.loginAttemptsBetween = {fromDate : body.loginAttemptsFrom , lessThan : body.loginAttemptsTo };
            if(body.inValidAttempts) this.body.inValidAttempts = body.inValidAttempts;

            var user = userActivityMethod(this.response.config , this.tnxId);
            user.getUserActivityReport(this.body , resHandle);
        }else if(this.response.gotoRequest == "inactiveLogin"){

            var inValidLogin = inValidLoginMethod(this.response.config , this.tnxId);
            inValidLogin.listInValidLogin(this.body , resHandle);
        }else if(this.response.gotoRequest == "transactionInquiry"){

            this.body = {};

            this.body.userId = body.userId;
            this.body.customersId = body.customersId;
            this.body.accountNo = body.accountNo;
            this.body.download = body.download;
            this.body.source = body.source;
            this.body.transactionType = body.transactionType;
            this.body.userSelectedName = body.userSelectedName;
            
            if(body.queryAmount) this.body.queryAmount = body.queryAmount;
            if(body.queryDate) this.body.queryDate = body.queryDate;
            if(body.queryCheque) this.body.queryCheque = body.queryCheque;

            var customer = customerMethod(this.response.config , resHandle , this.tnxId);
            customer.inquiryTransaction(this.body);
        }
    };

    module.exports.fileDownloadApi = function(rin , callback){
        var dApi = new fileDownloadApi(rin , callback);
        dApi.requestApi();
    };
})();