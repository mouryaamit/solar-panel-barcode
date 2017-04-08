(function(){

    var reminderMethod = require('../../../apiMethods/reminderMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var deleteReminderApi = function deleteReminderApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    deleteReminderApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var reminder = reminderMethod(this.response.config , this.tnxId);
        reminder.deleteReminder(this.response.request.body , resHandle);
    };

    module.exports.deleteReminderApi = function(rin , callback){
        var dApi = new deleteReminderApi(rin , callback);
        dApi.requestApi();
    };
})();