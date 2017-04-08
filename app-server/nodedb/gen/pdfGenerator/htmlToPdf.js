(function () {

    var path = require('path');

    var fs = require('fs');

    var mkdirp = require("mkdirp")

    var mime = require('mime-types')

    var NodePDF = require('nodepdf');

    var errorResponse = require('../../gen/errorResponse');

    var moment = require('moment');

    var utils = require('../../lib/utils/utils');

    var HtmlToPdf = function(config , tnxId){
        this.config = config;
        this.tnxId = tnxId;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
    };

    HtmlToPdf.prototype = {
        generate : function(html , fileName, callback,userId){
            var options = {
                'content': html,
                'viewportSize': {
                    'width': 1440,
                    'height': 900
                },
                'args': '--debug=true',
                'paperSize': {
                    'pageFormat': 'A4',
                    'margin': {
                        'top': '2cm'
                    },
                    'footer': {
                        'height': '1cm',
                        'contents': '<div style="font-size:12px;font-family: monospace;">PageNo: {currentPage} / {pages}</div>'
                    }
                },
                'zoomFactor': 1.0,
                'captureDelay': 400
            };

            var filePath = path.resolve('./nodedb/contentFiles/');
            this.fileType = "pdf"
            var that = this;
            var fullPath = filePath+"/"+this.config.instId+"/"+userId+"/"+moment().format("YYYYMMDD")+"/"+this.utils.maskAccount(fileName,{isAccountMasked:true})+"."+this.fileType;
            var getDirName = require("path").dirname;
            mkdirp(getDirName(fullPath), function (err) {
                if (err) {
                    var error = that.errorResponse.OperationFailed;
                    that.callback(error, null);
                }
                var pdf = new NodePDF(null, fullPath , options);

                pdf.on('error', function (msg) {
                    var error = that.errorResponse.OperationFailed;
                    callback(error, null);
                });

                pdf.on('done', function (pathToFile) {
                    callback(null,{path : moment().format("YYYYMMDD"), fileName:that.utils.maskAccount(fileName),fileExt:that.fileType})
                });
            });

        }
    };

    module.exports = function(config , tnxId){
        return (new HtmlToPdf(config , tnxId));
    }
})();