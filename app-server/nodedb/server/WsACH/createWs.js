(function(){

    var path = require('path');

    var fs = require('fs');
    
    var http = require('http');

    function CoreHandle(request , callback) {
        var requestBody = request.requestBody || {};
        var requestObj = {
            "vfxRequestId": request.vfxRequestId,
            "requestHeader": {
                "serviceIdentity": {
                    "serviceProviderName": "VSOFT",
                    "serviceName": "TELLER"
                },
                "credentialsRqHdr": {
                    "userId": "TELLER"
                },
                "clientIp": "192.168.3.94"
            },
            "requests": []
        };
        requestObj.requests.push(requestBody);

        this.config = request.config;
        this.requestObject = JSON.stringify(requestObj);
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
        requestCore : function(){
            var options = {
                hostname: this.config.vsoftACHServer.hostname,
                port: this.config.vsoftACHServer.port,
                path: this.config.vsoftACHServer.path,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                }
            };

            var that = this;
            var responseData = '';
            console.info('ACH Request At: ' + this.startedAt);
            var req = http.request(options, function (res) {
                //console.log('STATUS: ' + res.statusCode);
                //console.log('HEADERS: ' + JSON.stringify(res.headers));
                //res.setEncoding('utf8');

                if(res.statusCode == "500"){
                    var response = {
                        "status": {
                            "statusCode": "500",
                            "statusDescription": "Request Responded 500",
                            "severity": "Request Responded 500"
                        }
                    };
                    that.callback(response , null);
                    return true;
                }

                res.on('data', function (chunk) {
                    responseData = responseData + chunk;
                });

                res.on('end' , function(){
                    console.info('ACH Request Responded At: ' + (new Date() - that.startedAt) +' ms');
                    console.log('ACH return Object : ' + responseData);
                    var response = {};
                    try {
                        response = JSON.parse(responseData);
                    }catch(err){
                        console.error('InCorrect Json Format sent from ACH');
                        response = that.incorrectResponse;
                    }
                    that.callback(null , response);
                });
            });

            req.on('error', function (e) {
                console.error('ACH Request Failed : ' + e.message);
                that.callback(that.incorrectResponse , null);
            });

            console.log('RequestObj Sent to ACH : ',this.requestObject);
            // write data to request body
            req.write(this.requestObject);
            req.end();
        }
    };

    module.exports = function(request , callback){
        return (new CoreHandle(request , callback));
    };
})();