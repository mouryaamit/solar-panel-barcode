(function(){

    //var base64 = require('base64-js');
    var generateId = require('time-uuid/time');

    var path = require('path');

    var transactionLimitMethods = require('./transactionLimitsMethods');

    var downloader = require('./fileDownloadMethods');

    var customerInquiry = require('../server/coreMethods/customerInquiryCore');

    var customerSearch = require('../server/coreMethods/customerSearchCore');

    var accountInquiry = require('../server/coreMethods/accountInquiryCore');

    var transactionInquiry = require('../server/coreMethods/transactionInquiryCore');

    var debitCredit = require('../server/coreMethods/debitCreditRequestCore');

    var pendingTransfer = require('../server/coreMethods/pendingTransferCore');

    var bondCalculator = require('../server/coreMethods/bondCalculatorCore');

    var checkImages = require('../server/coreMethods/checkImagesCore');

    var statementSearch = require('../server/coreMethods/statementSearchCore');

    var getStatementFile = require('../server/coreMethods/getStatementFileCore');

    var statementDownload = require('../server/coreMethods/getStatementCore');

    var payveris = require('../server/payveris/payverisCore');

    var mx = require('../server/mx/mxCore');

    var fundsTransferMethods = require('../apiMethods/fundsTransferMethods');

    var coreResponseSchema = require('../gen/coreResponseSchema');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var utils = require('../lib/utils/utils');

    var moment = require('moment');

    var clone = require('clone');

    var errorResponse = require('../gen/errorResponse');

    var fs = require('fs');

    var path = require('path');

    var mkdirp = require("mkdirp")

    var mime = require('mime-types')

    var Customer = function Customer(config , callback , tnxId){
        this.config = config;
        this.userSelectedName = null;
        this.callback = callback;
        this.tnxId = tnxId;
        this.debitCreditData = null;
        this.utils = utils.util();
        this.CaptchaModel = mongoModelName.modelName.Captcha;
        this.errorResponse = errorResponse.ErrorMessage(config);
       /* try {
            transferInstruction.init();
        }
        catch(err){

        }*/

    };

    Customer.prototype = {
        inquiryCustomer: function(rBody){
            var inquiry = customerInquiry.CustomerInquiry(rBody , this.config , this.tnxId);
            inquiry.coreCaller(this.callback);
        },
        statementDownload: function(rBody){
            var statement = statementSearch.StatementSearch(rBody , this.config , this.tnxId);
            statement.coreCaller(this.callback);
        },
        getStatementFile: function(rBody){
            this.reqBody = rBody;
            var resHandle = this.getStatementFileNext.bind(this);
            var statement = getStatementFile.StatementFile(rBody , this.config , this.tnxId);
            statement.coreCaller(resHandle);
        },
        getStatementFileNext : function(error , success){
            if(error){
                this.callback(this.errorResponse.StatementsNotAvailable,null);
            }
            else {

                var base64Data = success.response.statement.data
                var fileType = mime.extension(success.response.statement.type)
                if (fileType.toLowerCase() == "xml") {
                    this.callback(this.errorResponse.StatementsNotAvailable, null);
                } else {
                    var filePath = path.resolve('./nodedb/contentFiles/');
                    var fullPath = filePath + "/" + this.config.instId + "/" + this.reqBody.userId + "/" + moment().format("YYYYMMDD") + "/" + this.utils.maskAccount(this.reqBody.accountNumber,{isAccountMasked:true}) + "-" + this.reqBody.statementDate + "." + fileType;
                    var getDirName = require("path").dirname
                    var that = this;
                    mkdirp(getDirName(fullPath), function (err) {
                        fs.writeFile(fullPath, base64Data, 'base64', function (err) {
                            if (err) {
                                var error = this.errorResponse.OperationFailed;
                                that.callback(error, null)
                            } else {
                                that.callback(null, {
                                    path: moment().format("YYYYMMDD"),
                                    fileName: that.utils.maskAccount(that.reqBody.accountNumber) + "-" + that.reqBody.statementDate,
                                    fileExt: fileType
                                })
                            }
                        });
                    })
                }
            }
        },
        directInquiryCustomer: function(rBody){

            var inquiry = customerInquiry.CustomerInquiry(rBody , this.config , this.tnxId);
            var resHandle = this.allAccounts.bind(this);
            inquiry.directCoreCaller(resHandle);
        },
        allAccounts: function(error , success){
            if(error){
                this.callback(error , null);
            }else{
                this.callback(null , {customerAccounts: success.customerAccounts});
            }
        },
        inquiryAccount: function(rBody){
            var inquiry = accountInquiry.AccountInquiry(rBody , this.config , this.tnxId);
            inquiry.coreCaller(this.callback);
        },
        calculateBond: function(rBody){
            var bond = bondCalculator.BondCalculator(rBody , this.config , this.tnxId);
            bond.coreCaller(this.callback);
        },
        checkImages: function(rBody){
            var images = checkImages.CheckImages(rBody , this.config , this.tnxId);
            var resHandle = this.imagesToBase.bind(this);
            images.coreCaller(resHandle);
        },
        imagesToBase: function(err , result){
            if(err){
                this.callback(err ,null);
            }else{
                var frontBuf = new Buffer(result.base64_frontImage , 'base64');
                var backBuf = new Buffer(result.base64_rareImage , 'base64');
                var responseObj = {
                    checkFrontImage     : frontBuf.toString('base64'),
                    checkRareImage      : backBuf.toString('base64')
                };
                this.callback(null ,responseObj);
            }
        },
        downloadStatement: function(rBody){
            var statement = statementDownload.GetStatement(rBody , this.config , this.tnxId);
            statement.coreCaller(this.callback);
        },
        inquiryTransaction: function(rBody){
        	if(rBody.userSelectedName!=undefined)
        		this.userSelectedName = rBody.userSelectedName;
        	
            this.reqBody= rBody;
            this.userId = rBody.userId;
            (rBody.download != 'no')? this.downloadFile = true : this.downloadFile = false;
            this.downloadMethod = downloader(this.config , rBody.download , rBody.accountNo, rBody.userId , this.tnxId);
            this.fileType = rBody.download;

            var inquiry = transactionInquiry.TransactionInquiry(rBody , this.config , this.tnxId);
            var resHandle = this.processTransactionHistory.bind(this);
            inquiry.coreCaller(resHandle);
        },
        processTransactionHistory: function(err , result){
            if(err){
                this.callback(err , null);
            }else{
                if(this.downloadFile){

                    var response = result.transactionsData;
                    var jsonArray = [];
                    var quickenArray = [];
                    for(var i = 0 ; i < response.length; i++){
                        if(response[i].showPostedDate) {
                        var quickenObj = {
                            accountNo       : response[i].accountNumber,
                            posted          : response[i].postedDate.date ? response[i].postedDate.date : "",
                            transactionAmt  : (parseFloat(response[i].currentAmount)).toFixed(2),
                            debitOrCredit   : response[i].debitOrCredit,
                            transcode       : response[i].transcode,
                            check           : response[i].checkNumber,
                            reference       : response[i].reference,
                            description     : response[i].description,
                            accountCategory : this.reqBody.accountCategory,
                            fromDate        : this.reqBody.queryDate.fromDate.date,
                            toDate          : this.reqBody.queryDate.toDate.date
                        };

                        var jsonObj = {
                            accountNo       : response[i].accountNumber,
                            posted          : response[i].postedDate.date,
                            transactionAmt  : (parseFloat(response[i].currentAmount)).toFixed(2),
                            check           : response[i].checkNumber,
                            reference        : response[i].reference,
                            description     : response[i].description,
                            runningBalance  : response[i].stmtRunningBal
                        };
                        if(response[i].accountNumber == "" || response[i].accountNumber == undefined || response[i].accountNumber == null){
                            jsonObj.accountNo = this.reqBody.accountNo;
                            quickenObj.accountNo = this.reqBody.accountNo;
                        }
                        jsonArray.push(jsonObj);
                        quickenArray.push(quickenObj);
                    }
                    }

                    var headers = ['Account Number', 'Posted' , 'Transaction Amount' , 'Check Number' , 'Reference' , 'Description', 'Running Balance'];

                    this.downloadMethod.parseData(jsonArray , headers , this.callback , 'transactionReport',quickenArray,this.userId);
                }else{
                    this.callback(null ,result);
                }
            }
        },
        pendingTransaction: function(rBody){

            var YYYYMMDD_date = this.utils.formatDateTo_YYYYMMDD_String(new Date());
            var theProcessingDateObject = this.utils.format_YYYYMMDD_DateStringToDate(YYYYMMDD_date);

            //var inquiry = pendingTransfer.PendingTransfer(rBody , this.config , this.tnxId);
            //inquiry.coreCaller(this.callback);
            var timezoneOffset = (new Date().getTimezoneOffset())*60*1000;

            var finalCallback = this.callback;
            var txnId = this.tnxId;
            var theBankId = this.config.instId;
            var theUserId = rBody.userId;
            var util = this.utils;
            var transferMethods = fundsTransferMethods(this.config, generateId());
            transferMethods.retrieveInstructionsByUser(
                theBankId,
                theUserId,
                function(err, document){
                    var recurring = [];
                    var onetime = [];
                    var instId = 0;
                    if(document!=undefined && document!=null) {
                        for (i = 0; i < document.instructions.length; i++) {
                            var inst = document.instructions[i];

                            if(inst.dateOfInstruction!=null)
                                inst.dateOfInstruction=util.getDateForLocalTimezone(inst.dateOfInstruction);

                            if(inst.startDate!=null)
                                inst.startDate=util.getDateForLocalTimezone(inst.startDate);

                            if(inst.endDate!=null)
                                inst.endDate=util.getDateForLocalTimezone(inst.endDate);

                            if (!(inst.endDate-theProcessingDateObject>=0)){
                            	continue;
                            }
                            
                            instId++;
                            //console.log(inst);
                            var startDate = util.formatDateTo_VSOFT_MMDDYYYY_String(inst.startDate);
                            //var startYear = startDate.substring(6);
                            var endDate = util.formatDateTo_VSOFT_MMDDYYYY_String(inst.endDate);
                            //var endYear = endDate.substring(6);
                            //console.log("---------> Start Year : "+startYear);
                            //console.log("---------> End Year   : "+endYear);
                            //console.log("---------> Difference : "+((parseInt(endYear)-parseInt(startYear))));
                            //if((parseInt(endYear)-parseInt(startYear))==100)
                            //	endDate="";
                            
                            var tmp = {
                                "instructionId": inst._id,
                                "sourceBankId": theBankId,
                                "sourceAccountNo": inst.sourceAccountNo,
                                "targetBankId": theBankId,
                                "targetAccountNo": inst.targetAccountNo,
                                "transferAmount": String(inst.amount),
                                "numberOfTransfers": 0,
                                "automaticTransfer": '',
                                "allowOverdraft": '',
                                "isActive": '',
                                "transferFrequency": inst.frequency,
                                "instructionStatus": 0,
                                "instructionDate": {
                                    "date": util.formatDateTo_VSOFT_MMDDYYYY_String(inst.dateOfInstruction)
                                },
                                "startDate": {
                                    "date": util.formatDateTo_VSOFT_MMDDYYYY_String(inst.startDate)
                                },
                                "endDate": {
                                    "date": endDate
                                },
                                "remarks": inst.description
                            };

                            if (util.compareDates(inst.startDate, inst.endDate))
                                onetime.push(tmp);
                            else
                                recurring.push(tmp);
                        }
                    }
                    var pendingTransfers = clone(coreResponseSchema.pendingTransfer);
                    //pendingTransfers.RESPONSE_NAME='PendingTransferInqRs';
                    pendingTransfers.INSTANCE.onetime=onetime;
                    pendingTransfers.INSTANCE.recurring=recurring;
                    pendingTransfers.INSTANCE.requestId=generateId();
                    pendingTransfers.INSTANCE.status.statusCode = '00';
                    pendingTransfers.INSTANCE.status.severity = 'SUCCESS';

                    console.log(JSON.stringify(pendingTransfers.INSTANCE));

                    finalCallback(null,pendingTransfers.INSTANCE);
                });

        },
        debitCredit: function(rBody){
            this.rBody = rBody;

            var transactionLimit = transactionLimitMethods(this.config , this.tnxId);
            var routed = {
                institutionId           : this.config.instId,
                userId                  : rBody.userId,
                transactionType         : 'Funds',
                transactionAmount       : rBody.debitFrom.transactionAmount.amount
            };
            var resHandle = this.transactionCheck.bind(this);
            transactionLimit.transactionPerDay(routed , resHandle);
        },

        transferInstructions: function(params, callback){
            if(params==undefined){
                callback(null,null);
            }
            this.instructionsCallback = callback;
            this.theBankId = params.institutionId;
            this.theUserId = params.userId;
            this.theAccountNoList = params.accounts;
            this.transferInstructionsList = [];

            var resHandle = this.populateTransferInstructionObjects.bind(this);
            var transferMethods = fundsTransferMethods(this.config, generateId());
            transferMethods.retrieveInstructionsByUser(this.theBankId, this.theUserId,resHandle);
        },

        populateTransferInstructionObjects: function(instructionObject){
            this.accountsLength = this.theAccountNoList.length;
            for(i=0;i< this.accountsLength;i++){
                var accNo = this.theAccountNoList[i];
                this.transferInstructionsList.push({
                    "accountNo":accNo,
                    "instructionIds":[]
                });
            }
            if(instructionObject==null || instructionObject.length==0){
                this.instructionsCallback(this.transferInstructionsList);
            }

            var instructions = instructionObject[0].instructions;
            var instructionsLength = instructions.length;
            this.transferInstructionsListLength = this.transferInstructionsList.length;
            this.transferInstructionsListLength1 = 0;
            for(var i=0;i<this.transferInstructionsListLength;i++){
                var transferInstruction = this.transferInstructionsList[i];
                var accountNo = transferInstruction.accountNo;

                for(var j=0;j< instructionsLength;j++){
                    if(transferInstruction.accountNo==instructionObject[0].instructions[j].targetAccountNo){
                        var objectId = instructions[j]._id;
                        this.transferInstructionsList[i].instructionIds.push(objectId);
                        this.transferInstructionsListLength1++;
                    }
                }
            }

            this.instructionsCallback(null , this.transferInstructionsListLength1);
            /*if(this.transferInstructionsList[0].instructionIds.length > 0){
                this.callback(null , {message: "success", nextStep:this.config.nextStepTo.goToConfirmDialog,transferInstructionsList:this.transferInstructionsList});
            }else{
                this.callback(null , {message: "success"});
            }*/
},
    /*    editFundsTransfer: function(debitCreditData){

            responseObject = {
                status:200,
                message:'',
                otpForService:'fundsTransfer',
            	nextStep:'fundsTransfer',                
                responseData:{
                	message: ''
                },
                header:null
            };

            var theTransferHistory = [];
            
            var startDate_tmp = (debitCreditData.transactionDate).split('/');
            var startDate_YYYYMMDD = startDate_tmp[2]+"-"+startDate_tmp[0]+"-"+startDate_tmp[1];

            var endDate_tmp = null;
            var endDate_YYYYMMDD = null;
            
            //var debitCreditRequestApi = require('../server/coreApi/debitCreditRequestApi');
            //var dbOrCr  = require('../fundTransfer/debitOrCreditRq');
            //var fundConfig  = require('../fundTransfer/config');
            //var syncRequest = require('sync-request');

            
            if((debitCreditData.expirationDate == ''||debitCreditData.expirationDate == null) &&
                debitCreditData.paySchedule != 'OneTime'){
                endDate_tmp = moment(this.utils.formatDateTo_YYYYMMDD_String(new Date(debitCreditData.transactionDate)),"YYYY-MM-DD");
                endDate_YYYYMMDD = String(moment(endDate_tmp).add(12*100,'months').format("YYYY-MM-DD"));
                console.log("-------------->"+endDate_YYYYMMDD);
            }
            else if ((debitCreditData.expirationDate != '' || debitCreditData.expirationDate != null) &&
                debitCreditData.paySchedule != 'OneTime') {
                endDate_tmp = (debitCreditData.expirationDate).split('/');
                endDate_YYYYMMDD = endDate_tmp[2]+"-"+endDate_tmp[0]+"-"+endDate_tmp[1]
            }
            else if (debitCreditData.paySchedule == 'OneTime'){
                endDate_YYYYMMDD = startDate_YYYYMMDD;
            }
            
            theObjectId = debitCreditData.instructionId;
            theBankId = this.config.instId;
            theCustomerId = debitCreditData.customersId;
            theUserId = debitCreditData.userId;
            theDateOfInstruction = new Date();
            theStartDate = startDate_YYYYMMDD;
            theEndDate  = endDate_YYYYMMDD;
            theSourceAccountNo = debitCreditData.debitFrom.accountNo;
            theSourceAccountCategory = debitCreditData.debitFrom.accountCategory;
            theSourceAccountType = debitCreditData.debitFrom.accountType;
            theTargetAccountNo = debitCreditData.creditTo.accountNo;
            theTargetAccountCategory = debitCreditData.creditTo.accountCategory;
            theTargetAccountType = debitCreditData.creditTo.accountType;
            theAmount = debitCreditData.debitFrom.transactionAmount.amount;
            theFrequency = debitCreditData.frequency.toUpperCase();
            theDescription = debitCreditData.description;
            var theLastTransferDate = null;//lastTransferDate;
            var theNextTransferDate = startDate_YYYYMMDD;//nextTransferDate;
            
            //if(debitCreditData.paySchedule != 'OneTime'){
            /!*
                dated = new Date();
                var currentDate = new Date((dated.getMonth() + 1) + "/" +
                                        dated.getDate() + "/" +
                                        dated.getFullYear().toString().substr(2,2));
                var startDate = new Date(debitCreditData.transactionDate);

                if(this.utils.compareDates(startDate,currentDate)) {

                    var response = syncRequest('POST',
                    	fundConfig.coreUrl,
                        {
                    		headers:{
                    			'content-type':'application/json'
                    		},
                    		body:	JSON.stringify(theDebitOrCreditRequest)
                    	});
                   
                    var statusMsg = "SUCCESS";

                    try {
                        dbOrCrResponse = JSON.parse(response.getBody('utf8'));
                        console.log("----> CORE RESPONSE : "+dbOrCrResponse.status.severity);
                        if (dbOrCrResponse.status.severity == "SUCCESS") {
                            theLastTransferDate = this.utils.formatDateTo_YYYYMMDD_String(new Date());
                            var theLastTransferDateObject = this.utils.format_YYYYMMDD_DateStringToDate(theLastTransferDate);

                            theNextTransferDate = this.utils.computeNextTransferDate(theLastTransferDateObject,
                            												   debitCreditData.frequency.toUpperCase());

                        	theTransferHistory = [{
                        		dateOfTransfer:   theLastTransferDateObject,
                        		status:           'SUCCESS',
                        		retryCount:       0
                        	}]
                        }
                    }
                    catch(err){
                        console.log("----> ERROR IN CORE RESPONSE");
                        statusMsg = "FAILED";
                    }
                }
        	 *!/
            //}
            
            var finalCallback = this.callback;

            transferInstruction.updateInstruction(theBankId,theUserId,
                theDateOfInstruction,theStartDate,theEndDate,
                theSourceAccountNo,theSourceAccountCategory,theSourceAccountType,
                theTargetAccountNo,theTargetAccountCategory,theTargetAccountType,
                theAmount,
                theFrequency,theLastTransferDate,theNextTransferDate, theTransferHistory,
                theDescription,
                theObjectId,
                function(success){
                    if(success){
                        responseObject.message = 'Funds Transfer Request has been successfully updated and sent for processing';
                        responseObject.responseData.message = 'Funds Transfer Request has been successfully updated and sent for processing';
                        finalCallback(null,responseObject);
                    }
                    else{
                        responseObject.message = 'Failed.';
                        responseObject.responseData.message = 'Failed.'; 
                        finalCallback(responseObject,null);
                    }
                });

            /!*
            this.rBody = rBody;

            var transactionLimit = transactionLimitMethods(this.config , this.tnxId);
            var routed = {
                institutionId           : this.config.instId,
                userId                  : rBody.userId,
                transactionType         : 'Funds',
                transactionAmount       : rBody.debitFrom.transactionAmount.amount
            };
            var resHandle = this.continueEditTransfer.bind(this);
            transactionLimit.transactionPerDay(routed , resHandle);
            *!/
        },*/
        deleteFundsTransfer: function(rBody){
            responseObject = {
                status:200,
                message:'',
                otpForService:'fundsTransfer',
            	nextStep:'fundsTransfer',
                responseData:{
                	message: ''
                },
                header:null
            };

            theObjectId = rBody.instructionId;
            theBankId = this.config.instId;
            theUserId = rBody.userId;

            var finalCallback = this.callback;
            var transferMethods = fundsTransferMethods(this.config, generateId());
            transferMethods.deleteInstruction(theObjectId,theBankId,theUserId,
                function(success){
                    if(success){
                        responseObject.message = 'Funds Transfer Instruction Deleted.';
                        responseObject.responseData.message = 'Funds Transfer Instruction Deleted.';
                        finalCallback(null,responseObject);
                    }
                    else{
                        responseObject.message = 'Failed.';
                        responseObject.responseData.message = 'Failed.'; 
                        finalCallback(responseObject,null);
                    }
                });


            /*
            var transactionLimit = transactionLimitMethods(this.config , this.tnxId);
            var routed = {
                institutionId           : this.config.instId,
                userId                  : rBody.userId,
                transactionType         : 'Funds',
                transactionAmount       : rBody.debitFrom.transactionAmount.amount
            };
            var resHandle = this.continueDeleteTransfer.bind(this);
            transactionLimit.transactionPerDay(routed , resHandle);
            */
        },
        payveris: function(rBody){
            var payverisSession  = payveris(this.config , this.tnxId);
            payverisSession.requestSession(rBody, this.callback);
        },
        mx: function(rBody){
            var mxSession  = mx(this.config , this.tnxId);
            mxSession.requestSession(this.callback, rBody.type);
        },
        continueEditTransfer: function(err , success){
            if(err){
                this.callback(err , null);
            }else{
                this.callback(null,success);
                //var debitOrCredit = debitCredit.DebitCredit(this.rBody , this.config , this.tnxId);
                //debitOrCredit.editFundsTransfer(this.callback);
            }
        },
        continueDeleteTransfer: function(err , success){
            if(err){
                this.callback(err , null);
            }else{
                this.callback(null, success);
                //var debitOrCredit = debitCredit.DebitCredit(this.rBody , this.config , this.tnxId);
                //debitOrCredit.deleteFundsTransfer(this.callback);
            }
        },
        transactionCheck: function(err , success){
            if(err){
                this.callback(err , null);
            }else{
                var debitOrCredit = debitCredit.DebitCredit(this.rBody , this.config , this.tnxId);
                debitOrCredit.coreCaller(this.callback);
            }
        },
        debitCreditOneTime: function(error,success){
            console.log("==================");
            console.error(error);
            console.log("==================");
            console.info(success);
            console.log("==================");

            var responseObject = {
                status:200,
                message:'',
                otpForService:'fundsTransfer',
            	nextStep:'fundsTransfer',
                responseData:{
                	message: ''                	
                },
                header:null
            };

            if(success){
                this.logFundsTransferStatus(this.debitCreditData,"SUCCESS",(success.INSTANCE.status.statusDescription || "SUCCESS"), false)
                responseObject.message = 'Funds Transfer Request has been successfully sent for processing';
                responseObject.responseData.message = 'Funds Transfer Request has been successfully sent for processing';                
                this.callback(null,responseObject);
            }
            else{
                this.logFundsTransferStatus(this.debitCreditData,"FAILED",(error || "FAILED"), false)
            	if(error==undefined || error==null){
            		responseObject.message = "Failed";
            		responseObject.responseData.message = "Failed";
            	}
            	else{
            		responseObject.message = error;	
            		responseObject.responseData.message = error;
            	}
                responseObject.status = 500;
                this.callback(responseObject,null);
            }
        },
        debitCreditRecurring: function(debitCreditData, lastTransferDate, nextTransferDate, createTransferHistoryEntry){

            responseObject = {
                status:200,
                message:'',
                otpForService:'fundsTransfer',
            	nextStep:'fundsTransfer',
                responseData:{
                	message: ''
                },
                header:null
            };

            var startDate_tmp = (debitCreditData.transactionDate).split('/');
            var startDate_YYYYMMDD = startDate_tmp[2]+"-"+startDate_tmp[0]+"-"+startDate_tmp[1];

            var endDate_tmp = null;
            var endDate_YYYYMMDD = null;

            if((debitCreditData.expirationDate == ''||debitCreditData.expirationDate == null) &&
                debitCreditData.paySchedule != 'OneTime'){
                endDate_tmp = moment(this.utils.formatDateTo_YYYYMMDD_String(new Date("1/1/9999")),"YYYY-MM-DD");
                endDate_YYYYMMDD = String(moment(endDate_tmp).format("YYYY-MM-DD"));
                console.log("-------------->"+endDate_YYYYMMDD);
            }
            else if ((debitCreditData.expirationDate != '' || debitCreditData.expirationDate != null) &&
                debitCreditData.paySchedule != 'OneTime') {
                endDate_tmp = (debitCreditData.expirationDate).split('/');
                endDate_YYYYMMDD = endDate_tmp[2]+"-"+endDate_tmp[0]+"-"+endDate_tmp[1]
            }
            else if (debitCreditData.paySchedule == 'OneTime'){
                endDate_YYYYMMDD = startDate_YYYYMMDD;
            }

            theBankId = this.config.instId;
            theCustomerId = debitCreditData.customersId;
            theUserId = debitCreditData.userId;
            theDateOfInstruction = new Date();
            theStartDate = startDate_YYYYMMDD;
            theEndDate  = endDate_YYYYMMDD;
            theSourceAccountNo = debitCreditData.debitFrom.accountNo;
            theSourceAccountCategory = debitCreditData.debitFrom.accountCategory;
            theSourceAccountType = debitCreditData.debitFrom.accountType;
            theTargetAccountNo = debitCreditData.creditTo.accountNo;
            theTargetAccountCategory = debitCreditData.creditTo.accountCategory;
            theTargetAccountType = debitCreditData.creditTo.accountType;
            theAmount = debitCreditData.debitFrom.transactionAmount.amount;
            theFrequency = debitCreditData.frequency.toUpperCase();
            theDescription = debitCreditData.description;
            theLastTransferDate = this.utils.formatDateTo_YYYYMMDD_String(lastTransferDate);
            theNextTransferDate = this.utils.formatDateTo_YYYYMMDD_String(nextTransferDate);

            theLoanPaymentType = (debitCreditData.loanPayType==undefined||
                                  debitCreditData.loanPayType==null||
                                  String(debitCreditData).trim().length==0)?null:debitCreditData.loanPayType;

            var finalCallback = this.callback;
            var transferMethods = fundsTransferMethods(this.config, generateId());
            transferMethods.createInstruction(theBankId,theCustomerId,theUserId,
                theDateOfInstruction,theStartDate,theEndDate,
                theSourceAccountNo,theSourceAccountCategory,theSourceAccountType,
                theTargetAccountNo,theTargetAccountCategory,theTargetAccountType,
                theAmount,
                theFrequency,theDescription,theLastTransferDate,theNextTransferDate,
                createTransferHistoryEntry,theLoanPaymentType,
                function(success){
                    if(success){
                        responseObject.message = 'Funds Transfer Request has been successfully sent for processing';
                        responseObject.responseData.message = 'Funds Transfer Request has been successfully sent for processing';
                        finalCallback(null,responseObject);
                    }
                    else{
                        responseObject.message = 'Failed.';
                        responseObject.responseData.message = 'Failed.'; 
                        finalCallback(responseObject,null);
                    }
                });

        },
        
        processFundsTransferAfterOtp: function(otpRedirectData){

        	//var customer = customerMethod(this.config , this.callback , this.tnxId);
        	this.debitCreditData 		= otpRedirectData;
        	this.debitCreditData.bankId = this.config.instId;
        	
            /* Begin : Fetch the email Id and phone No from Mongo for sub-user and send it to 
             * 		   customerMethod's fundsTransfer method 
             * 		   If user is not a sub-user then don't send the email and phone number */
            
            model = mongoModelName.modelName.User;
        	routed = {
        			institutionId                       : this.debitCreditData.bankId,
        	        userId                              : this.debitCreditData.userId
        	};
               
        	var mongo = this.utils.initMongo(model, routed, generateId());
            var resHandle = this.fundsTransferSwitch.bind(this);
            mongo.FindOneMethod(resHandle);
            
            /* End */
        },
        fundsTransferSwitch: function(error,result){
            var isSubUser = this.utils.isSubUser(result.createdBy,result.originator);
        	if(isSubUser){
        		this.fundsTransfer(this.debitCreditData, result.emailId, result.contact.mobileNo, null);
        	}
        	else {
        		this.fundsTransfer(this.debitCreditData, "", "", this);
        	}        	
        },        
        fundsTransfer: function(debitCreditData, emailAddress, mobileNo, that){
        	
        	console.log("<<<<<<<<<<<< BEFORE : debitCreditData : START >>>>>>>>>>>>>");
        	console.log(JSON.stringify(debitCreditData));
            console.log("<<<<<<<<<<<< BEFORE : debitCreditData : END >>>>>>>>>>>>>");

            //HANDLE FOR ISSUES//
        	if(debitCreditData.frequency == "default"){
                debitCreditData.frequency = "Daily"
            }
            if(debitCreditData.paySchedule != 'OneTime' && debitCreditData.paySchedule != 'Recurring'){
                debitCreditData.paySchedule = 'OneTime';
            }
            //HANDLE FOR ISSUES//

            console.log("<<<<<<<<<<<< AFTER : debitCreditData : START >>>>>>>>>>>>>");
            console.log(JSON.stringify(debitCreditData));
            console.log("<<<<<<<<<<<< AFTER : debitCreditData : END >>>>>>>>>>>>>");

        	if(that==null){
        		that=this;
        	}
            var debitRemarks = "",creditRemarks = "";

            if(this.config.systemGenratedFundsTransferDescription.isEnabled){
                var debitObj = {
                    accoutType : debitCreditData.creditTo.accountType,
                    accountNo : debitCreditData.creditTo.accountNo,
                    maskedAccountNo : this.utils.maskAccount(debitCreditData.creditTo.accountNo,{isAccountMasked:true}),
                    trimmedAccountNo : this.utils.trimmedAccountNo(debitCreditData.creditTo.accountNo,4),
                    accoutTypeVerbiage : this.utils.changeAccoutTypeVerbiage(debitCreditData.creditTo.accountType,this.config)
                };
                var creditObj = {
                    accoutType : debitCreditData.debitFrom.accountType,
                    accountNo : debitCreditData.debitFrom.accountNo,
                    maskedAccountNo : this.utils.maskAccount(debitCreditData.debitFrom.accountNo,{isAccountMasked:true}),
                    trimmedAccountNo : this.utils.trimmedAccountNo(debitCreditData.debitFrom.accountNo,4),
                    accoutTypeVerbiage : this.utils.changeAccoutTypeVerbiage(debitCreditData.debitFrom.accountType,this.config)
                };
                debitRemarks = this.utils.replaceString(debitObj,this.config.systemGenratedFundsTransferDescription.debitDescription).substr(0,this.config.systemGenratedFundsTransferDescription.maxLengthOfDefaultRemarks);
                creditRemarks = this.utils.replaceString(creditObj,this.config.systemGenratedFundsTransferDescription.creditDescription).substr(0,this.config.systemGenratedFundsTransferDescription.maxLengthOfDefaultRemarks);
                if(debitCreditData.description){
                    debitRemarks += " " + debitCreditData.description
                    creditRemarks += " " + debitCreditData.description
                }
                debitRemarks = debitRemarks.substr(0,this.config.systemGenratedFundsTransferDescription.maxLengthOfDefaultRemarks);
                creditRemarks = creditRemarks.substr(0,this.config.systemGenratedFundsTransferDescription.maxLengthOfDefaultRemarks);
            } else {
                debitRemarks = debitCreditData.description;
                creditRemarks = debitCreditData.description;
            }
            console.log("debitRemarks : "+debitRemarks)
            console.log("creditRemarks : "+creditRemarks)
            debitCreditData.debitRemarks = debitRemarks;
            debitCreditData.creditRemarks = creditRemarks;
        	  this.config = that.config;
        	  this.callback = that.callback;
              this.tnxId = that.tnxId;
            
        	  var debitCreditRequestApi = require('../server/coreApi/debitCreditRequestApi');
              var sendAccountAlertApi = require('../server/AlertApis/sendAccountAlertApi');

              dated = new Date();

              var currentDate = new Date((dated.getMonth() + 1) + "/" +
                                      dated.getDate() + "/" +
                                      dated.getFullYear().toString().substr(2,2));

              var startDate = new Date(debitCreditData.transactionDate);
              startDate = new Date((startDate.getMonth() + 1) + "/" +
                                    startDate.getDate() + "/" +
                                    startDate.getFullYear().toString().substr(2,2));

              if(debitCreditData.paySchedule == 'OneTime') {
                  if(startDate>currentDate) {
                      that.debitCreditRecurring(debitCreditData, null, null);
                  } else {
                      //customer.debitCredit(debitCreditData);
                      console.log(debitCreditData);

                      debitCreditData.config = that.config;
                      this.debitCreditData = debitCreditData;
                      var finalCallback = that.callback;
                      
                      debitCreditRequestApi.DebitCredit(debitCreditData , function(error,success) {
                      	if(success){
                            that.logFundsTransfer(debitCreditData);

                      		try{
                      			/* Send Alert for Success */
                      			alertObjSrc = {
                                    alertType: 'ACCOUNT TRANSFER',
                                    bankId:	String(debitCreditData.bankId),
                                    userId:	String(debitCreditData.userId),
                                    customerId: String(debitCreditData.customersId),
                                    accountNumber: String(debitCreditData.debitFrom.accountNo),
                                    targetAccountNumber: String(debitCreditData.creditTo.accountNo),
                                    amount:	String(debitCreditData.debitFrom.transactionAmount.amount),
                                    isFromAccount: true,
                                    emailAddress: emailAddress,
                                    mobileNo: mobileNo
                      			}
                      			sendAccountAlertApi.sendAccountAlert(alertObjSrc);
                      			alertObjTarget = {
                                    alertType: 'ACCOUNT TRANSFER',
                                    bankId:	String(debitCreditData.bankId),
                                    userId:	String(debitCreditData.userId),
                                    customerId: String(debitCreditData.customersId),
                                    accountNumber: String(debitCreditData.creditTo.accountNo),
                                    targetAccountNumber: String(debitCreditData.debitFrom.accountNo),
                                    amount:	String(debitCreditData.debitFrom.transactionAmount.amount),
                                    isFromAccount: false,
                                    emailAddress: emailAddress,
                                    mobileNo: mobileNo
                      			}
                      			sendAccountAlertApi.sendAccountAlert(alertObjTarget);                			
                      			/* End Alert for Success */
                      		}
                      		catch(err){
                      			console.error("ERROR IN SENDING ACCOUNT TRANSFER ALERT");
                      		}
                      	}
                      	
                      	that.debitCreditOneTime(error,success);                      	
                      },that.config, that.tnxId);

                  }

              }
              else {
                  var finalCallback = that.callback;
                  if(this.utils.compareDates(startDate,currentDate)) {
                      //customer.debitCredit(debitOrCreditData,that.config,that.txnId)
                      debitCreditData.config = that.config;
                      debitCreditRequestApi.DebitCredit(debitCreditData , function(error,success){
                          //startDate = new Date();

                          if(error) {
                              that.logFundsTransferStatus(debitCreditData,"FAILED",(error || "FAILED"))
                          	try{
                          		/* Send Alert for Failure */
                          		alertObjSrc = {	
                                    alertType: 'UNPROCESSED RECURRING TRANSFER',
                                    bankId:	String(debitCreditData.bankId),
                                    userId:	String(debitCreditData.userId),
                                    customerId: String(debitCreditData.customersId),
                                    accountNumber: String(debitCreditData.debitFrom.accountNo),
                                    targetAccountNumber: String(debitCreditData.creditTo.accountNo),
                                    amount:	String(debitCreditData.debitFrom.transactionAmount.amount),
                                    emailAddress: emailAddress,
                                    mobileNo: mobileNo
                          		}
                      			sendAccountAlertApi.sendAccountAlert(alertObjSrc);                    		
                          		/* End of Alert Sending Code */
                          	}
                      		catch(err){
                      			console.error("ERROR IN SENDING UNPROCESSED RECURRING TRANSFER ALERT");
                      		}
                          	
                      		that.debitCreditRecurring(debitCreditData,null,null,false);
                          }
                          else {
                          
                          	if(success){

                                that.logFundsTransferStatus(debitCreditData,"SUCCESS",(success.INSTANCE.status.statusDescription || "SUCCESS"))
                                that.logFundsTransfer(debitCreditData);

                                try{
                          			alertObjSrc = {
                                        alertType: 'ACCOUNT TRANSFER',
                                        bankId:	String(debitCreditData.bankId),
                                        userId:	String(debitCreditData.userId),
                                        customerId: String(debitCreditData.customersId),
                                        accountNumber: String(debitCreditData.debitFrom.accountNo),
                                        targetAccountNumber: String(debitCreditData.creditTo.accountNo),
                                        amount:	String(debitCreditData.debitFrom.transactionAmount.amount),
                                        isFromAccount: true,
                                        emailAddress: emailAddress,
                                        mobileNo: mobileNo
                          			}
                          			sendAccountAlertApi.sendAccountAlert(alertObjSrc);
                          			alertObjTarget = {
                                        alertType: 'ACCOUNT TRANSFER',
                                        bankId:	String(debitCreditData.bankId),
                                        userId:	String(debitCreditData.userId),
                                        customerId: String(debitCreditData.customersId),
                                        accountNumber: String(debitCreditData.creditTo.accountNo),
                                        targetAccountNumber: String(debitCreditData.debitFrom.accountNo),
                                        amount:	String(debitCreditData.debitFrom.transactionAmount.amount),
                                        isFromAccount: false,
                                        emailAddress: emailAddress,
                                        mobileNo: mobileNo
                          			}
                          			sendAccountAlertApi.sendAccountAlert(alertObjTarget);
                          		}
                          		catch(err){
                          			console.error("ERROR IN SENDING ACCOUNT TRANSFER ALERT");
                          		}
                          	}
                          	
                            startDate = moment(that.utils.formatDateTo_YYYYMMDD_String((new Date())), "YYYY-MM-DD");
                            nextTransferDate = that.utils.computeNextTransferDate(startDate,debitCreditData.frequency.toUpperCase());
                            nextTransferDate = that.utils.format_YYYYMMDD_DateStringToDate(nextTransferDate.format("YYYY-MM-DD"));
                            startDate =  that.utils.format_YYYYMMDD_DateStringToDate(startDate.format("YYYY-MM-DD"));

                            that.debitCreditRecurring(debitCreditData,startDate,nextTransferDate,true);
                            //finalCallback(error,success);
                         }

                      } , that.config  , that.tnxId);
                  }
                  else
                	  that.debitCreditRecurring(debitCreditData,null,null);
              }

        },
        searchCustomer: function(reqBody , callback){
            this.callback = callback;
            this.reqBody = reqBody;

            var rBody = {
                customerId: this.reqBody.customerId,
                accountNumber: this.reqBody.accountNumber,
                firstName: this.reqBody.firstName,
                middleName: this.reqBody.middleName,
                lastName: this.reqBody.lastName
            };
            var resHandle = this.customerSearchResponse.bind(this);

            var search = customerSearch.CustomerSearch(rBody , this.config , this.tnxId);
            search.coreCaller(resHandle);
        },
        customerSearchResponse : function(err,result){
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            } else {
                this.callback(null,result.customerData)
            }
        },
        logFundsTransferStatus : function(reqBody,status,reason,isScheduledTransaction) {
            var loanPayType = (reqBody.loanPayType==undefined||
            reqBody.loanPayType==null||
            String(reqBody.loanPayType).trim().length==0)?"":reqBody.loanPayType;
            if(isScheduledTransaction == undefined || isScheduledTransaction == null){
                isScheduledTransaction = true;
            }
            this.routed0 = {
                transactionDate  : (new Date()),
                institutionId    : reqBody.bankId,
                customerId       : reqBody.customersId,
                userId           : reqBody.userId,
                fromAccountNo    : reqBody.debitFrom.accountNo,
                fromAccountType  : reqBody.debitFrom.accountType,
                toAccountNo      : reqBody.creditTo.accountNo,
                toAccountType    : reqBody.creditTo.accountType,
                amount           : reqBody.debitFrom.transactionAmount.amount,
                remarks          : reqBody.description,
                payType          : loanPayType,
                frequency        : ((reqBody.frequency!=undefined||reqBody.frequency!=null)?String(reqBody.frequency).toUpperCase():""),
                status           : status,
                reason           : reason,
                transactionType  : 'TRANSFERMONEY',
                isScheduledTransaction : isScheduledTransaction
            }

            var user = require('./userMethods');
            user = user(this.config,this.tnxId)
            var that = this;
            user.defaultMethod({userId : reqBody.userId},function(err,result){
                that.routed0.customerName = result.customerName;

                var model = mongoModelName.modelName.FundsTransferStatusLog;
                var mongo0 = that.utils.initMongo(model, that.routed0, generateId());
                var resHandle0 = that.logFundsTransferCallback.bind(that);
                mongo0.Save(resHandle0);
            })

        },
        logFundsTransfer : function(reqBody){

            var loanPayType = (reqBody.loanPayType==undefined||
                               reqBody.loanPayType==null||
                               String(reqBody.loanPayType).trim().length==0)?"":("_"+String(reqBody.loanPayType).toUpperCase());

            var debitPayType =  String(reqBody.debitFrom.accountType).toUpperCase() + "_" + "DEBIT";
            var creditPayType =  String(reqBody.creditTo.accountType).toUpperCase() + "_" + "CREDIT" + loanPayType;

            var model = mongoModelName.modelName.FundsTransferLog;
            var routed0 = {
                transactionDate  : (new Date()),
                institutionId    : reqBody.bankId,
                customerId       : reqBody.customersId,
                fromAccountNo    : reqBody.debitFrom.accountNo,
                fromAccountType  : reqBody.debitFrom.accountType,
                toAccountNo      : reqBody.creditTo.accountNo,
                toAccountType    : reqBody.creditTo.accountType,
                amount           : reqBody.debitFrom.transactionAmount.amount,
                remarks          : reqBody.creditRemarks,
                transactionType  : 'CREDIT',
                payType          : creditPayType
            }
            var mongo0 = this.utils.initMongo(model, routed0, generateId());
            var resHandle0 = this.logFundsTransferCallback.bind(this);
            mongo0.Save(resHandle0);

            var routed1 = {
                transactionDate  : (new Date()),
                institutionId    : reqBody.bankId,
                customerId       : reqBody.customersId,
                fromAccountNo    : reqBody.debitFrom.accountNo,
                fromAccountType  : reqBody.debitFrom.accountType,
                toAccountNo      : reqBody.creditTo.accountNo,
                toAccountType    : reqBody.creditTo.accountType,
                amount           : reqBody.debitFrom.transactionAmount.amount,
                remarks          : reqBody.debitRemarks,
                transactionType  : 'DEBIT',
                payType          : debitPayType
            }
            var mongo1 = this.utils.initMongo(model, routed1, generateId());
            var resHandle1 = this.logFundsTransferCallback.bind(this);
            mongo1.Save(resHandle1);

        },
        logFundsTransferCallback : function(err,result){

        },
        generateCaptcha : function (callback) {
            this.callback = callback;
            var resHandle = this.fetchGeneratedCaptcha.bind(this);
            this.utils.generateCaptcha(resHandle);
        },
        fetchGeneratedCaptcha:function(response){
            this.captchaImage =new Buffer(response.captchaImage).toString('base64');

            var mongo = this.utils.initMongo(this.CaptchaModel ,response , null);
            var resHandle = this.generateCaptchaSaved.bind(this);
            mongo.Save(resHandle);
        },
        generateCaptchaSaved: function(err,result) {
            if(!result){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else {
                this.callback(null,{
                    uuid : result.uuid,
                    captchaImage : "data:image/png;base64,"+this.captchaImage
                })
            }
        }

    };

    module.exports = function(config , callback, tnxId){
        return (new Customer(config , callback, tnxId));
    };
})();