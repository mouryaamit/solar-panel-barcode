/**
 * Created by amitmourya on 08/04/17.
 */
(function () {

    var utils = require('../../lib/utils/utils');

    var errorResponse = require('../../gen/errorResponse');

    var successResponse = require('../../gen/successResponseMessage');

    var mongoModelName = require('../../lib/mongoQuery/mongoModelObj');

    var moment = require('moment');

    var fs = require('fs')

    var path = require('path')

    var _ = require('underscore');

    var tsv = require("node-tsv-json");

    var base64 = require('file-base64');

    function Testing(config, tnxId) {
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.testData;
    }

    Testing.prototype = {
        testing: function (reqBody, callback) {
            this.reqBody = reqBody;
            this.callback = callback;
            var that = this;
            // var filePath = path.resolve('../'+moment().format("DDMMYYYY"));
            var filePath = path.resolve('../170319');
            var fileName = this.getFile(filePath)
            var fileFullPath = filePath + "/" + fileName
            console.log((fileFullPath))
            this.readFile(fileFullPath,function (status) {
                setTimeout(function () {
                    var file = require("../../../output.json");
                    var data = {};
                    for(var i = 0 ; i < file.length ; i ++){
                        data[file[i]["Title:"].split(":")[0]] = file[i]["ReferencemoduleAETPL 10watt Multi"]
                        if(file[i]["Title:"].split(":")[0] == "TRef4"){
                            i = file.length;
                        }
                    }
                    var bitmap = fs.readFileSync(fileFullPath);
                    var routed = {
                        originalFileName: fileName,
                        originalFilePath: fileFullPath,
                        originalFileBase64: new Buffer(bitmap).toString('base64'),
                        barcode : that.reqBody.barcode,
                        data:data
                    }
                    var mongo = that.utils.initMongo(that.model ,routed, that.tnxId);
                    var resHandle = that.testingDone.bind(that);
                    mongo.Save(resHandle);
                },10)

            })

        },
        testingDone: function (err, result) {
            if (!result) {
                console.log(err)
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null, {message: this.reqBody.module + " " + this.reqBody.step + "ed", result:result.data});
            }
        },
        getFile: function (dir) {
            // Return only base file name without dir
            var files = fs.readdirSync(dir);

            // use underscore for max()
            return _.max(files, function (f) {
                var fullpath = path.join(dir, f);

                // ctime = creation time is used
                // replace with mtime for modification time
                return fs.statSync(fullpath).ctime;
            });
        },
        readFile:function (filePath,callback) {
            tsv({
                input: filePath,
                output: "output.json"
                //array of arrays, 1st array is column names
                ,parseRows: false
            }, function(err, result) {
                if(err) {
                    console.log(err)
                    callback(false);
                }else {
                    callback(true);
                }
            });
        }
    };

    module.exports = function (config, tnxId) {
        return (new Testing(config, tnxId));
    };
})();