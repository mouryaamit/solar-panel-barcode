(function(){

    //var model = require('../lib/mongoQuery/mongoModelObj');
	var generateId = require('time-uuid/time');
	
    var customerMethod = require('../apiMethods/customerMethods');

    var responseMethod = require('../apiMethods/responseHandleMethods');


    var smsService = require('../lib/sms/smsSender');

    var config = require('../lib/config/iris');

    var utils = require('../lib/utils/utils');
    
    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var fundsTransferApi = function fundsTransferApi(rin , callback){
    	this.config = config;
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
        this.utils = utils.util();
    };

    fundsTransferApi.prototype.requestApi = function(){
    
    	var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var customer = customerMethod(this.response.config , resHandle , this.tnxId);

        debitCreditData = this.response.request.body;
        debitCreditData.bankId = this.config.instId;

        /* Begin : Fetch the email Id and phone No from Mongo for sub-user and send it to 
         * 		   customerMethod's fundsTransfer method 
         * 		   If user is not a sub-user then don't send the email and phone number */
        
        model = mongoModelName.modelName.User;
        console.log(debitCreditData)
    	routed = {
    			institutionId                       : debitCreditData.bankId,
    	        userId                              : debitCreditData.userId,
                "accountsInformation.accountNo"     : debitCreditData.debitFrom.accountNo,
                customerId                          : debitCreditData.customersId
    	};
           
    	var mongo = this.utils.initMongo(model, routed, generateId());
        var resHandle = function(error,result){
            var utils = require('../lib/utils/utils');
            utils = utils.util();
            var isSubUser = utils.isSubUser(result.createdBy,result.originator);
            if(isSubUser){
        		customer.fundsTransfer(debitCreditData, result.emailId, result.contact.mobileNo, customer);
        	}
        	else {
        		customer.fundsTransfer(debitCreditData, "", "", customer);
        	}        	
        };
        mongo.FindOneMethod(resHandle);
        
        /* End */
    	
    };

    module.exports.fundsTransferApi = function(rin , callback){
        var dApi = new fundsTransferApi(rin , callback);
        dApi.requestApi();
    };
})();