(function(){

    var _ = require('underscore');

    var later = require('later');

    var downTimeMethod = require('../apiMethods/downTimeMethods');

    var reminderMethod = require('../apiMethods/reminderMethods');

    var listConfig = require('../gen/channelConfig');

    var configFile = require('../lib/prop/serverConfig');

    var utils = require('../lib/utils/utils').util();

    var Scheduler = function Scheduler(config, tnxId){
        this.config = config;
        this.tnxId = 'Scheduler Manager';
        later.date.localTime();
    };

    Scheduler.prototype = {
        runScheduleJobs: function(){
            var that = this;
            var checkDownTime = 1000 * configFile().getConfig().checkDownTime;//1000 * 60 * 15;

            setInterval(function(){
                that.updateDownTime(that.config , that.tnxId);
            }, checkDownTime);

            var channelConfig = listConfig.getChannelConfig();
            _.each(channelConfig, function (cObj) {
                var configObj = configFile(cObj.serviceFileName);
                configObj.populate();
                var config = configObj.getConfig();

                var wireTransferScheduled = later.parse.text('at '+ config.scheduler.time.wireTransferAt);
                var reminderScheduled = later.parse.text('at '+ config.scheduler.time.reminderAt);
                var achScheduled = later.parse.text('at '+ config.scheduler.time.achUpdateAt);
                var fundsTransferScheduled = later.parse.text('at '+ config.scheduler.time.fundsTransferAt);

                if(config.scheduler.isEnabled.wireTransfer) {
                    that.scheduleServices(that.wireUpdate, wireTransferScheduled, config, that.tnxId);
                }
                if(config.scheduler.isEnabled.reminder) {
                    that.scheduleServices(that.reminderUpdate, reminderScheduled, config, that.tnxId);
                }
                if(config.scheduler.isEnabled.achUpdate) {
                    that.scheduleServices(that.achUpdate, achScheduled, config, that.tnxId);
                }
                if(config.scheduler.isEnabled.fundsTransfer) {
                    that.scheduleServices(that.fundsTransfer, fundsTransferScheduled, config, that.tnxId);
                }
            });

        },
        runAdminScheduleJobs: function(){
            var that = this;

            var channelConfig = listConfig.getChannelConfig();
            _.each(channelConfig, function (cObj) {
                var configObj = configFile(cObj.serviceFileName);
                configObj.populate();
                var config = configObj.getConfig();

                var enrollScheduled = later.parse.text('at '+ config.scheduler.time.enrollAt);
                var fedRoutingFile = later.parse.text('at '+ config.scheduler.time.frbUpdateAt);

                if(config.scheduler.isEnabled.enroll) {
                    that.scheduleServices(that.enrollCustomers, enrollScheduled, config, that.tnxId);
                }
                if(config.scheduler.isEnabled.frbUpdate) {
                    that.scheduleServices(that.frbAchFileUpdate, fedRoutingFile, config, that.tnxId);
                    that.scheduleServices(that.frbFedFileUpdate, fedRoutingFile, config, that.tnxId);
                }
            });
        },
        scheduleServices: function(fName, timer, config, tnxId){
            later.setInterval(function(){
                fName(config, tnxId);
            }, timer);
        },
        updateDownTime: function(config, tnxId){
            var downTime = downTimeMethod(config, tnxId);
            downTime.updateDownTimeEndTime("Schedular");
            return true;
        },
        reminderUpdate: function(config, tnxId){
            var reminder = reminderMethod(config, tnxId);
            reminder.scheduleReminderList();
            return true;
        },
        wireUpdate: function(config, tnxId){
            var wireTransferMethod = require('../apiMethods/wireTransferMethods');
            var wire = wireTransferMethod(config, tnxId);
            wire.recurringWireTransfer();
            return true;
        },
        enrollCustomers: function(config, tnxId){
            var customerEnrollMethod = require('../apiMethods/customerEnrollMethods');
            var enroll = customerEnrollMethod(config, tnxId);
            enroll.scheduleEnroll();
            return true;
        },
        achUpdate: function(config, tnxId){
            var batchMethod = require('../apiMethods/batchMethods');
            var batch = batchMethod(config, tnxId);
            batch.recurringBatchSchedule();
            return true;
        },
        frbFedFileUpdate: function(config, tnxId){
            var fedMethods = require('../server/fedAchServer/fedAchMethods');
            var fedAch = fedMethods(config, tnxId);
            fedAch.getOnlineFedFile("readOnlineFrbFedFile");
            return true;
        },
        frbAchFileUpdate: function(config, tnxId){
            var fedMethods = require('../server/fedAchServer/fedAchMethods');
            var fedAch = fedMethods(config, tnxId);
            fedAch.getOnlineFedFile("readOnlineFrbAchFile");
            return true;
        },
        fundsTransfer: function(config,txnId){
            var date = utils.formatDateTo_YYYYMMDD_String(new Date());

            var fundsTransferMethods = require('../apiMethods/fundsTransferMethods');
            var transferMethods = fundsTransferMethods(config, txnId);
            transferMethods.processInstructions(date);
        }
    };

    module.exports = function(config , tnxId){
        return (new Scheduler(config , tnxId));
    };
})();