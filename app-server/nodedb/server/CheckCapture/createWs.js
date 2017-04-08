(function () {

    var path = require('path');

    var fs = require('fs');

    var http = require('http');

    var request = require('request');

    function CoreHandle(request, callback, config, method, uri) {
        var requestBody = request || {};
        this.method = method || 'GET';
        this.uri = uri || '';

        this.config = config;
        this.requestObject = JSON.stringify(requestBody);
        this.startedAt = new Date();
        this.callback = callback;
        this.incorrectResponse = {
            "status": {
                "statusCode": "RF",
                "statusDescription": "Request Failed",
                "severity": "Request Failed"
            }
        };
    }


    CoreHandle.prototype = {
        requestCore: function () {
            var that = this;
            console.info('Check Capture Request At: ' + this.startedAt);
            console.log(that.config.vsoftCheckCaptureServer.protocol + "://"+ that.config.vsoftCheckCaptureServer.hostname+":"+that.config.vsoftCheckCaptureServer.port+ that.config.vsoftCheckCaptureServer.path + that.uri)
            new request({
                    url: that.config.vsoftCheckCaptureServer.protocol + "://"+ that.config.vsoftCheckCaptureServer.hostname+":"+that.config.vsoftCheckCaptureServer.port+ that.config.vsoftCheckCaptureServer.path + that.uri,
                    headers: {
                        'content-type': "application/json"
                    },
                    method: that.method,
                    body:   that.requestObject,
                    rejectUnauthorized:false,
                    checkServerIdentity: function (host, cert) {
                        return undefined;
                    }
                },  function(error, response, body){
                    if(error) {
                        console.error('Core Request Failed : ' + error);
                        that.callback(that.incorrectResponse, null);
                    } else {
                        console.info('Check Capture Request Responded At: ' + (new Date() - that.startedAt) + ' ms')
                        console.log('Check Capture return Object : ' + body);
                        var resp = {};
                        try {
                            resp = JSON.parse(body);
                        } catch (err) {
                            console.eror('InCorrect Json Format sent from Check Capture ');
                            resp = that.incorrectResponse;
                        }
                        that.callback(null, resp);
                    }
                }
            );
        }
    };

    module.exports = function (request, callback, config, method, uri) {
        return (new CoreHandle(request, callback, config, method, uri));
    };
})();