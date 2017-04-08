(function(){

    var utils = require('../lib/utils/utils');

    var messenger = require('../lib/emailGenerator/messenger');

    var bankMailMethod = require('./bankMailMethods');

    var successResponse = require('../gen/successResponseMessage');

    var request = require('sync-request');
    //var errorResponse = require('../gen/errorResponse');

    //var mongoModelName = require('../lib/mongoQuery/mongoModelObj');
    var moment = require('moment');

    var errorResponse = require('../gen/errorResponse');

    var mailer = require('../lib/emailGenerator/emailMethods');

    var alertWS = require('../server/WsAlerts/vsoftAlertWs');

    var generateId = require('time-uuid/time');

    function OrderCheck(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.successResponse = successResponse(config);
        //this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        //this.model = mongoModelName.modelName.StopPayment
    }

    OrderCheck.prototype = {
        addRequestCheck: function(reqBody , callback){
            this.callback = callback;

            var routed = {
                userId              : reqBody.userId,
                userSelectedName    : reqBody.userSelectedName,
                orderCheckId        : this.utils.getToken(),
                accountNo           : reqBody.accountNo,
                phoneNumber         : reqBody.phoneNumber,
                startingCheckNo     : reqBody.startingCheckNo,
                noOfBoxes           : reqBody.noOfBoxes,
                design              : reqBody.design,
                style               : reqBody.style,
                comments            : reqBody.comments
            };

            /*var sendingTo = {
                subject : "Check Order"
            };

            var postOffice = messenger(this.config , this.tnxId);
            postOffice.sendMessage(sendingTo, routed , 'orderCheckBook');

            */

            var mailGenerator = mailer(this.config , this.tnxId);
            var msg = mailGenerator.getEmailMsg(routed, 'orderCheckBook');

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
                        "emailAddress":this.config.customerDataInfoSendTo,
                        "subject": "Check Order",
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

            var bankMail = bankMailMethod(this.config , this.tnxId);
            bankMail.addOrderCheckBook(routed);

            this.callback(null , {provider:'OMNI', message: this.successResponse.OrderCheck, otpForService: 'orderChecks', nextStep: this.config.nextStepTo.goToOrderCheck });
           /* var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.paymentCreated.bind(this);
            mongo.Save(resHandle);*/
        },
        getHarlandUrl: function(urlString, callback){
            this.callback = callback;

            var urlWithEncryptedData = "";
            try {
                var resp = request("GET", urlString,{timeout: 30000});
                resp = resp.getBody('utf8');
                if (resp != undefined || resp != null)
                    urlWithEncryptedData = resp;
            }
            catch(err){
                console.error(err);
            }

            this.callback(null , {provider: 'HARLAND', url: urlWithEncryptedData, otpForService: 'orderChecks', nextStep: this.config.nextStepTo.goToOrderCheck });
        }
    };

    module.exports = function(config , tnxId){
        return (new OrderCheck(config , tnxId));
    };
})();