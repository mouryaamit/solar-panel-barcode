(function(){

    var http = require('http');
    //http://bulkpush.mytoday.com/BulkSms/SingleMsgApi?feedid=331748&username=9920591450&password=dtgdw&To=9008353551&Text=hellotest

    var SendSMS = function SendSMS(sendTo , message){
        this.sendTo = '91'+sendTo;
        this.message = encodeURI(message);
    };


    SendSMS.prototype.send = function() {
        var that = this;

        var path = '/BulkSms/SingleMsgApi?feedid=331748&username=9920591450&password=dtgdw&To=' + this.sendTo + '&Text='+ this.message;
        http.get('http://bulkpush.mytoday.com'+path, function(res) {
            if(res.statusCode == 200){
                console.log("SMS was successfully send to the client");
            }else {
                console.log("SMS was failed");
            }
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    };

    module.exports.sendSms = function(sendTo , message){
        return (new SendSMS(sendTo , message));
    }
})();