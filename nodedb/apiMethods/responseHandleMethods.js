(function(){

    var events = require('events').EventEmitter;
    var util = require('util');

    var sessionReportMethod = require('./sessionReportMethods');

    var ResponseHandler = function ResponseHandler(rin , callback ,tnxId){
        this.tnxId = tnxId;
        this.callback = callback;
        this.response = rin;
    };

    ResponseHandler.prototype = {
        requestHandle : function(error , success){
            var request = {
                url : this.response.url,
                ip : this.response.config.userCurrentIp,
                req : this.response,
                message : 'User call SuccessFul'
            };

            if(error){
                this.response.body = error;
                this.response.status = error.status;
                this.callback(null, this.response);
                request.message = error.responseData.message || 'Error';
            }else {
                request.message = success.message || 'Success';
                request.nextStep = success.nextStep || '';
                var utils = require('../lib/utils/utils');
                var responseObj = utils.util();
                responseObj = responseObj.createSuccessResponseObj(success);
                this.response.body = responseObj;
                this.response.status = responseObj.status;
                this.callback(null, this.response);
            }

            var recorder = new SessionRecorder(request , this.tnxId);
            recorder.on('LogSession' , sessionReportMethod.addSessionReport);
            //recorder.on('LogPageHit' , pageHitMethod.PageHitReport);
            recorder.execute();
        }
    };

    function SessionRecorder(sessionObj, tnxId) {
        events.call(this);
        var that = this;

        this.execute = function () {
            that.emit('LogSession' , sessionObj);
            //that.emit('LogPageHit' , sessionObj);
        };
    }

    util.inherits(SessionRecorder, events);

    module.exports = function(rin , callback, tnxId){
        return (new ResponseHandler(rin , callback, tnxId));
    };
})();