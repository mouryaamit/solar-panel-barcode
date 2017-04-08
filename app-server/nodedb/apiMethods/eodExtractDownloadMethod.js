/**
 * Created by amourya on 5/2/16.
 */
(function(){

    var moment = require('moment');

    var downloader = require('./fileDownloadMethods');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var EODExtractDownload = function EODExtractDownload(config , callback , tnxId){
        this.config = config;
        this.callback = callback;
        this.tnxId = tnxId;
        this.utils = utils.util();
        this.errorResponse = errorResponse.ErrorMessage(config);
    };

    EODExtractDownload.prototype = {
        download : function(reqBody,doDownload){
            this.reqBody = reqBody;

            this.downloadMethod = downloader(this.config , "pdf" , "fileName" , this.tnxId);
            var path = this.config.EODExtractLocation;
            path = path.replace("InstId", this.config.instId);

            var date = moment(this.reqBody.date,"MM/DD/YYYY");

            var fileName = this.reqBody.extractType.split(".")[0];
            var fileType = this.reqBody.extractType.split(".")[1];

            var filePath = '/'+date.format('MM')+date.format('YYYY')+'/'+date.format('DD')+'/'+fileName+'.'+fileType;
            this.downloadMethod.downloadEODExtract(this.callback , path,filePath,fileName, fileType,doDownload);
        }
    };
    module.exports = function(config , callback, tnxId){
        return (new EODExtractDownload(config , callback, tnxId));
    };
})();