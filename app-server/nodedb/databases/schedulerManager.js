(function(){

    var schedulerMethod = require('../supportMethods/schedulerMethods');

    var downTimeMethod = require('../apiMethods/downTimeMethods');

    var SchedulerManager = function SchedulerManager(){
        this.tnxId = 'Scheduler Manager'
    };

    SchedulerManager.prototype = {
        schedulerHandler: function(config){
            this.config = config;
            var scheduler = schedulerMethod(this.config, this.tnxId);

            var downTime = downTimeMethod(this.config , this.tnxId);

            var schedule = new SchedulerManager();

            downTime.getCurrentDownTime(schedule.downTimeHandle,"Schedular");

            scheduler.runScheduleJobs();
            scheduler.runAdminScheduleJobs();
        },
        downTimeHandle : function(err , result){
            var downTime = downTimeMethod(this.config , this.tnxId);
            if(!result){
                downTime.addCurrentDownTime("Schedular");
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
                    serviceName     : "Schedular"
                };
                downTime.saveDownTimeHistory(downTimeHistory);
                downTime.addCurrentDownTime("Schedular");
            }
        }
    };

    module.exports = function(){
        return (new SchedulerManager());
    };
})();