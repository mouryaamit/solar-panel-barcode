(function(){

    var http = require('https');

    function SessionMx(callback , tnxId){
        this.callback = callback;
        this.tnxId= tnxId;
    }

    SessionMx.prototype = {

        requestMx: function(widgetType){
            var options = {
                hostname: 'sso.moneydesktop.com',
                port: 443,
                path: '/vsoft-demo/users/demo-user/urls/'+widgetType,
                method: 'GET',
                headers: {
                    'accept': 'application/vnd.moneydesktop.sso.v3+xml',
                    'md-api-key': "b5eb4a8e9b2998640849c903344ed427222d38ff"
                }
            };

            var that = this;
            var response = '';
            var req = http.request(options, function (res) {
                res.on('data', function (chunk) {
                    response = response + chunk;
                });

                res.on('end', function () {
                    that.callback(null , response);
                });
            });

            req.end();
        }
    };

    module.exports = function(callback , tnxId){
        return (new SessionMx(callback , tnxId));
    }
})();