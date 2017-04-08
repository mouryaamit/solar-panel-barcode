(function(){

    var _ = require('underscore');

    var later = require('later');

    var moment = require('moment');

    var setupAlertCore = require('../server/coreMethods/setupAlertCore');

    var sendingAlertCore = require('../server/coreMethods/sendingAlertCore');

    var deleteAlertCore = require('../server/AlertApis/deleteAlertApi');

    var alertListCore = require('../server/AlertApis/listAlertApi');

    var messenger = require('../lib/emailGenerator/messenger');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    function Alerts(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.Alert;
        this.alertToCore = ['When my login has been reset','When my login attempts exceed the limit','When my balance is greater than','When my balance is less than','For all withdrawal amounts greater than','For all deposit amounts greater than','When these check numbers are cleared','To re-order checks when this check number has cleared','When transfer occurs to/from my account','When a recurring transfer was not processed','When my statement is available' , 'When an ACH batch is processed by my financial institution' , 'When an ACH batch is removed by my financial institution'];
    }

    Alerts.prototype = {
        addAlerts: function(reqBody , callback){
            this.callback = callback;

            this.routed = {
                institutionId       : this.config.instId,
                customerId          : reqBody.customersId,
                userId              : reqBody.userId,
                alertId             : this.utils.getToken(),
                alertCoreId         : '',
                module              : reqBody.module,
                accountInfo         : reqBody.accountInfo,
                alertMessage        : reqBody.alertMessage,
                alertTime           : reqBody.alertTime,
                alertThroughEmail   : reqBody.alertThroughEmail,
                alertThroughPhone   : reqBody.alertThroughPhone
            };

            var routed = {
                institutionId       : this.config.instId,
                userId              : reqBody.userId,
                module              : reqBody.module,
                alertMessage        : reqBody.alertMessage
            };

            var alert = setupAlertCore.SetupAlert(this.routed , this.config , this.tnxId);
            var coreHandle = this.coreAlertResponse.bind(this);
            alert.coreCaller(coreHandle);

        },
        alertExists: function(err , result){
            if(result){
                var error = this.errorResponse.SameAlertFailed;
                this.callback(error , null);
            }else{
                var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
                var resHandle = this.alertCreated.bind(this);
                mongo.Save(resHandle);
            }
        },
        coreAlertResponse: function(err , result){
            if(err){
                this.callback(err , null);
            }else{
                this.routed.alertCoreId = result.alertId;
                var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
                var resHandle = this.alertCreated.bind(this);
                mongo.Save(resHandle);
            }
        },
        alertCreated: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: this.successResponse.CreateAlert});
            }
        },
        editAlert: function(reqBody , callback){
            this.finalCallback = callback;

            this.reqBody = reqBody;
            this.reqBody.customerId = reqBody.customersId;
            var routed = {
                institutionId       : this.config.instId,
                userId              : reqBody.userId,
                alertId             : reqBody.alertId
            };

            this.reqBody.alertEdit = true;
            //this.reqBody.alertCoreId = result.alertCoreId;
            
            var alert = setupAlertCore.SetupAlert(this.reqBody , this.config , this.tnxId);
            var resHandle = this.editAlertResponse.bind(this);
            alert.coreCaller(resHandle);            
        },
        editAlertResponse: function(error,success){
        	if(error){
         	   this.finalCallback({
               	 status: 400,
             	 responseData: {
                     message: this.errorResponse.UpdateAlert
                  }
         	   }, null);
         	}
         	else{
         	   this.finalCallback(null, {message : this.successResponse.UpdateAlert});
         	}
        },
        listAlerts: function(reqBody , callback){
            var originCallback = callback;

            var routed = {
                institutionId       : this.config.instId,
                userId              : reqBody.userId
            };

            this.listAlertCallback = function(error,result){
            	
            	var alertListResponseObj = [];
            	if(error==undefined){
            		alertListResponseObj = result.INSTANCE.alerts;
            	}
            	
                var alertList = [];    
                
                	
                for(i=0;i<alertListResponseObj.length;i++){          
                	var alert = alertListResponseObj[i];
                	var module  = "";
                	var message = alert.alertTypeDesc;
                	var alertToEmail = false;
                	var alertToMobile = false;
                    var amount = "";
                    var checkFrom = "";
                    var checkTo = "";
                	if(alert.alertTypeDesc == "BALANCE GREATER THAN"||alert.alertTypeDesc == "BALANCE LESS THAN"||
                			alert.alertTypeDesc == "WITHDRAWL GREATER THAN"||alert.alertTypeDesc == "DEPOSIT GREATER THAN"||
                			alert.alertTypeDesc == "CHECK NUMBER CLEARING"||alert.alertTypeDesc == "CHECK REORDERING"||
                			alert.alertTypeDesc == "ACCOUNT TRANSFER"||alert.alertTypeDesc == "UNPROCESSED RECURRING TRANSFER"){
                		module="Accounts";
                		//message=message+" ("+alert.accountNo+")";
                	}
                	else if(alert.alertTypeDesc == "ACH BATCH PROCESSED"||alert.alertTypeDesc == "ACH BATCH REMOVED"){
                		module="Ach";            		
                	}
                	else if(alert.alertTypeDesc == "LOGIN RESET"||alert.alertTypeDesc == "USER LOCKED"){
                		module="User";            		
                	}
                	else if(alert.alertTypeDesc == "WIRE TRANSFER PROCESSING"){
                		module="Wire Transfer";            		
                	}
                	else{
                		module="Other";
                	}

                	if(alert.alertToDesc == "ALERT TO EMAIL"){
                		alertToEmail=true;
                		alertToMobile=false;
                	}
                	if(alert.alertToDesc == "ALERT TO MOBILE"){
                		alertToEmail=false;
                		alertToMobile=true;
                	}
                	if(alert.alertToDesc == "ALERT TO BOTH"){
                		alertToEmail=true;
                		alertToMobile=true;
                	}
                	
                	if(alert.alertTypeDesc == "BALANCE GREATER THAN") {
                        message = 'When my balance is greater than';
                        amount = alert.param1;
                    } else if(alert.alertTypeDesc == "BALANCE LESS THAN") {
                        message = 'When my balance is less than';
                        amount = alert.param1;
                    } else if(alert.alertTypeDesc == "WITHDRAWL GREATER THAN") {
                        message = 'For all withdrawal amounts greater than';
                        amount = alert.param1;
                    } else if(alert.alertTypeDesc == "DEPOSIT GREATER THAN") {
                        message = 'For all deposit amounts greater than';
                        amount = alert.param1;
                    } else if(alert.alertTypeDesc == "CHECK NUMBER CLEARING") {
                		message='When these check numbers are cleared';
                        checkFrom = ((alert.param1!=null && alert.param1!=undefined)?alert.param1:"");
                        checkTo = ((alert.param2!=null && alert.param2!=undefined)?alert.param2:"");
                    } else if(alert.alertTypeDesc == "CHECK REORDERING") {
                		message='To re-order checks when this check number has cleared';
                        checkFrom = ((alert.param1!=null && alert.param1!=undefined)?alert.param1:"");
                    } else if(alert.alertTypeDesc == "ACCOUNT TRANSFER") {
                        message='When transfer occurs to/from my account';
                    } else if(alert.alertTypeDesc == "UNPROCESSED RECURRING TRANSFER") {
                		message='When a recurring transfer was not processed';
                    } else if(alert.alertTypeDesc == "LOGIN RESET") {
                		message='When my login has been reset';
                    } else if(alert.alertTypeDesc == "USER LOCKED") {
                		message='When my login attempts exceed the limit';
                    } else if(alert.alertTypeDesc == "WIRE TRANSFER PROCESSING") {
                        message = 'When a wire transfer is submitted for processing';
                    }
                	/*

                	else if(alert.alertTypeDesc == "")
                		message='When my statement is available';
                	else if(alert.alertTypeDesc == "")
                		message='When an ACH batch is processed';
                	else if(alert.alertTypeDesc == "")
                		message='When an ACH import file is submitted for processing';
                	else if(alert.alertTypeDesc == "")
                		message='When an ACH import file is processed';
                	else if(alert.alertTypeDesc == "")
                		message='When an ACH batch was not processed';
                	else if(alert.alertTypeDesc == "")
                		message='When an ACH batch is processed by my financial institution';
                	else if(alert.alertTypeDesc == "")
                		message='When an ACH batch is removed by my financial institution';

                	*/

                	alertList.push({
                		"_id"		   : alert.id,
                        "updatedOn"	   : (new Date()),
                        "createdOn"    : (new Date()),
                        "institutionId": alert.bankId,
                        "userId"	   : "",
                        "alertId"	   : alert.id,
                        "alertCoreId"  : alert.id,
                        "module"	   : module,
                        "alertMessage" : message,
                        "alertThroughEmail": alertToEmail,
                        "alertThroughPhone": alertToMobile,
                        "alertTime" : {
                        	"alertFrom": ((alert.dndFrom!=null && alert.dndFrom!=undefined)?alert.dndFrom:""),
                        	"alertTo"  : ((alert.dndTo!=null && alert.dndTo!=undefined)?alert.dndTo:"")
                        },
                        "accountInfo": {
                            "accountNo": ((alert.accountNo!=null && alert.accountNo!=undefined)?alert.accountNo:""),
                            "amount"   : amount,
                            "checkNo"  : {
                            	 "checkFrom" : checkFrom,
                                 "checkTo"	 : checkTo
                            }
                        }                       
                	});
                }
                
                originCallback(null , alertList);
            };

            this.alertRqObj = {
                bankId: this.config.instId,
                customerId: reqBody.customersId,
                emailAddress: ""
            };

            var userMethods = require('./userMethods');
            var user = userMethods(this.config , this.tnxId);
            var resHandle = this.getUserDetails.bind(this);
            user.defaultMethod(routed , resHandle);



        },
        getUserDetails: function(err , result){
            if(this.utils.isSubUser(result.createdBy,result.originator)){
                this.alertRqObj.emailAddress = result.emailId;
            }
            this.alertRqObj.userId = result.userId;
            alertListCore.ListAlert(this.alertRqObj,this.listAlertCallback,this.config,this.tnxId);
        },
        alertListReturn: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
            	this.callback(null , result);
            }
        },
        deleteAlerts: function(reqBody , callback){
        	this.finalCallback = callback;
            this.alertsDeleted = 0;
            this.bodyLen = reqBody.alertList.length;
            
            for (var i = 0; i < this.bodyLen; i++) {

                var alertId = reqBody.alertList[i].alertId;
                var routed = {
                    institutionId           : this.config.instId,
                    userId                  : reqBody.userId,
                    alertId                 : alertId
                };
                var resHandle = this.deleteAlertsResponse.bind(this);
                deleteAlertCore.DeleteAlert({alertId: alertId,userId:reqBody.userId}, resHandle  ,this.config , this.tnxId);
            }
            
        },
        deleteAlertsResponse: function(error,success){
        	if(success)
            	this.alertsDeleted++;                	
            	
            if(this.alertsDeleted==this.bodyLen){
            	this.finalCallback(null , {message: this.successResponse.DeleteAlert});
            }
            
            if(error){
            	this.finalCallback({
                   	status: 400,
                   	responseData: {
                       message: this.errorResponse.DeleteAlert
                    }
                }, null);                		
            }
            
        },
        sendAlerts: function(reqBody){
            var alertForChannel = ['When my login has been reset','When my login attempts exceed the limit','When a wire transfer is submitted for processing','When an ACH batch is processed','When an ACH import file is submitted for processing','When an ACH import file is processed','When an ACH batch was not processed'];

            if(_.contains(alertForChannel , reqBody.alertMessage)){
                this.isDND = false;
                this.reqBody = reqBody;
                this.emailId = reqBody.emailId;
                this.phoneNo = reqBody.phoneNo;
                var routed = {
                    userId          : reqBody.userId,
                    alertMessage    : reqBody.alertMessage
                };

                var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
                var resHandle = this.alertExistSendMail.bind(this);
                mongo.FindOneMethod(resHandle);
            }
        },
        alertExistSendMail: function(err , result){
            if(result){
                var resHandle = this.sendAlertMail.bind(this);
                this.result = result;
                if(result.alertTime.alertFrom != '' && result.alertTime.alertTo != '') this.isDND = this.checkIsDND();

                if(this.isDND) resHandle = this.sendDNDAlert.bind(this);
                resHandle();
            }
        },
        sendDNDAlert: function(){
            var scheduleNum = 0;
            var currentStr = moment(new Date()).format('HHmm');
            var alertFromStr = (this.result.alertTime.alertFrom).split(":");
            alertFromStr = alertFromStr[0]+alertFromStr[1];
            var alertToStr = (this.result.alertTime.alertTo).split(":");
            alertToStr = alertToStr[0]+alertToStr[1];

            var currentNum = parseFloat(currentStr);
            var alertFromNum = parseFloat(alertFromStr);
            var alertToNum = parseFloat(alertToStr);

            if(alertFromNum <= alertToNum){
                scheduleNum = alertToNum - currentNum;
            }else{
                if(currentNum >= alertFromNum){
                    scheduleNum = 2459 - currentNum + alertToNum;
                }else if(currentNum <= alertToNum){
                    scheduleNum =  alertToNum - currentNum;
                }
            }

            scheduleNum = currentNum + scheduleNum;
            this.scheduleDND(scheduleNum);

        },
        prependZero: function(timeStr){
            var strRt = timeStr;
            for(var i = timeStr.length ;  i < 4; i++){
                strRt = '0' + strRt;
            }

            return strRt;
        },
        scheduleDND: function(scheduleAt){
            var that = this;
            var timeStr = scheduleAt.toString();
            if(timeStr.length < 4) timeStr =  this.prependZero(timeStr);
            var schedule24Time = timeStr.charAt(0) + timeStr.charAt(1) + ':' + timeStr.charAt(2) + timeStr.charAt(3);

            var sendEmailSchd = later.parse.recur().after(schedule24Time).time();

            var timer = later.setInterval(function(){
                that.sendAlertMail();
                timer.clear();
            }, sendEmailSchd);

        },
        checkIsDND: function(){
            var isDND = false;
            var currentStr = moment(new Date()).format('HHmm');
            var alertFromStr = (this.result.alertTime.alertFrom).split(":");
            alertFromStr = alertFromStr[0]+alertFromStr[1];
            var alertToStr = (this.result.alertTime.alertTo).split(":");
            alertToStr = alertToStr[0]+alertToStr[1];

            var currentNum = parseFloat(currentStr);
            var alertFromNum = parseFloat(alertFromStr);
            var alertToNum = parseFloat(alertToStr);

            if(alertFromNum < alertToNum){
                if(currentNum >= alertFromNum && currentNum <= alertToNum){
                    isDND = true;
                }else{
                    isDND = false;
                }
            }else{
                if(currentNum >= alertFromNum){
                    isDND = true;
                }else if(currentNum <= alertToNum){
                    isDND = true;
                }
            }

            return isDND;

        },
        sendAlertMail: function(){

            var alertSender = sendingAlertCore.SendAlert(this.reqBody , this.config , this.tnxId);
            alertSender.coreCaller();
            /*var sendingTo = {
             subject: 'Alert'
             };
             var postOffice = messenger(this.config , this.tnxId);
             postOffice.sendMessage(sendingTo, this.result, 'updateInfo');*/
        }
    };

    module.exports = function(config , tnxId){
        return (new Alerts(config , tnxId));
    };

})();