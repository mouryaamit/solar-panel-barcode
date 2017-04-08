var generateId = require('time-uuid/time');
var config  = require('../../lib/config/iris');
var vsoftAlerts = config.vsoftAlertServer;
var alertsServiceURL = "http://"+vsoftAlerts.vsoftAlertServerHostname + ":" + vsoftAlerts.vsoftAlertServerPort +vsoftAlerts.vsoftAlertServerPath;

exports.sendAccountAlert = function(alertObj) {
	
   if(alertObj==null){
	   console.error("----> FAILED TO SEND ALERT FOR : "+alertObj.alertType);
	   return;
   }
	   
   var vfxRequestId = generateId();
   var requestId = generateId();
   
   var requestObj = {
       "vfxRequestId": vfxRequestId,
       "requestHeader": {
           "serviceIdentity": {
               "serviceProviderName": "VSOFT",
               "serviceName": "IRIS"
           },
           "credentialsRqHdr": {
               "userId": "IRIS"
           },
           "clientIp": "127.0.0.1"
       },
       "requests": [{
           "REQUEST_NAME": "AlertRq",
           "INSTANCE": {
        	   "alertType": alertObj.alertType,
               "bankId": alertObj.bankId,
               "userId": alertObj.userId,
               "customerId": alertObj.customerId,
               "targetAccountNumber":alertObj.targetAccountNumber,
               "accountNo":alertObj.accountNumber,
               "amount":{
             	  "amount":alertObj.amount,	
             	  "currency":"USD"
               },
               "emailInd": true,
               "smsInd": true,
               "emailAddress": ((alertObj.emailAddress!=undefined)?alertObj.emailAddress:""),
               "phoneNo": ((alertObj.mobileNo!=undefined)?alertObj.mobileNo:""),
               "isTransferFrom":alertObj.isFromAccount,
               "requestId": requestId,
               "vfxRequestId": vfxRequestId
           }
       }]
   };
   
   console.log("ALERTS SERVICE URL ---> "+alertsServiceURL);
   console.log(JSON.stringify(requestObj));
   
   var request = require('sync-request');
   try {
	   response = request('POST',alertsServiceURL,{
	        	   		   headers :{
	        	   			   'content-type':'application/json'
	        	   		   },	
	        	   		   body    : JSON.stringify(requestObj),
	        	   		   timeout : 1000
	       				});
   }
   catch(err){
	   console.error("----> ALERT ERROR :"+JSON.stringify(err));
   }
}

