(function(){

    var reminderMethod = require('../../../apiMethods/reminderMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var addReminderApi = function addReminderApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    addReminderApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var reminder = reminderMethod(this.response.config , this.tnxId);
        reminder.addReminders(this.response.request.body , resHandle);
    };

    module.exports.addReminderApi = function(rin , callback){
        var dApi = new addReminderApi(rin , callback);
        dApi.requestApi();
    };
})();