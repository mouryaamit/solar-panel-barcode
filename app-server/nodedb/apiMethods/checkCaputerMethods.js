/**
 * Created by amitmourya on 29/08/16.
 */
(function(){

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var coreCaller = require('../server/CheckCapture/createWs');

    var userMethods = require('./userMethods');

    var moment  = require('moment');

    function CheckCapture(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.errorMessage = this.errorResponse.genericMessage;
        this.userMethods = userMethods(this.config,this.tnxId)
    }

    CheckCapture.prototype = {
        /*getDepositHistory : function (reqBody,callback) {
            this.reqBody = reqBody;
            this.callback = callback;
        },*/
        deleteCheck : function (reqBody,callback) {
            this.reqBody = reqBody;
            this.callback = callback;
            var routed = {
            };
            var uri = this.config.vsoftCheckCaptureServer.instId + "/Users/" + this.reqBody.userName + "/Deposits/"+ this.reqBody.TransactionId +"/Checks/"+this.reqBody.checkId;
            var method = "DELETE";
            var resHandle = this.deleteCheckDone.bind(this);
            var core = coreCaller(routed,resHandle,this.config,method,uri);
            core.requestCore()
        },
        deleteCheckDone : function (err,result) {
            if(result && result.ErrorCode == 0){
                this.callback(null,result)
            } else {
                this.callback(this.errorMessage, null);
            }
        },
        discardDeposit : function (reqBody,callback) {
            this.reqBody = reqBody;
            this.callback = callback;
            var routed = {
            };
            var uri = this.config.vsoftCheckCaptureServer.instId + "/Users/" + this.reqBody.userName + "/Deposits/"+ this.reqBody.TransactionId +"/Checks"
            var method = "DELETE";
            var resHandle = this.discardDepositDone.bind(this);
            var core = coreCaller(routed,resHandle,this.config,method,uri);
            core.requestCore()
        },
        discardDepositDone : function (err,result) {
            if(result && result.ErrorCode == 0){
                this.callback(null,result)
            } else {
                this.callback(this.errorMessage, null);
            }
        },
        depositCheck : function (reqBody,callback) {
            this.reqBody = reqBody;
            this.callback = callback;
            var routed = {
                institutionId: this.config.instId,
                userName: this.reqBody.userName
            };
            var resHandle = this.depositCheckNext.bind(this);
            this.userMethods.defaultMethod(routed, resHandle);
        },
        depositCheckNext : function (err,result) {
            var routed = {
                "startTran": {
                    "InstId":this.config.vsoftCheckCaptureServer.instId,
                    "ApplicationId":this.config.vsoftCheckCaptureServer.ApplicationId,
                    "UserId":result.userName,
                    "Email":result.emailId,
                    "ImageView":"2",
                    "AccountNumber":this.reqBody.startTran.AccountNumber,
                    "AccountType":this.config.vsoftCheckCaptureServer.accountTypeMapping[this.reqBody.startTran.AccountType],
                    "ConsumerId" :"4",
                    "LocationId" :"1",
                    "ImageFormat":"2"
                },
                "TransactionId":this.reqBody.TransactionId || "",
                "Amount":this.reqBody.Amount,
                "frontImage":this.reqBody.frontImage,
                "rearImage":this.reqBody.rearImage,
                "ReturnImage":true,
                "channel":this.config.vsoftCheckCaptureServer.channel
            };
            var uri = this.config.vsoftCheckCaptureServer.instId + "/Users/" + result.userName + "/Checks";
            var method = "POST";
            var resHandle = this.depositCheckDone.bind(this);
            var core = coreCaller(routed,resHandle,this.config,method,uri);
            core.requestCore()
        },
        depositCheckDone : function (err,result) {
            if(result && result.ErrorCode == 0){
                this.callback(null,result)
            } else if(result && result.ErrorCode){
                this.errorMessage.responseData = result;
                this.errorMessage.responseData.message = result.ErrorDesc;
                this.callback(this.errorMessage, null);
            } else {
                this.callback(this.errorMessage, null);
            }
        },
        transmit : function (reqBody,callback) {
            this.reqBody = reqBody;
            this.callback = callback;
            var routed = {
                "TransactionId":this.reqBody.TransactionId,
                "action":"accept"
            };
            var uri = this.config.vsoftCheckCaptureServer.instId + "/Users/" + this.reqBody.userName + "/channels/"+ this.config.vsoftCheckCaptureServer.channel +"/Transactions"
            var method = "PUT";
            var resHandle = this.transmitDone.bind(this);
            var core = coreCaller(routed,resHandle,this.config,method,uri);
            core.requestCore()
        },
        transmitDone : function (err,result) {
            if(result && result.ErrorCode == 0){
                this.callback(null,result)
            } else {
                this.callback(this.errorMessage, null);
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new CheckCapture(config , tnxId));
    };
})();