(function(){

    //var tnxId = require('../../gen/tnxMethods');

    //var MCrypt = require('mcrypt').MCrypt;

    //var configFile = require('../prop/serverConfig');

    var moment = require('moment');

    var generateId = require('time-uuid');

    var logger = require('./logger');

    /*function Crypt(privateKey){
        this.desEcb = new MCrypt('rijndael-192', 'ecb');
        this.desEcb.open(privateKey.encryption.privateKey);
    }

    Crypt.prototype.encrypt = function(msg){
        var ciphertext = this.desEcb.encrypt(msg);

        return ciphertext.toString('base64');
    };
    Crypt.prototype.decrypt = function(msg){
        var plaintext = this.desEcb.decrypt(new Buffer(msg, 'base64'));
        return plaintext.toString();
    };*/


    function Util(){}

    Util.prototype = {
        isSubUser : function(createdBy,originator){
            if(createdBy == 'admin'){
                return false;
            }
            if(createdBy == 'System' && (originator == 'System' || originator == 'File')){
                return false
            }
            if(originator == 'Branch'){
                return false
            }
            return true;

        },
        log : function(tnxId , message , tags){
            var log = {
                id : tnxId,
                message : message
            };

            logger.consoleMessage(log , tags);
        },
        getToken : function () {
            return generateId();
        },
        ucFirst : function (string) {
            return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
        },
        initMongo: function(model , routed , tnxId , fields){
            var mongoMethods = require('../../databases/queryMongo');
            return (mongoMethods.MongoQuery(model , routed , tnxId , fields));
        },
        /*getEncrypted : function(msg , config){

            var mCrypt = new Crypt(config);
            return mCrypt.encrypt(msg);
        },
        getDecrypted : function(msg , config){

            var mCrypt = new Crypt(config);
            return mCrypt.decrypt(msg);
        },*/
        getOtp : function(){
            return Math.floor(Math.random()*900000)+100000;
        },
        getPassword : function () {

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 10; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },
        createSuccessResponseObj : function(dataObj){
            return ({
                status : 200,
                responseData : dataObj
            });
        },
        getScheduleNextDate : function(origDate, dated , schedule){

            var scheduleType = {
                "Daily":"1",
                "Weekly":"7",
                "Bi-Weekly":"14",
                "Monthly":"30",
                "Quarterly":"90",
                "Semi-Annually":"180",
                "Annually":"365"
            };

            var isScheduled = scheduleType[schedule];
            if(isScheduled == "undefined" || isScheduled == undefined || isScheduled == null){
                console.log('for schedule Once');
                return dated;
            }else{
                var addNext;

                var originalDate = new Date(origDate);
                var scheduleDate = new Date(dated);

                var currentDay = moment(scheduleDate).format("DD");
                var currentMonth = moment(scheduleDate).format("MM");
                var currentYear = moment(scheduleDate).format("YYYY");
                var d = currentDay + '-' + currentMonth + '-' + currentYear;

                if(schedule == "Daily") {
                    addNext = moment(d, "DD-MM-YYYY").add(1, 'days');
                }
                if(schedule == "Weekly") {
                    addNext = moment(d, "DD-MM-YYYY").add(1, 'weeks');
                }
                if(schedule == "Bi-Weekly") {
                    addNext = moment(d, "DD-MM-YYYY").add(2, 'weeks');
                }
                if(schedule == "Monthly") {
                    addNext = moment(d, "DD-MM-YYYY").add(1, 'months');
                }
                if(schedule == "Quarterly") {
                    addNext = moment(d, "DD-MM-YYYY").add(1, 'quarters');
                }
                if(schedule == "Semi-Annually") {
                    addNext = moment(d, "DD-MM-YYYY").add(6, 'months');
                }
                if(schedule == "Annually") {
                    addNext = moment(d, "DD-MM-YYYY").add(1, 'years');
                }

                return addNext;
            }
        }

    };

    module.exports.util = function(){
        return (new Util());
    };
})();