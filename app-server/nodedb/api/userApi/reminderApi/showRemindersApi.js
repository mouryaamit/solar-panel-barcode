(function(){

    var reminderMethod = require('../../../apiMethods/reminderMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var showReminderApi = function showReminderApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    showReminderApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var reminder = reminderMethod(this.response.config , this.tnxId);
        reminder.showReminders(this.response.request.body , resHandle);
    };

    module.exports.showReminderApi = function(rin , callback){
        var dApi = new showReminderApi(rin , callback);
        dApi.requestApi();
    };
})();