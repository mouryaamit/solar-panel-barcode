(function () {

    var _ = require('underscore');

    var os = require('os');

    var errorResponse = require('../gen/errorResponse');

    //var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    function DownTime(config, tnxId) {
        var utils = require('../lib/utils/utils');
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.currentDownTimeModel = require('../lib/models/dbModel').CurrentDownTime;
        this.model = require('../lib/models/dbModel').DownTimeHistory;
    }

    DownTime.prototype = {
        showDownTimeReport: function (reqBody, callback) {

            this.callback = callback;

            var routed = {$and: [{dated: {$gte: new Date(reqBody.fromDate)}}, {dated: {$lte: new Date(reqBody.toDate)}}]};
            //var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.listDownTime.bind(this);
            this.model.find(routed).sort({createdOn: -1}).exec(resHandle);
        },
        saveDownTimeHistory: function (reqBody) {
            var that = this;
            var routed = {
                dated: new Date(),
                startTime: new Date(reqBody.startTime),
                endTime: new Date(reqBody.endTime),
                description: reqBody.description,
                downTime: reqBody.downTime,
                serverName: os.hostname(),
                serviceName: reqBody.serviceName
            };
            if (!isNaN(process.argv[2])) {
                routed.port = process.argv[2]
            }
            //var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var savingToDB = new that.model(routed);

            savingToDB.save(function (err, doc) {
                console.info(doc);
            });

        },
        addCurrentDownTime: function (serviceName) {
            var that = this;
            var routed = {
                currentHistory: 'Current',
                serverName: os.hostname(),
                serviceName: serviceName
            };
            var setTO = {
                currentHistory: 'Current',
                startTime: new Date(),
                endTime: new Date(),
                serverName: os.hostname(),
                serviceName: serviceName
            };

            if (!isNaN(process.argv[2])) {
                routed.port = process.argv[2]
                setTO.port = process.argv[2]
            }

            that.currentDownTimeModel.update(routed, {$set: setTO}, {upsert: true}, function (err, doc) {
            });
        },
        updateDownTimeEndTime: function (serviceName) {
            var that = this;
            var routed = {
                currentHistory: 'Current',
                serverName: os.hostname(),
                serviceName: serviceName
            };
            if (!isNaN(process.argv[2])) {
                routed.port = process.argv[2]
            }
            var setTO = {endTime: new Date()};

            that.currentDownTimeModel.update(routed, {$set: setTO}, function (err, doc) {
            });

        },
        getCurrentDownTime: function (callback, serviceName) {
            var that = this;
            var routed = {
                currentHistory: 'Current',
                serverName: os.hostname(),
                serviceName: serviceName
            };
            if (!isNaN(process.argv[2])) {
                routed.port = process.argv[2]
            }
            that.currentDownTimeModel.findOne(routed, function (err, doc) {
                callback(err, doc);
            });

        },
        listDownTime: function (err, result) {
            if (err) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null, result);
            }
        }
    };

    module.exports = function (config, tnxId) {
        return (new DownTime(config, tnxId));
    };
})();