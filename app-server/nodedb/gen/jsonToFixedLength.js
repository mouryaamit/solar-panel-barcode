(function(){

    var fs = require('fs');

    var path = require('path');

    var errorResponse = require('./errorResponse');

    var mkdirp = require("mkdirp")

    var moment = require('moment');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');
    var FixedLengthFile = function(config , tnxId, userId){
        this.config = config;
        this.userId = userId;
        this.tnxId = tnxId;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
    };

    FixedLengthFile.prototype = {
        parseFL : function(flMethod ,jsonData, filename , callback){
            this.fileName = filename;
            this.callback = callback;
            var resHandle = this.transactionReport.bind(this);
            resHandle(jsonData, filename , callback);
        },
        transactionReport : function(templateData, fileName , callback){
            var dataColl = '';
            var postZero = this.fixToLength.bind(this);
            var preZero = this.prePadZero.bind(this);
            var padSpace = this.padSpaces.bind(this);
            for(var i = 0; i < templateData.length ; i++){
                dataColl = dataColl + postZero(templateData[i].accountNo , 10) + postZero(templateData[i].posted , 10) + preZero(templateData[i].transactionAmt , 13) + preZero(templateData[i].check , 10) + padSpace(templateData[i].description , 25) + padSpace(templateData[i].runningBalance , 13) + '                                            \n';
            }

            var filePath = path.resolve('./nodedb/contentFiles/');
            var that = this;

            var fullPath = filePath+"/"+this.config.instId+"/"+this.userId+"/"+moment().format("YYYYMMDD")+"/"+this.utils.maskAccount(this.fileName,{isAccountMasked:true})+"."+'txt';
            var getDirName = require("path").dirname;
            mkdirp(getDirName(fullPath), function (err) {
                if (err) {
                    var error = that.errorResponse.OperationFailed;
                    that.callback(error, null);
                }
                fs.writeFile(fullPath , dataColl, function(err) {
                    if (err) {
                        var error = that.errorResponse.OperationFailed;
                        that.callback(error, null);
                    }
                    that.callback(null,{path : moment().format("YYYYMMDD"), fileName:that.utils.maskAccount(that.fileName),fileExt:'txt'})
                });
            })
        },
        fixToLength: function(string , length){
            var str = string;

            for(var i = str.length; i < length; i++){
                str = str + '0';
            }

            return str;
        },
        prePadZero: function(string , length){
            var str = string;

            for(var i = str.length; i < length; i++){
                str = '0' + str;
            }

            return str;
        },
        padSpaces: function(string , length){
            var str = string;

            for(var i = str.length; i < length; i++){
                str = str + ' ';
            }

            return str;
        },
        defaultMethod: function(templateData, filename ,callback){
            callback(true , null);
        }
    };

    module.exports = function(config , tnxId, userId){
        return (new FixedLengthFile(config , tnxId, userId));
    };
})();