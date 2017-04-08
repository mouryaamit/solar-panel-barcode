(function(){

    var fs = require('fs');

    var path = require('path');

    var mkdirp = require("mkdirp")

    var mime = require('mime-types')

    var createCSV = require('../gen/jsonToCsv');

    var createPdf = require('../gen/pdfGenerator/pdfMethods');

    var createFixedLength = require('../gen/jsonToFixedLength');

    var createOfx = require('../gen/quickenOfx');

    var errorResponse = require('../gen/errorResponse');

    var moment = require('moment');

    var utils = require('../lib/utils/utils');

    function CreateFile(config , fileType , fileName , userId, tnxId){
        this.config = config;
        this.tnxId = tnxId;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.fileType = fileType;
        this.fileName = fileName;
        this.userId = userId;
        this.utils = utils.util();
    }

    CreateFile.prototype = {
        parseData: function(jsonArray ,headers, callback , pdfType , quickenData, userId){
            this.pdfType = pdfType;
            this.callback = callback;
            this.userId = userId;
            var resHandle = this.dataToFile.bind(this);
            if(this.fileType == 'csv'){
                createCSV.csvConverter(jsonArray ,headers , resHandle);
            }else if(this.fileType == 'tsv') {
                createCSV.tsvConverter(jsonArray ,headers , resHandle);
            }else if(this.fileType == 'pdf') {
                var pdfHandler = this.pdfFileHandler.bind(this);
                var pdf = createPdf(this.config , this.tnxId,this.userId);
                var parsePdf = pdf.parsePdf.bind(pdf);
                parsePdf(pdfType , jsonArray , this.fileName , pdfHandler);
            }else if(this.fileType == 'txt'){
                resHandle = this.pdfFileHandler.bind(this);
                var fixedLength = createFixedLength(this.config , this.tnxId,this.userId);
                var parseFL = fixedLength.parseFL.bind(fixedLength);
                parseFL(pdfType , jsonArray , this.fileName , resHandle);
            }else if(this.fileType == 'qfx'){
                var qfx = createOfx(this.config , userId, this.tnxId);
                var parseQfx = qfx.forAllStatement.bind(qfx);
                parseQfx(quickenData ,resHandle);
            }else if(this.fileType == 'qbo'){
                var qbo = createOfx(this.config , userId, this.tnxId);
                var parseQbo = qbo.forAllStatement.bind(qbo);
                parseQbo(quickenData ,resHandle);
            }
        },
        dataToFile: function(data){

            var filePath = path.resolve('./nodedb/contentFiles/');
            var that = this;
            var fileName = this.fileName
            if(this.pdfType != 'activeUsersReport' && this.pdfType != 'reconciliationUsersReport'){
                fileName = this.utils.maskAccount(fileName,{isAccountMasked:true})
            }
            var fullPath = filePath+"/"+this.config.instId+"/"+this.userId+"/"+moment().format("YYYYMMDD")+"/"+(fileName)+"."+this.fileType;
            var getDirName = require("path").dirname;
            mkdirp(getDirName(fullPath), function (err) {
                if (err) {
                    var error = that.errorResponse.OperationFailed;
                    that.callback(error, null);
                }
                fs.writeFile(fullPath , data, function(err) {
                    if (err) {
                        var error = that.errorResponse.OperationFailed;
                        that.callback(error, null);
                    }
                    that.callback(null,{path : moment().format("YYYYMMDD"), fileName:(fileName),fileExt:that.fileType})
                });
            })
        },
        pdfFileHandler: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , result);
            }
        },
        downloadEODExtract: function(callback , path, filePath,fileName, fileType,doDownload){
            this.callback = callback;
            this.filePath = filePath;
            this.fileName = fileName;
            this.path = path;
            this.fileType = fileType;
            var that = this;
            fs.stat(path+filePath, function(err, stats){
                if(err == null) {
                    if(doDownload) {
                        that.callback(null, {filePath: that.path+that.filePath,fileName:that.fileName, fileExt: that.fileType});
                    } else {
                        that.callback(null, {});
                    }
                } else {
                    var error = that.errorResponse.EODExtractNotAvailable;
                    that.callback(error , null);
                }
            })
        }
    };

    module.exports = function(config , fileType , fileName , userId, tnxId){
        return (new CreateFile(config , fileType , fileName , userId, tnxId));
    };
})();