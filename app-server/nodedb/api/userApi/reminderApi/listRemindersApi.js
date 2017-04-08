(function(){

    var reminderMethod = require('../../../apiMethods/reminderMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var listReminderApi = function listReminderApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    listReminderApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var reminder = reminderMethod(this.response.config , this.tnxId);
        reminder.listReminders(this.response.request.body , resHandle);
    };

    module.exports.listReminderApi = function(rin , callback){
        var dApi = new listReminderApi(rin , callback);
        dApi.requestApi();
    };
})();