(function(){

    var fs = require('fs');

    var path = require('path');

    var fedServer = require('./serverConnect');

    var fedRoutingFile = function(config , tnxId){
        this.config  = config;
        this.tnxId = tnxId;
    };

    fedRoutingFile.prototype = {
        copyOnlineAchFile: function (err, response) {
            if(err == null) {
                var addRoutingNumber = require('./addACHRoutingNumber');
                addRoutingNumber();
            } else {
                console.error("FRB ACH Routing Processing Error")
            }
        },
        copyOnlineFedFile: function (err, response) {
            if(err == null) {
                var addRoutingNumber = require('./addFEDRoutingNumber');
                addRoutingNumber();
            } else {
                console.error("FRB FED Routing Processing Error")
            }
        },
        getOnlineFedFile: function (next) {
            var resHandle = this[next].bind(this);
            var fed = fedServer(resHandle, 'establish Connection');
            fed.requestFedAch();
        },
        readOnlineFrbAchFile: function(err, response){
            var resHandle = this.copyOnlineAchFile.bind(this);
            var fed = fedServer(resHandle, 'getFedFile');
            fed.requestFrbAchFile(response);
        },
        readOnlineFrbFedFile: function(err, response){
            var resHandle = this.copyOnlineFedFile.bind(this);
            var fed = fedServer(resHandle, 'getFedFile');
            fed.requestFrbFedFile(response);
        }
    };

    module.exports = function(config , tnxId){
        return (new fedRoutingFile(config , tnxId));
    };
})();