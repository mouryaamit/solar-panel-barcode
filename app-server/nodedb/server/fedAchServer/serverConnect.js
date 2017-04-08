(function(){

    var http = require('https');

    var fs = require('fs');

    var path = require('path');

    function SessionFedAch(callback , tnxId){
        this.callback = callback;
        this.tnxId= tnxId;
        this.soapMessage = "agreementValue=Agree";
        this.incorrectResponse = {
            "status": {
                "statusCode": "RF",
                "statusDescription": "Request Failed",
                "severity": "Request Failed"
            }
        };
    }

    SessionFedAch.prototype = {
        requestFedAch: function(){
            console.log("requestFedAch")
            var options = {
                hostname: 'www.frbservices.org',
                port: 443,
                path: '/EPaymentsDirectory/submitAgreement',
                method: 'POST',
                headers : {
                    "Content-Length"    :20,
                    "Content-Type"      : "application/x-www-form-urlencoded"
                }
            };


            var that = this;
            var response = '';
            var req = http.request(options, function (res) {
                var cookie = res.headers["set-cookie"];
                res.on('data', function (chunk) {
                    response = response + chunk;
                });

                res.on('end', function () {
                    that.callback(null , cookie);
                });
            });

            // write data to request body
            req.write(this.soapMessage);
            req.end();
        },
        requestFrbAchFile: function(cookie){
            console.log("requestFedAchFile")
            var options = {
                hostname: 'www.frbservices.org',
                port: 443,
                path: '/EPaymentsDirectory/FedACHdir.txt',
                method: 'GET',
                headers: {
                    cookie: cookie
                }
            };

            var that = this;
            var response = '';
            var filePath = path.resolve('./nodedb/server/fedAchServer');
            var file = fs.createWriteStream(filePath + '/FedACHdir.txt');
            var req = http.request(options, function (res) {
                console.log(res.statusCode)
                console.log(filePath + '/FedACHdir.txt Started')
                res.on('data', function (chunk) {
                    // console.log(chunk);
                    response = response + chunk;
                });
                res.pipe(file);
                file.on('finish', function() {
                    file.close(function () {
                        console.log(filePath + '/FedACHdir.txt Finished')
                    });  // close() is async, call cb after close completes.
                });
                res.on('end', function () {
                    var fileSuccess = null;
                    var fileError = null;
                    if(response.length >= 3000){
                        fileSuccess = response;
                    }else{
                        fileError = true;
                    }
                    that.callback(fileError , fileSuccess);
                });
            });
            req.on('error', function (e) {
                console.log('FRB ACH Routing Request Failed : ' + e.message);
                that.callback(that.incorrectResponse , null);
            });
            req.end();
        },
        requestFrbFedFile: function(cookie){
            console.log("requestFrbFedFile")
            var options = {
                hostname: 'www.frbservices.org',
                port: 443,
                path: '/EPaymentsDirectory/fpddir.txt',
                method: 'GET',
                headers: {
                    cookie: cookie
                }
            };

            var that = this;
            var response = '';
            var filePath = path.resolve('./nodedb/server/fedAchServer');
            var file = fs.createWriteStream(filePath + '/fpddir.txt');
            var req = http.request(options, function (res) {
                console.log(res.statusCode)
                console.log(filePath + '/fpddir.txt Started')
                res.on('data', function (chunk) {
                    // console.log(chunk);
                    response = response + chunk;
                });
                res.pipe(file);
                file.on('finish', function() {
                    file.close(function () {
                        console.log(filePath + '/fpddir.txt Finished')
                    });  // close() is async, call cb after close completes.
                });
                res.on('end', function () {
                    var fileSuccess = null;
                    var fileError = null;
                    if(response.length >= 3000){
                        fileSuccess = response;
                    }else{
                        fileError = true;
                    }
                    that.callback(fileError , fileSuccess);
                });
            });
            req.on('error', function (e) {
                console.log('FRB FED Routing Request Failed : ' + e.message);
                that.callback(that.incorrectResponse , null);
            });
            req.end();
        }
    };

    module.exports = function(callback , tnxId){
        return (new SessionFedAch(callback , tnxId));
    }
})();