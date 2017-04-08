(function(){

    var fs = require('fs');

    var moment = require('moment');

    var _ = require('underscore');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var fileBatchMethod = require('./fileBatchMethods');

    var readFileTxt = function(file ,callback , config , tnxId){
        fs.readFile(file.path, function (err, data) {
            if (err){
                callback(null, true);
            }else {
                var buff = new Buffer(data);
                var fileSt = buff.toString();
                var splitfile = fileSt.split('\n');
                readAhead(splitfile, file, callback, config, tnxId);
            }
        });
    };

    var readAhead = function(file ,fileObj, callback ,config , tnxId) {

        var processMethod = new processFileInput(fileObj,callback ,config , tnxId);

        for (var i = 0; i < file.length; i++) {
            var process = new takeAction((file[i].slice(0, 1)).trim());
            var method = process.getRecordType();
            processMethod[method](file[i]);
            if((file[i].slice(0, 1)).trim() == '9') return true;
        }
    };

    var processFileInput = function (fileObj,callback ,config , tnxId){
        this.config = config;
        this.callback = callback;
        this.tnxId = tnxId;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.fileObj = {
            institutionId           : fileObj.institutionId,
            fileId                  : fileObj.fileId
        };
    };
    processFileInput.prototype = {
        if1 : function(data){
            //File Header record
            /* var recordData = {
             PriorityCode: '',
             ImmediateDestination:'',
             Immediateorigin:'',
             FileCreationDate:'',
             FileCreationTime:'',
             FieldModifier:'',
             RecordSize:'',
             BlockingFactor:'',
             FormatCode:'',
             ImmediateDestinationName:'',
             ImmediateOriginName:'',
             ReferenceCode:''
             }*/
            //this.fileObj.batchData = [];
        },
        if2 : function(data){},
        if3 : function(data){},
        if4 : function(data){},
        if5 : function(data){
            var dateSched = (data.slice(69, 75)).trim();
            this.batchId = this.utils.getToken();
            this.fileObj.batchId = this.batchId;
                this.fileObj.batchName = (data.slice(87, 94)).trim();//(data.slice(4, 20)).trim();
                this.fileObj.secCode = 'PPD';//(data.slice(1 ,4)).trim();
                this.fileObj.accountNo = '';
                this.fileObj.companyName = (data.slice(4, 20)).trim();
                this.fileObj.companyDiscretionaryData = (data.slice(20, 40)).trim();
                this.fileObj.companyId = (data.slice(40, 50)).trim();
                this.fileObj.companyDescription = (data.slice(63, 69)).trim();
                this.fileObj.batchDescription = '';
                this.fileObj.dateScheduled = moment(dateSched.slice(2, 4) + '/' + dateSched.slice(4, 6) + '/' + dateSched.slice(0, 2)).format('MM/DD/YYYY');
                this.fileObj.frequency = '';
                this.fileObj.dateScheduledProcess = '';
                this.fileObj.expirationDate = '';
                this.fileObj.effectiveDate = '';
                this.fileObj.recipients = [];


            //Batch Header record
            /*var recordData = {
             ServiceClassCode                        :(data.slice(1 ,4)).trim(),
             CompanyName                             :(data.slice(4, 20)).trim(),
             CompanyDiscretionarydata                :(data.slice(20, 40)).trim(),
             CompanyIdentification                   :(data.slice(40, 50)).trim(),
             Standardentryclasscode                  :(data.slice(50, 53)).trim(),
             Companyentrydescription                 :(data.slice(54, 63)).trim(),
             Companydescriptivedate                  :(data.slice(63, 69)).trim(),
             Effectiveentrydate                      :(data.slice(69, 75)).trim(),
             Settlementdate                          :(data.slice(75, 78)).trim(),
             Originatorstatuscode                    :(data.slice(78, 79)).trim(),
             OriginatingDFIidentificationnumber      :(data.slice(79, 87)).trim(),
             Batchnumber                             :(data.slice(87, 94)).trim()
             }*/
        },
        if6 : function(data){
            //Entry record
            var amountSlice = (data.slice(29 ,39)).trim();
            var amount = parseFloat(amountSlice).toString();
            var recipientId = this.utils.getToken();
            var recipientModel = {
                batchId                                 :  this.batchId ,
                recipientName                           : (data.slice(54 ,76)).trim(),
                recipientId                             : recipientId,
                identity                                : (data.slice(39 ,54)).trim(),
                accountNo                               : (data.slice(12 ,29)).trim(),
                routingNumber                           : (data.slice(3 ,11)).trim() + (data.slice(11 ,12)).trim(),
                amount                                  : amount.slice(0 , (amount.length - 2)) + '.' + amount.slice((amount.length - 2) , amount.length),
                transactionCode                         : (data.slice(1 ,3)).trim(),
                expirationDate                          : '',
                addenda                                 : '',
                status                                  : 'included'
            };

            this.fileObj.recipients.push(recipientModel);

            /*var recordData = {
             Transactioncode:(data.slice(1 ,3)).trim(),
             ReceivingDFIIdentification:(data.slice(3 ,11)).trim(),
             Checkdigit:(data.slice(11 ,12)).trim(),
             DFIAccountnumber:(data.slice(12 ,29)).trim(),
             Amount:(data.slice(29 ,39)).trim(),
             IdentificationNumber:(data.slice(39 ,54)).trim(),
             ReceivingCompanyName:(data.slice(54 ,76)).trim(),
             DiscretionaryData:(data.slice(76 ,78)).trim(),
             Addendarecordindicator:(data.slice(78 ,79)).trim()
             }*/
        },
        if7 : function(data){
            //Addenda Record
            /*  console.log('Addenda found');
             var recordData = {
             AddendatypeCode: '',
             PaymentRelatedInformation: '',
             AddendaSequencenumber: '',
             EntryDetailSequencenumber: ''
             }*/
        },
        if8 : function(data){
            //Batch Trailer Record
            /*console.log('new Batch end');
             var recordData = {
             ServiceClassCode:'',
             Entryaddedcount:'',
             EntryHash:'',
             TotalDebitEntryAmountInbatch:'',
             TotalcreditentryamountamountinBatch:'',
             CompanyIdentifaction:'',
             Messageauthenticationcode:'',
             Reserved:'',
             OriginatingDFIidentification:'',
             Batchnumber:''
             }*/
            var fileBatch = fileBatchMethod(this.config);
            fileBatch.addBatch(this.fileObj);
            //this.fileObj.batchData.push(this.BatchModel);
        },
        if9 : function(data){

            //fileControl Record
            /*var recordData = {
             BatchCount:'',
             BlockCount:'',
             EntryAddendCount:'',
             EntryHash:'',
             TotalDebitEntryAmountInFile:'',
             TotalCreditEntryAmountInFile:'',
             Reserved:''
             };*/
            this.callback(null , true);
            /*var saveNow = new addToDb(this.config);
            saveNow.addBatch(this.fileObj);*/
            return true;
        },
        doNothing: function(){
            return true;
        }
    };

    var takeAction =  function(recordType){
        this.recordType = recordType;
    };

    takeAction.prototype = {
        getRecordType : function(){
            var recordObj = {
                "1"             : 'if1',
                "2"             : 'if2',
                "3"             : 'if3',
                "4"             : 'if4',
                "5"             : 'if5',
                "6"             : 'if6',
                "7"             : 'if7',
                "8"             : 'if8',
                "9"             : 'if9',
                "default"       : 'doNothing'
            };

            return ((typeof recordObj[this.recordType] == "undefined")?recordObj['default']:recordObj[this.recordType]);
        }
    };

    module.exports = function(filePath ,callback , config , tnxId){
        return (new readFileTxt(filePath ,callback , config , tnxId));
    };
})();