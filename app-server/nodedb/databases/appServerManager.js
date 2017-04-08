/**
 * Created by amitmourya on 07/12/16.
 */
(function(){

    var downTimeMethod = require('../apiMethods/downTimeMethods');

    var configFile = require('../lib/prop/serverConfig');

    var AppServerManager = function AppServerManager(){
        this.tnxId = 'App Server Manager'
    };

    AppServerManager.prototype = {
        serverHandler: function(config){
            this.config = config;
            var downTime = downTimeMethod(this.config , this.tnxId);

            var schedule = new AppServerManager();

            downTime.getCurrentDownTime(schedule.downTimeHandle,"App Server");

            var that = this;
            var checkDownTime = 1000 * configFile().getConfig().checkDownTime;//1000 * 60 * 15;

            setInterval(function(){
                schedule.updateDownTime(that.config , that.tnxId);
            }, checkDownTime);
        },
        updateDownTime: function(config, tnxId){
            var downTime = downTimeMethod(config, tnxId);
            downTime.updateDownTimeEndTime("App Server");
            return true;
        },
        downTimeHandle : function(err , result){
            var downTime = downTimeMethod(this.config , this.tnxId);
            if(!result){
                downTime.addCurrentDownTime("App Server");
            }else{
                var upTillTime = new Date(result.endTime).getTime();
                var startAgainTime = new Date().getTime();
                /*var downTimeHour = ((startAgainTime.hours() - (upTillTime.hours())));
                 var downTimeMin = ((startAgainTime.minutes()) - (upTillTime.minutes()));
                 var downTimeSec = ((startAgainTime.seconds()) - (upTillTime.seconds()));*/
                var downFor = startAgainTime - upTillTime;
                var totalTimeSec = parseInt(downFor / 1000);

                var secsNum = totalTimeSec % 60;
                var totalMin = parseInt(totalTimeSec / 60);
                var minsNum = totalMin % 60;
                var totalHrs =  parseInt(totalMin / 60);
                var hrsNum = totalHrs % 60;

                var secs = secsNum.toString();
                var mins = minsNum.toString();
                var hrs = hrsNum.toString();

                if(secs.length < 2) secs = '0' + secs;
                if(mins.length < 2) mins = '0' + mins;
                if(hrs.length < 2) hrs = '0' + hrs;

                var downTimeHistory = {
                    startTime       : result.endTime,
                    endTime         : startAgainTime,
                    description     : this.config.downTimeReason,
                    downTime        : hrs + ':' + mins + ':' + secs,
                    serviceName     : "App Server"
                };
                downTime.saveDownTimeHistory(downTimeHistory);
                downTime.addCurrentDownTime("App Server");
            }
        }
    };

    module.exports = function(){
        return (new AppServerManager());
    };
})();