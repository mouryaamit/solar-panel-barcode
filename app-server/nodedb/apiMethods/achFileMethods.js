(function(){

    var _ = require('underscore');

    var utils = require('../lib/utils/utils');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var achProcess = require('./achFileProcessMethods');

    var fileBatchMethod = require('./fileBatchMethods');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var alertMethod = require('../apiMethods/alertMethods');

    function Ach(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.FileUpload;
    }

    Ach.prototype = {
        uploadFile : function(reqBody , callback){
            this.callback = callback;
            this.reqBody = reqBody;
            this.fields = reqBody.fields;
            this.files = reqBody.files;

            this.utils.log(this.tnxId , this.files , 'console.log');

            if(this.files.achFile.type == 'text/plain'){

                var name = (this.files.achFile.name).split('.');
                var fileId = this.utils.getToken();

                this.fileObj = {
                    institutionId       : this.config.instId,
                    fileId              : fileId,
                    fileName            : this.files.achFile.name,
                    uploadedBy          : this.reqBody.userSelectedName,
                    uploadedById        : this.reqBody.userId,
                    size                : this.files.achFile.size,
                    path                : this.files.achFile.path,
                    name                : name[0],
                    extension           : name[1],
                    type                : this.files.achFile.type
                };

                var resHandle = this.uploadDone.bind(this);
                achProcess(this.fileObj ,resHandle , this.config , this.tnxId);

            }else{
                var error = this.errorResponse.BatchRetrieveFailed;
                this.callback(error , null);
            }
        },
        uploadDone: function(err , success){
            var alertObj = {
                userId       : this.reqBody.userId,
                emailId      : this.reqBody.userInform.emailId,
                phoneNo      : this.reqBody.userInform.phoneNo,
                alertMessage : 'When an ACH import file is submitted for processing',
                emailMessage : 'ALERT:  ACH file '+ this.fileObj.fileName +' has been submitted for processing.'
             };

             var alert = alertMethod(this.config , this.tnxId);
             alert.sendAlerts(alertObj);

            var mongo = this.utils.initMongo(this.model ,this.fileObj , this.tnxId);
            mongo.Save();
            this.callback(null , {message: this.successResponse.FileUploadSuccess});
        },
        checkType: function(){
           var test = {
               size: 134575,
               path: '/root/projects/iris/nodedb/achUploadDir/1195b754066da03bb1ed371a76a8d7ab.png',
               name: '512 X 512.png',
               type: 'image/png',
               lastModifiedDate: 'Tue Feb 03 2015 07:17:55 GMT-0500 (EST)'
           }
        },
        listUploadedFiles: function(reqBody , callback){
            this.callback = callback;
            var routed = {
                uploadedById : reqBody.userId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.listFiles.bind(this);
            mongo.FindMethod(resHandle);
        },
        listFiles: function(err , result){
            if(err){
                var error = this.errorResponse.BatchRetrieveFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        },
        listBatchByFileId: function(reqBody , callback){
            this.callback = callback;

            var fileBatch = fileBatchMethod(this.config , this.tnxId);
            var resHandle = this.listFilesBatches.bind(this);
            fileBatch.listFileBatch(reqBody.fileId , resHandle);
        },
        //use at calling object
        listFilesBatches: function(err , result){
            if(err){
                var error = this.errorResponse.BatchRetrieveFailed;
                this.callback(error , null);
            }else{
                var batchArray = [];
                var creditArray = ['22','23','32','33','52' ,'53'];
                var batchLength = result.length;

                for(var i = 0; i < batchLength; i++) {
                    var batch = {
                        updatedOn : result[i].updatedOn,
                        createdOn: result[i].createdOn,
                        fileId: result[i].fileId,
                        batchId: result[i].batchId,
                        batchName: result[i].batchName,
                        secCode: result[i].secCode,
                        accountNo: result[i].accountNo,
                        companyName: result[i].companyName,
                        companyDiscretionaryData: result[i].companyDiscretionaryData,
                        companyId: result[i].companyId,
                        companyDescription: result[i].companyDescription,
                        batchDescription: result[i].batchDescription,
                        dateScheduled: result[i].dateScheduled,
                        frequency: result[i].frequency,
                        dateScheduledProcess: result[i].dateScheduledProcess,
                        expirationDate: result[i].expirationDate,
                        effectiveDate: result[i].effectiveDate,
                        recipients: result[i].recipients
                    };
                    var recipients = batch.recipients;
                    var itemLength = recipients.length;
                    var credit = 0.00;
                    var debit = 0.00;
                    for(var j = 0; j < itemLength; j++) {
                        if (_.contains(creditArray, recipients[j].transactionCode)) {
                            credit = credit + parseFloat(recipients[j].amount);
                        } else {
                            debit = debit + parseFloat(recipients[j].amount);
                        }
                    }
                    batch["items"] = itemLength;
                    batch["credit"] = credit;
                    batch["debit"] = debit;

                    batchArray.push(batch);
                }

                this.callback(null , batchArray);
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new Ach(config , tnxId));
    };
})();