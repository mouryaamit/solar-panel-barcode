(function(){

    var reminderMethod = require('../../../apiMethods/reminderMethods');

    var responseMethod = require('../../../apiMethods/responseHandleMethods');

    var editReminderApi = function editReminderApi(rin , callback){
        this.response = rin;
        this.body = rin.request.body;
        this.callback = callback;
        this.tnxId = rin.header['x-request-id'] || '';
    };

    editReminderApi.prototype.requestApi = function(){

        var response = responseMethod(this.response , this.callback , this.tnxId);
        var resHandle = response.requestHandle.bind(this);
        var reminder = reminderMethod(this.response.config , this.tnxId);
        reminder.editReminder(this.response.request.body , resHandle);
    };

    module.exports.editReminderApi = function(rin , callback){
        var dApi = new editReminderApi(rin , callback);
        dApi.requestApi();
    };
})();