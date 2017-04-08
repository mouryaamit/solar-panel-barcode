/**
 * Created by amishra on 17/02/16.
 */
(function(){

    var generateId = require('time-uuid/time');

    var errorResponse = require('../gen/errorResponse');
    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');
    var mongoDbMethod = require('../lib/mongoQuery/mongoDbMethod');
    var utils = require('../lib/utils/utils').util();
    var bankConfigMethod = require('./bankConfigMethods');

    var request = require('sync-request');
    var moment  = require('moment');
    var clone   = require('clone');
    var sendAccountAlertApi = require('../server/AlertApis/sendAccountAlertApi');


    function FundsTransfer(config, tnxId) {
        this.config = config;
        this.tnxId = tnxId;
        this.utils = utils;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.bankConfig = bankConfigMethod(config,tnxId);

        this.bankConfig.getBankConfig(function(err,result) {
            console.log("@@@@@@@@@@@@@@@@@@@@@@")
            console.log(JSON.stringify(err));
            console.log("@@@@@@@@@@@@@@@@@@@@@@")
            console.log(JSON.stringify(result));
            console.log("@@@@@@@@@@@@@@@@@@@@@@")
        });
    }

    FundsTransfer.prototype = {

        retrieveInstructions: function (theConditions, theCallbackFunction) {
            model = mongoModelName.modelName.TransferInstruction;
            routed = theConditions;

            var mongo = this.utils.initMongo(model, routed, generateId());
            mongo.FindMethod(theCallbackFunction);
        },

        retrieveInstructionsByUser: function (theBankId, theUserId, theCallbackFunction) {
            model = mongoModelName.modelName.TransferInstruction;
            routed = {
                bankId: theBankId,
                userId: theUserId
            };

            var mongo = this.utils.initMongo(model, routed, generateId());
            mongo.FindOneMethod(theCallbackFunction);
        },

        createInstruction: function (theBankId, theCustomerId, theUserId,
                                     theDateOfInstruction, theStartDate, theEndDate,
                                     theSourceAccountNo, theSourceAccountCategory, theSourceAccountType,
                                     theTargetAccountNo, theTargetAccountCategory, theTargetAccountType,
                                     theAmount,
                                     theFrequency, theDescription, theLastTransferDate, theNextTransferDate,
                                     createTransferHistoryEntry,theLoanPaymentType,
                                     theCallback) {

            /* A particular customer will have always a single document for all the
             * transfer instructions that he/she places.
             *
             * Once a document is added to the db for the customer the individual transfer
             * instructions will the pushed to the transfer_instructions.instructions[] array
             * inside the transfer_instruction document of the customer.
             *
             * So, fetch the document for the bank id and user id. */

            var theStartDateObject = utils.format_YYYYMMDD_DateStringToDate(theStartDate);
            var theEndDateObject = utils.format_YYYYMMDD_DateStringToDate(theEndDate);

            var theLastTransferDateObject = null;
            if (theLastTransferDate != undefined)
                theLastTransferDateObject = utils.format_YYYYMMDD_DateStringToDate(theLastTransferDate);

            var theNextTransferDateObject = null;
            if (theNextTransferDate != undefined)
                theNextTransferDateObject = utils.format_YYYYMMDD_DateStringToDate(theNextTransferDate);

            var theTransferHistory = [];
            if (createTransferHistoryEntry != undefined && createTransferHistoryEntry == true) {
                theTransferHistory = [{
                    dateOfTransfer: theStartDateObject,
                    status: 'SUCCESS',
                    retryCount: 0
                }];
            }

            var transferInstruction = {
                bankId: theBankId,
                customerId: theCustomerId,
                userId: theUserId,
                instruction: {
                    dateOfInstruction: Date(theDateOfInstruction),
                    startDate: theStartDateObject,
                    endDate: theEndDateObject,
                    sourceAccountNo: theSourceAccountNo,
                    sourceAccountCategory: theSourceAccountCategory,
                    sourceAccountType: theSourceAccountType,
                    targetAccountNo: theTargetAccountNo,
                    targetAccountCategory: theTargetAccountCategory,
                    targetAccountType: theTargetAccountType,
                    loanPayType: theLoanPaymentType,
                    amount: theAmount,
                    frequency: theFrequency,
                    description: theDescription,
                    lastTransferDate: theLastTransferDateObject,
                    nextTransferDate: theNextTransferDateObject,
                    transferHistory: theTransferHistory,
                    status: 'ACTIVE'
                }
            };

            this.transferInstruction = transferInstruction;
            this.callback = theCallback;

            model = mongoModelName.modelName.TransferInstruction;
            routed = {
                bankId: theBankId,
                userId: theUserId
            };

            var mongo = this.utils.initMongo(model, routed, generateId());
            var resHandle = this.checkInstructionExistenceAndSave.bind(this);

            mongo.FindOneMethod(resHandle);
        },

        checkInstructionExistenceAndSave: function (err, result) {
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ - 1")
            console.log(JSON.stringify(result));
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ - 1")
            console.log(JSON.stringify(this.transferInstruction.instruction));

            if (result == null || result.length == 0) {

                var routed = {
                    bankId: this.transferInstruction.bankId,
                    customerId: this.transferInstruction.customerId,
                    userId: this.transferInstruction.userId,
                    instructions: []
                }

                routed.instructions.push(this.transferInstruction.instruction);

                model = mongoModelName.modelName.TransferInstruction;
                var mongo = this.utils.initMongo(model, routed, generateId());

                var resHandle = this.sendCallbackAfterOperation.bind(this);
                mongo.Save(resHandle);

            }
            else {
                var routed = {
                    bankId: result.bankId,
                    customerId: result.customerId,
                    userId: result.userId,
                    instructions: result.instructions
                };

                routed.instructions.push(this.transferInstruction.instruction);

                model = mongoModelName.modelName.TransferInstruction;
                var mongo = this.utils.initMongo(model, routed, generateId(), {_id: result._id});
                var resHandle = this.sendCallbackAfterOperation.bind(this);
                mongo.Update(resHandle);
            }
        },

        updateInstruction: function (theBankId, theUserId,
                                     theNewDateOfInstruction,
                                     theNewStartDate, theNewEndDate,
                                     theNewSourceAccountNo, theNewSourceAccountCategory, theNewSourceAccountType,
                                     theNewTargetAccountNo, theNewTargetAccountCategory, theNewTargetAccountType,
                                     theNewAmount, theNewFrequency,
                                     theLastTransferDate, theNextTransferDate,theLoanPaymentType,
                                     theNewTransferHistory, theDescription, theObjectId, theCallback) {

            this.theObjectId = theObjectId;
            this.callback = theCallback;

            var theNewStartDateObject = utils.format_YYYYMMDD_DateStringToDate(theNewStartDate);
            var theNewEndDateObject = utils.format_YYYYMMDD_DateStringToDate(theNewEndDate);
            var transferInstruction = {
                bankId: theBankId,
                userId: theUserId,
                instruction: {
                    //dateOfInstruction: Date(theNewDateOfInstruction),
                    startDate: theNewStartDateObject,
                    endDate: theNewEndDateObject,
                    sourceAccountNo: theNewSourceAccountNo,
                    sourceAccountCategory: theNewSourceAccountCategory,
                    sourceAccountType: theNewSourceAccountType,
                    targetAccountNo: theNewTargetAccountNo,
                    targetAccountCategory: theNewTargetAccountCategory,
                    targetAccountType: theNewTargetAccountType,
                    loanPayType: theLoanPaymentType,
                    amount: theNewAmount,
                    frequency: theNewFrequency,
                    description: theDescription,
                    lastTransferDate: theLastTransferDate,
                    nextTransferDate: theNextTransferDate,
                    transferHistory: theNewTransferHistory
                }
            };

            this.transferInstruction = transferInstruction;

            model = mongoModelName.modelName.TransferInstruction;
            routed = {
                bankId: theBankId,
                userId: theUserId
            };

            var mongo = this.utils.initMongo(model, routed, generateId());
            var resHandle = this.findInstructionAndUpdate.bind(this);

            mongo.FindOneMethod(resHandle);
        },

        findInstructionAndUpdate: function (err, result) {

            var transferInstruction = this.transferInstruction;

            //console.log("!!!!!!!!!!!");
            //console.log(JSON.stringify(transferInstruction));

            if (result!=undefined && result!=null) {

                var tmpResult = {
                    bankId: result.bankId,
                    customerId: result.customerId,
                    userId: result.userId,
                    instructions: []
                };

                for (i = 0; i < result.instructions.length; i++) {
                    console.log("---> " + this.theObjectId + "\t" + result.instructions[i]._id);
                    if (String(this.theObjectId) == String(result.instructions[i]._id)) {
                        //tmpResult.instructions.splice(i,1);
                        var loanPaymentType =  result.instructions[i].loanPayType;
                        if(loanPaymentType==undefined||loanPaymentType==null)
                            loanPaymentType="";


                        var instruction = {
                            "_id":result.instructions[i]._id,
                            dateOfInstruction: result.instructions[i].dateOfInstruction,
                            startDate: transferInstruction.instruction.startDate,
                            endDate: transferInstruction.instruction.endDate,
                            sourceAccountNo: transferInstruction.instruction.sourceAccountNo,
                            sourceAccountCategory: transferInstruction.instruction.sourceAccountCategory,
                            sourceAccountType: transferInstruction.instruction.sourceAccountType,
                            targetAccountNo: transferInstruction.instruction.targetAccountNo,
                            targetAccountCategory: transferInstruction.instruction.targetAccountCategory,
                            targetAccountType: transferInstruction.instruction.targetAccountType,
                            amount: transferInstruction.instruction.amount,
                            frequency: result.instructions[i].frequency,
                            description: result.instructions[i].description,
                            lastTransferDate: result.instructions[i].lastTransferDate,
                            nextTransferDate: result.instructions[i].nextTransferDate,
                            transferHistory: result.instructions[i].transferHistory,
                            loanPayType: loanPaymentType,
                            status: 'ACTIVE'
                        }

                        console.log("@@@@@");
                        //console.log(instruction);

                        if (transferInstruction.instruction.transferHistory != undefined && transferInstruction.instruction.transferHistory != null)
                            instruction.transferHistory = transferInstruction.instruction.transferHistory;

                        if (transferInstruction.instruction.lastTransferDate != null)
                            instruction.lastTransferDate = transferInstruction.instruction.lastTransferDate;

                        if (transferInstruction.instruction.nextTransferDate != null)
                            instruction.nextTransferDate = transferInstruction.instruction.nextTransferDate;


                        if (transferInstruction.instruction.description != undefined && transferInstruction.instruction.description != null)
                            instruction.description = transferInstruction.instruction.description;

                        tmpResult.instructions.push(instruction);

                        //console.log("@@@@");
                        //console.log(instruction);
                    }
                    else{

                        var loanPaymentType =  result.instructions[i].loanPayType;
                        if(loanPaymentType==undefined || loanPaymentType==null)
                            loanPaymentType="";

                        var instruction = {
                            "_id":result.instructions[i]._id,
                            dateOfInstruction: result.instructions[i].dateOfInstruction,
                            startDate: result.instructions[i].startDate,
                            endDate: result.instructions[i].endDate,
                            sourceAccountNo: result.instructions[i].sourceAccountNo,
                            sourceAccountCategory: result.instructions[i].sourceAccountCategory,
                            sourceAccountType: result.instructions[i].sourceAccountType,
                            targetAccountNo: result.instructions[i].targetAccountNo,
                            targetAccountCategory: result.instructions[i].targetAccountCategory,
                            targetAccountType: result.instructions[i].targetAccountType,
                            amount: result.instructions[i].amount,
                            frequency: result.instructions[i].frequency,
                            description: result.instructions[i].description,
                            lastTransferDate: result.instructions[i].lastTransferDate,
                            nextTransferDate: result.instructions[i].nextTransferDate,
                            transferHistory: result.instructions[i].transferHistory,
                            loanPayType: loanPaymentType,
                            status: 'ACTIVE'
                        }

                        tmpResult.instructions.push(instruction);
                    }
                }

                var routed = tmpResult;

                //console.log("@@@@");
                //console.log(tmpResult);

                model = mongoModelName.modelName.TransferInstruction;
                var mongo = this.utils.initMongo(model, routed, generateId(), {_id: result._id});
                var resHandle = this.sendCallbackAfterOperation.bind(this);
                mongo.Update(resHandle);
            }
            else{
                this.callback(false);
            }

        },

        deleteInstruction: function (theObjectId, theBankId, theUserId, theCallback) {
            this.theObjectId = theObjectId;
            this.callback = theCallback;

            model = mongoModelName.modelName.TransferInstruction;
            routed = {
                bankId: theBankId,
                userId: theUserId
            };

            var mongo = this.utils.initMongo(model, routed, generateId());
            var resHandle = this.findInstructionAndDelete.bind(this);

            mongo.FindOneMethod(resHandle);
        },

        findInstructionAndDelete: function (err, result) {
            var tmpResult = result;

            if (err == null || err == undefined) {
                for (i = 0; i < tmpResult.instructions.length; i++) {
                    console.log("---> " + theObjectId + "\t" + tmpResult.instructions[i]._id);
                    if (this.theObjectId == tmpResult.instructions[i]._id) {
                        tmpResult.instructions.splice(i, 1);
                        break;
                    }
                }
            }

            var routed = {
                bankId: tmpResult.bankId,
                customerId: tmpResult.customerId,
                userId: tmpResult.userId,
                instructions: tmpResult.instructions
            };

            model = mongoModelName.modelName.TransferInstruction;
            var mongo = this.utils.initMongo(model, routed, generateId(), {_id: tmpResult._id});
            var resHandle = this.sendCallbackAfterOperation.bind(this);
            mongo.Update(resHandle);
        },

        sendCallbackAfterOperation: function (err, result) {
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$" +
                " - 2")
            console.log(JSON.stringify(err));
            console.log(JSON.stringify(result));
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ - 2")
            if(this.callback!=undefined){
                if (err == null || err == undefined)
                    this.callback(true);
                else
                    this.callback(false);
            }
        },

        processInstructions: function (theProcessingDate) {
            this.theProcessingDate = theProcessingDate;
            var resHandle = this.processFetchedInstructions.bind(this);
            this.retrieveInstructions({bankId:this.config.instId}, resHandle);
        },

        processFetchedInstructions: function (err,documents) {
            var theProcessingDateObject = this.utils.format_YYYYMMDD_DateStringToDate(this.theProcessingDate);
            var timezoneOffset = (new Date().getTimezoneOffset())*60*1000;

            console.log("\nProcessing Date : " + this.theProcessingDate);
            //console.log(JSON.stringify(documents));
            var documentsLength = ((documents!=null)?documents.length:0);
            console.log("\nTotal documents to process : "+documentsLength);
            for (doci = 0; doci < documentsLength; doci++) {
                for (docj = 0; docj < documents[doci].instructions.length; docj++) {

                    var theBankId = documents[doci].bankId;
                    var theCustomerId = documents[doci].customerId;
                    var theUserId = documents[doci].userId;
                    var theInstruction = documents[doci].instructions[docj];

                    console.log(JSON.stringify(theInstruction));

                    /* Check if the processing date lies between or on the start date and end date
                     * of the instruction. If not then the instruction is already expired/completed it's execution lifetime. */
                    var theTransferStartDate = this.utils.getDateForLocalTimezone(theInstruction.startDate);
                    var theTransferEndDate = this.utils.getDateForLocalTimezone(theInstruction.endDate);
                    var theProcessDate = this.utils.getDateForLocalTimezone(theProcessingDateObject);

                    console.log("theTransferStartDate   : "+theTransferStartDate);
                    console.log("theTransferEndDate     : "+theTransferEndDate);
                    console.log("theProcessDate         : "+theProcessDate);
                    console.log("(theTransferStartDate - theProcessDate)   : "+(theTransferStartDate - theProcessDate));
                    console.log("(theTransferEndDate - theProcessDate)     : "+(theTransferEndDate - theProcessDate));

                    if (theTransferStartDate - theProcessDate <= 0 &&
                        theTransferEndDate - theProcessDate >= 0) {

                        freq = theInstruction.frequency;
                        transferHistory = ((theInstruction.transferHistory != undefined || theInstruction.transferHistory != null) ? theInstruction.transferHistory : []);

                        /* Traverse the transfer history of the current instruction to find out if the current instruction has been
                         * queued for the current processing date */
                        console.log("Transfer History ----------------- >");
                        console.log(JSON.stringify(transferHistory));

                        var foundInTransferHistory = false;
                        for (x = 0; x < transferHistory.length; x++) {
                            var dateOfTransfer = transferHistory[x].dateOfTransfer;
                            if(dateOfTransfer!=null)
                                dateOfTransfer=this.utils.getDateForLocalTimezone(dateOfTransfer);

                            console.log("---> this.utils.compareDates(transferHistory[x].dateOfTransfer,theProcessingDateObject) : " +
                                this.utils.compareDates(dateOfTransfer, theProcessingDateObject));
                            if (this.utils.compareDates(dateOfTransfer, theProcessingDateObject)) {
                                foundInTransferHistory = true;
                                break;
                            }
                        }

                        /* Check the frequency, last transfer date and the next transfer date
                         * If the last transfer date is not set ( i.e undefined )
                         * then
                         *      process the instruction on the current processing date
                         *      and set the last transfer date = the current processing date
                         *      and compute the next transfer date based on the frequency
                         *
                         * else if the last transfer date is equals to the current processing date
                         * then
                         *      Repeat the three setups as specified above. */

                        var theFrequency = theInstruction.frequency;
                        var theLastTransferDate = theInstruction.lastTransferDate;
                        if(theLastTransferDate!=null)
                            theLastTransferDate=this.utils.getDateForLocalTimezone(theLastTransferDate);

                        var theNextTransferDate = theInstruction.nextTransferDate;
                        if(theNextTransferDate!=null)
                            theNextTransferDate=this.utils.getDateForLocalTimezone(theNextTransferDate);


                        console.log("--> foundInTransferHistory : " + foundInTransferHistory);
                        /* If the last transfer date is equals to the current processing date then
                         * the instruction has already been processed for the current processing date
                         * so it should skipped. */
                        if (theLastTransferDate != undefined && theLastTransferDate != null &&
                            this.utils.compareDates(theLastTransferDate, theProcessingDateObject) &&
                            foundInTransferHistory) {
                            continue;
                        }
                        else {
                            /* If the next transfer date is not set or the next transfer date is the current processing date
                             * then process this instruction. */
                            if (theNextTransferDate == undefined || theNextTransferDate == null ||
                                this.utils.compareDates(theNextTransferDate, theProcessingDateObject)) {

                                srcBankId = documents[doci].bankId;
                                srcAccNo = theInstruction.sourceAccountNo;
                                srcAccCategory = theInstruction.sourceAccountCategory;
                                srcAccType = theInstruction.sourceAccountType;
                                srcTrancode = config.srcTrancode;

                                targetBankId = documents[doci].bankId;
                                targetAccNo = theInstruction.targetAccountNo;
                                targetAccCategory = theInstruction.targetAccountCategory;
                                targetAccType = theInstruction.targetAccountType;
                                targetTrancode = config.targetTrancode;

                                loanPayType = theInstruction.loanPayType;

                                currency = this.config.currency.code;
                                amount = theInstruction.amount;

                                transactionDate = this.utils.formatDateTo_VSOFT_MMDDYYYY_String(theProcessingDateObject);
                                transactionTime = this.utils.formatDateTo_VSOFT_MMDDYYYY_String(theProcessingDateObject);

                                transactionMode = this.config.transactionMode;

                                var debitRemarks = "",creditRemarks = "";

                                if(this.config.systemGenratedFundsTransferDescription.isEnabled){
                                    var debitObj = {
                                        accoutType : targetAccType,
                                        accountNo : targetAccNo,
                                        maskedAccountNo : this.utils.maskAccount(targetAccNo,{isAccountMasked:true}),
                                        trimmedAccountNo : this.utils.trimmedAccountNo(targetAccNo,4),
                                        accoutTypeVerbiage : this.utils.changeAccoutTypeVerbiage(targetAccType,this.config)
                                    };
                                    var creditObj = {
                                        accoutType : srcAccType,
                                        accountNo : srcAccNo,
                                        maskedAccountNo : this.utils.maskAccount(srcAccNo,{isAccountMasked:true}),
                                        trimmedAccountNo : this.utils.trimmedAccountNo(srcAccNo,4),
                                        accoutTypeVerbiage : this.utils.changeAccoutTypeVerbiage(srcAccType,this.config)
                                    };
                                    debitRemarks = this.utils.replaceString(debitObj,this.config.systemGenratedFundsTransferDescription.debitDescription).substr(0,this.config.systemGenratedFundsTransferDescription.maxLengthOfDefaultRemarks);
                                    creditRemarks = this.utils.replaceString(creditObj,this.config.systemGenratedFundsTransferDescription.creditDescription).substr(0,this.config.systemGenratedFundsTransferDescription.maxLengthOfDefaultRemarks);
                                    if(theInstruction.description){
                                        debitRemarks += " " + theInstruction.description
                                        creditRemarks += " " + theInstruction.description
                                    }
                                    debitRemarks = debitRemarks.substr(0,this.config.systemGenratedFundsTransferDescription.maxLengthOfDefaultRemarks);
                                    creditRemarks = creditRemarks.substr(0,this.config.systemGenratedFundsTransferDescription.maxLengthOfDefaultRemarks);
                                } else {
                                    debitRemarks = theInstruction.description;
                                    creditRemarks = theInstruction.description;
                                }

                                /* Fetch the JSON request filled with data */
                                var dbOrCrRequest = this.debitOrCreditRq(srcBankId, srcAccNo, srcAccCategory, srcAccType, srcTrancode,
                                    targetBankId, targetAccNo, targetAccCategory, targetAccType, targetTrancode,
                                    currency, amount,
                                    transactionDate, transactionTime, transactionMode,loanPayType,
                                    debitRemarks,creditRemarks);

                                this.sendRequestToCore(theBankId, theUserId, theCustomerId, theInstruction,
                                    theProcessingDateObject, dbOrCrRequest);

                                console.log("Sending request to core for transfer of...");
                                console.log(this.utils.formatDateTo_YYYYMMDD_String(theInstruction.startDate) + "\t" +
                                    this.utils.formatDateTo_YYYYMMDD_String(theInstruction.endDate) + "\t" +
                                    this.utils.differenceOfDates_in_Days(theInstruction.startDate,
                                        theInstruction.endDate) + "\t" +
                                    theInstruction.sourceAccountNo + "\t" +
                                    theInstruction.targetAccountNo + "\t" +
                                    theInstruction.frequency + "\t" +
                                    theInstruction.amount);

                                console.log(JSON.stringify(dbOrCrRequest));

                            }

                        }

                    }
                }
            }

            console.log("\n\n");
        },

        sendRequestToCore: function(theBankId, theUserId, theCustomerId, theInstruction,
                                    theProcessingDate, theDebitOrCreditRequest,
                                    theEmailAddress, theMobileNo, theCallback) {

            var coreUrl = "http://"+this.config.vsoftServer.hostname+":"+this.config.vsoftServer.port+this.config.vsoftServer.path;
            console.log("-->"+coreUrl);
            /* Send the request to Core */
            var response = null;
            try {
                response = request('POST', coreUrl, {
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(theDebitOrCreditRequest)
                });
            }
            catch(err){
                console.log(">> Response not received from core.");
            }

            statusMsg = "SUCCESS";

            try {
                dbOrCrResponse = JSON.parse(response.getBody('utf8'));
                console.log("----> CORE RESPONSE : " + dbOrCrResponse.status.severity);
                if (dbOrCrResponse.status.severity != "SUCCESS") {
                    statusMsg = "FAILED";
                }
                else {
                    statusMsg = "SUCCESS";
                }
            }
            catch (err) {
                console.log("----> ERROR IN CORE RESPONSE");
                statusMsg = "FAILED";
            }

            if(statusMsg == "FAILED"){
                /* Log Recurring Funds Transfer : Begin */

                try {

                    this.logRecurringData = {
                        transactionDate: (new Date()),
                        institutionId: theBankId,
                        customerId: theCustomerId,
                        userId           : theUserId,
                        fromAccountNo: theInstruction.sourceAccountNo,
                        fromAccountType: theInstruction.sourceAccountType,
                        toAccountNo: theInstruction.targetAccountNo,
                        toAccountType: theInstruction.targetAccountType,
                        amount: theInstruction.amount,
                        remarks: theInstruction.description,
                        frequency: theInstruction.frequency,
                        payType  : theInstruction.loanPayType,
                        status: "FAILED",
                        transactionType  : 'TRANSFERMONEY',
                        reason: dbOrCrResponse.status.statusDescription || "FAILED"
                    }

                    var user = require('./userMethods');
                    user = user(this.config,this.tnxId)
                    var that = this;
                    // user.defaultMethod({userId : theUserId},function(err,result){
                    //     that.logRecurringData.customerName = result.customerName;

                        var fundsTransferStatusLogModel = mongoModelName.modelName.FundsTransferStatusLog;
                        var mongo0 = utils.initMongo(fundsTransferStatusLogModel, that.logRecurringData, generateId());
                        var resHandle = function (err, result) {
                        };
                        mongo0.Save(resHandle);
                    // })

                }
                catch(err){
                    console.log("error in recording failed transfer");
                    console.log(err)
                }

                /* Log Recurring Funds Transfer : End */

            }


            if (statusMsg == "SUCCESS") {
                theInstruction.transferHistory.push({
                    dateOfTransfer: theProcessingDate,
                    status: statusMsg,
                    retryCount: 0
                });

                console.log("---->" + statusMsg);
                // Assign the last transfer date as the current processing date
                theLastTransferDate = moment(this.utils.formatDateTo_YYYYMMDD_String(theProcessingDate), "YYYY-MM-DD");
                // Compute the next transfer date based on the frequency
                theFrequency = theInstruction.frequency;
                theNextTransferDate = this.utils.computeNextTransferDate(theLastTransferDate, theFrequency);
                theLastTransferDate = this.utils.format_YYYYMMDD_DateStringToDate(theLastTransferDate.format("YYYY-MM-DD"));
                theNextTransferDate = this.utils.format_YYYYMMDD_DateStringToDate(theNextTransferDate.format("YYYY-MM-DD"));
                console.log("---> LAST TRANSFER DATE : " + theLastTransferDate);
                console.log("---> NEXT TRANSFER DATE : " + theNextTransferDate);
                console.log(theInstruction.transferHistory);

                var loanPayType = (theInstruction.loanPayType==undefined||
                theInstruction.loanPayType==null||
                String(theInstruction.loanPayType).trim().length<=0)?"":("_"+String(theInstruction.loanPayType).toUpperCase());

                var theDebitPayType =  String(theInstruction.sourceAccountType).toUpperCase() + "_" + "DEBIT";
                var theCreditPayType =  String(theInstruction.targetAccountType).toUpperCase() + "_" + "CREDIT" + loanPayType;

                /* Log Funds Transfer : Begin */
                var modelLog = mongoModelName.modelName.FundsTransferLog;
                /*var creditRemarks = "",debitRemarks = "";
                for(var obj in theDebitOrCreditRequest.requests[0].INSTANCE.transactionInfos){
                    if(obj.debitOrCredit == "CREDIT"){
                        creditRemarks = obj.description;
                    }
                    if(obj.debitOrCredit == "DEBIT"){
                        debitRemarks = obj.description;
                    }
                }*/
                var creditRemarks = "",debitRemarks = "", trn = theDebitOrCreditRequest.requests[0].INSTANCE.transactionInfos;
                for(var i = 0 ; i < trn.length ; i++ ){
                    if(trn[i].debitOrCredit == "CREDIT"){
                        creditRemarks = trn[i].description;
                    }
                    if(trn[i].debitOrCredit == "DEBIT"){
                        debitRemarks = trn[i].description;
                    }
                }

                console.log("<<<<<<<<< theDebitOrCreditRequest >>>>>>>>")
                var logData0 = {
                    transactionDate  : (new Date()),
                    institutionId    : theBankId,
                    customerId       : theCustomerId,
                    fromAccountNo    : theInstruction.sourceAccountNo,
                    fromAccountType  : theInstruction.sourceAccountType,
                    toAccountNo      : theInstruction.targetAccountNo,
                    toAccountType    : theInstruction.targetAccountType,
                    amount           : theInstruction.amount,
                    remarks          : creditRemarks,
                    transactionType  : 'CREDIT',
                    payType          : theCreditPayType
                }

                //console.log(logData0);
                var mongo0 = utils.initMongo(modelLog, logData0, generateId());
                var resHandle = function(err,result){
                    //console.log(err);
                };
                mongo0.Save(resHandle);

                var logData1 = {
                    transactionDate  : (new Date()),
                    institutionId    : theBankId,
                    customerId       : theCustomerId,
                    fromAccountNo    : theInstruction.sourceAccountNo,
                    fromAccountType  : theInstruction.sourceAccountType,
                    toAccountNo      : theInstruction.targetAccountNo,
                    toAccountType    : theInstruction.targetAccountType,
                    amount           : theInstruction.amount,
                    remarks          : debitRemarks,
                    transactionType  : 'DEBIT',
                    payType          : theDebitPayType
                }
                //console.log(logData1);
                var mongo1 = utils.initMongo(modelLog, logData1, generateId());
                var resHandle = function(err,result){
                    //console.log(err);
                };
                mongo1.Save(resHandle);
                /* Log Funds Transfer : End */


                /* Log Recurring Funds Transfer : Begin */

                try {

                    this.logRecurringData = {
                        transactionDate: (new Date()),
                        institutionId: theBankId,
                        customerId: theCustomerId,
                        userId           : theUserId,
                        fromAccountNo: theInstruction.sourceAccountNo,
                        fromAccountType: theInstruction.sourceAccountType,
                        toAccountNo: theInstruction.targetAccountNo,
                        toAccountType: theInstruction.targetAccountType,
                        amount: theInstruction.amount,
                        remarks: theInstruction.description,
                        frequency: theInstruction.frequency,
                        payType  : theInstruction.loanPayType,
                        status: "SUCCESS",
                        transactionType  : 'TRANSFERMONEY',
                        reason: dbOrCrResponse.status.statusDescription || "SUCCESS"
                    }

                    var user = require('./userMethods');
                    user = user(this.config,this.tnxId)
                    var that = this;
                    // user.defaultMethod({userId : theUserId},function(err,result){
                    // that.logRecurringData.customerName = result.customerName;

                    var fundsTransferStatusLogModel = mongoModelName.modelName.FundsTransferStatusLog;
                    var mongo0 = utils.initMongo(fundsTransferStatusLogModel, that.logRecurringData, generateId());
                    var resHandle = function (err, result) {
                    };
                    mongo0.Save(resHandle);
                    // })

                }
                catch(err){
                    console.log("error in recording failed transfer");
                    console.log(err)
                }

                /* Log Recurring Funds Transfer : End */


                var fundsTransfer = new FundsTransfer(this.config ,generateId())
                fundsTransfer.updateInstruction(theBankId, theUserId,
                    this.utils.formatDateTo_YYYYMMDD_String(theInstruction.dateOfInstruction),
                    this.utils.formatDateTo_YYYYMMDD_String(theInstruction.startDate),
                    this.utils.formatDateTo_YYYYMMDD_String(theInstruction.endDate),
                    theInstruction.sourceAccountNo, theInstruction.sourceAccountCategory, theInstruction.sourceAccountType,
                    theInstruction.targetAccountNo, theInstruction.targetAccountCategory, theInstruction.targetAccountType,
                    theInstruction.amount, theInstruction.frequency,
                    this.utils.formatDateTo_YYYYMMDD_String(theLastTransferDate),
                    this.utils.formatDateTo_YYYYMMDD_String(theNextTransferDate),
                    theInstruction.loanPayType,
                    theInstruction.transferHistory, null, theInstruction._id);

                this.getContact(theBankId, theUserId, function (theCustomerId, theEmailAddress, theMobileNo) {

                    try {
                        alertObjSrc = {
                            alertType: 'ACCOUNT TRANSFER',
                            bankId: String(theBankId),
                            userId: String(theUserId),
                            customerId: String(theCustomerId),
                            accountNumber: String(theInstruction.sourceAccountNo),
                            targetAccountNumber: String(theInstruction.targetAccountNo),
                            amount: String(theInstruction.amount),
                            isFromAccount: true,
                            emailAddress: theEmailAddress,
                            mobileNo: theMobileNo
                        }

                        console.log("alertObjSrc ------------> ");
                        console.log(JSON.stringify(alertObjSrc));

                        sendAccountAlertApi.sendAccountAlert(alertObjSrc);
                        alertObjTarget = {
                            alertType: 'ACCOUNT TRANSFER',
                            bankId: String(theBankId),
                            userId: String(theUserId),//How to handle for third party
                            customerId: String(theCustomerId),
                            accountNumber: String(theInstruction.targetAccountNo),
                            targetAccountNumber: String(theInstruction.sourceAccountNo),
                            amount: String(theInstruction.amount),
                            isFromAccount: false,
                            emailAddress: theEmailAddress,
                            mobileNo: theMobileNo
                        }
                        sendAccountAlertApi.sendAccountAlert(alertObjTarget);

                        /* End of Alert Sending Code */
                    }
                    catch (err) {
                        console.log("ERROR IN SENDING ACCOUNT TRANSFER ALERT");
                    }

                });

                if (theCallback != undefined)
                    theCallback(true);

            }
            else {

                this.getContact(theBankId, theUserId, function (theCustomerId, theEmailAddress, theMobileNo) {

                    try {
                        /* Send Alert for Failure */
                        alertObjSrc = {
                            alertType: 'UNPROCESSED RECURRING TRANSFER',
                            bankId: String(theBankId),
                            userId: String(theUserId),
                            customerId: String(theCustomerId),
                            accountNumber: String(theInstruction.sourceAccountNo),
                            targetAccountNumber: String(theInstruction.targetAccountNo),
                            amount: String(theInstruction.amount),
                            emailAddress: theEmailAddress,

                            mobileNo: theMobileNo
                        }

                        sendAccountAlertApi.sendAccountAlert(alertObjSrc);
                    }
                    catch (err) {
                        console.log("ERROR IN SENDING UNPROCESSED RECURRING TRANSFER ALERT");
                    }

                });

                if (theCallback != undefined)
                    theCallback(false);

                console.log("---->" + statusMsg);
            }
        },

        getContact: function(theBankId, theUserId, theCallback){
            /* Begin : Fetch the email Id and phone No from Mongo for sub-user and send it to
             * 		   customerMethod's fundsTransfer method
             * 		   If user is not a sub-user then don't send the email and phone number */

            model = mongoModelName.modelName.User;
            routed = {
                institutionId                       : theBankId,
                userId                              : theUserId
            };

            var mongo = utils.initMongo(model, routed, generateId());
            var resHandle = function(error,result){
                if(result!=undefined && result!=null) {
                    var utils = require('../lib/utils/utils');
                    utils = utils.util();
                    var isSubUser = utils.isSubUser(result.createdBy, result.originator);
                    if (isSubUser) {
                        theCallback(result.emailId, result.contact.mobileNo);
                    }
                    else {
                        theCallback("", "");
                    }

                    if (error)
                        theCallback("", "");
                }else{
                    theCallback("", "");
                }
            };
            mongo.FindOneMethod(resHandle);
            /* End */
        },

        debitOrCreditRq: function(srcBankId,srcAccNo,srcAccCategory,srcAccType,srcTrancode,
                                  targetBankId,targetAccNo,targetAccCategory,targetAccType,targetTrancode,
                                  currency,amount,
                                  transactionDate,transactionTime,transactionMode,loanPayType,
                                  debitRemarks,creditRemarks){

            vfxRequestId = generateId();  //Math.floor(Math.random()*1000000);
            requestId = generateId(); //Math.floor(Math.random()*1000000);

            var tranMode = null;

            var theloanPayType = (loanPayType!=undefined &&
            loanPayType!=null &&
            String(loanPayType).trim().length>0)?("_"+String(loanPayType).toUpperCase()):"";

            var debitTranCode = this.config.trancodes[srcAccType+'_DEBIT'];
            var creditTranCode = this.config.trancodes[targetAccType+'_CREDIT'+theloanPayType];

            if(targetAccCategory == 'LOAN')
                tranMode = 'LEDGER';
            else
                tranMode= transactionMode;

            return {
                "vfxRequestId":vfxRequestId,
                "requestHeader": {
                    "serviceIdentity": {
                        "serviceProviderName": "CORE",
                        "serviceName": "CORE"
                    },
                    "credentialsRqHdr": {
                        "userId": "OMNI"
                    },
                    "clientIp": "127.0.0.1"
                },
                "requests": [{
                    "REQUEST_NAME": "DebitOrCreditRq",
                    "INSTANCE": {
                        "transactionInfos": [{
                            "bankId": srcBankId,
                            "accountNo": srcAccNo,
                            "accountCategory": srcAccCategory,
                            "transactionAmount": {
                                "currency": currency,
                                "amount":   parseFloat(amount)
                            },
                            "debitOrCredit": "DEBIT",
                            "description": debitRemarks,
                            "transactionCode": debitTranCode,
                            "transactionDate": {
                                "date": transactionDate
                            },
                            "transactionTime": {
                                "time": transactionTime+" 000000"
                            },
                            "remarks": debitRemarks,
                            "transactionMode": 'MEMO_LEDGER'
                        },
                        {
                            "bankId": targetBankId,
                            "accountNo": targetAccNo,
                            "accountCategory": targetAccCategory,
                            "transactionAmount": {
                                "currency": currency,
                                "amount":   parseFloat(amount)
                            },
                            "debitOrCredit": "CREDIT",
                            "description": creditRemarks,
                            "transactionCode":  creditTranCode,
                            "transactionDate": {
                                "date": transactionDate
                            },
                            "transactionTime": {
                                "time": transactionTime+" 000000"
                            },
                            "remarks": creditRemarks,
                            "transactionMode": tranMode
                        }],
                    "isForced": false,
                    "requestId": requestId,
                    "vfxRequestId": vfxRequestId
                }
            }]
        };

            //return req;
        }


    }

    module.exports = function(config, tnxId){
        return (new FundsTransfer(config ,tnxId));
    };
})();