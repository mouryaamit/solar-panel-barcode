(function () {

    var moment = require('moment');

    var generateId = require('time-uuid');

    var getTime = require('time-uuid/time');

    var logger = require('./logger');

    var Jimp = require("jimp");

    function Util() {
    }

    Util.prototype = {

        randomKey: function (max) {
            return Math.floor(Math.random() * max);
        },

        generateKey: function (len) {
            var alpb, alps, chars, i, j, key, num, ref, ref1, ref2;
            if (len == null) {
                len = 16;
            }
            ref = ["0123456789", "ABCDEFGHJKMNOPQRSTUVWXTZ", "abcdefghkmnopqrstuvwxyz"], num = ref[0], alpb = ref[1], alps = ref[2];
            ref1 = [(alpb + num + alps).split(''), ""], chars = ref1[0], key = ref1[1];
            for (i = j = 1, ref2 = len; 1 <= ref2 ? j <= ref2 : j >= ref2; i = 1 <= ref2 ? ++j : --j) {
                key += chars[this.randomKey(chars.length)];
            }
            return key;
        },
        generateCaptcha: function (callback) {
            this.captchaCallback = callback;
            this.key = this.generateKey(6);

            var jimpFontHandle = this.jimpFontHandle.bind(this);
            Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(jimpFontHandle);

        },
        jimpFontHandle: function (font) {
            this.jimpFont = font;
            var buffer = null;
            var jimpCreateImageHandle = this.jimpCreateImageHandle.bind(this);
            var image = new Jimp(160, 40, jimpCreateImageHandle);
            image.resize(140, 28, Jimp.RESIZE_HERMITE);
        },
        jimpCreateImageHandle: function (err, image) {
            image.print(this.jimpFont, 10, 3, this.key);
            var jimpImageBufferHandle = this.jimpImageBufferHandle.bind(this);
            image.getBuffer(Jimp.MIME_PNG, jimpImageBufferHandle);
        },
        jimpImageBufferHandle: function (err, image) {
            this.captchaResponse(null, {captchaStr: this.key, captchaImg: image});
        },
        captchaResponse: function (err, data) {
            this.captchaCallback({
                captcha: data.captchaStr,
                uuid: getTime() + this.getToken(),
                sessionId: this.sessionId,
                captchaImage: data.captchaImg
            });
        },
        changeAccoutTypeVerbiage : function (accoutType,config) {
            return config.systemGenratedFundsTransferDescription.accoutTypeVerbiage[accoutType.toUpperCase()]
        },
        maskAccount: function (account,config) {
            if(config && config.isAccountMasked) {
                var noOfStars = 0;
                var noOfDigits = 0;
                var accCase = account.length;
                switch (accCase) {
                    case 1 :
                        noOfStars = 7;
                        noOfDigits = 1;
                        break;
                    case 2 :
                        noOfStars = 6;
                        noOfDigits = 2;
                        break;
                    case 3 :
                        noOfStars = 5;
                        noOfDigits = 3;
                        break;
                    case 4 :
                        noOfStars = 4;
                        noOfDigits = 4;
                        break;
                    default :
                        noOfStars = 4;
                        noOfDigits = 4;
                        break;
                }

                var appendStar = '';
                for (var i = 0; i < noOfStars; i++) {
                    appendStar += 'X';
                }
                return (appendStar + account.slice(-noOfDigits));
            } else {
                return account;
            }

        },
        trimmedAccountNo: function (account,length) {
            account = account.toString();
            return account.substr((account.length-length), account.length);
        },
        isSubUser: function (createdBy, originator) {
            if (createdBy == 'admin') {
                return false;
            }
            if (createdBy == 'System' && (originator == 'System' || originator == 'File')) {
                return false
            }
            if (originator == 'Branch') {
                return false
            }
            return true;

        },
        log: function (tnxId, message, tags) {
            var log = {
                id: tnxId,
                message: message
            };

            logger.consoleMessage(log, tags);
        },
        getToken: function () {
            return generateId();
        },
        ucFirst: function (string) {
            return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
        },
        initMongo: function(model , routed , tnxId , fields, options){
            var mongoMethods = require('../../databases/queryMongo');
            return (mongoMethods.MongoQuery(model , routed , tnxId , fields, options));
        },
        getOtp: function () {
            return Math.floor(Math.random() * 900000) + 100000;
        },
        getPassword: function () {

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 10; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },
        createSuccessResponseObj: function (dataObj) {
            return ({
                status: 200,
                responseData: JSON.parse(JSON.stringify(dataObj))
            });
        },
        getScheduleNextDate: function (origDate, dated, schedule) {

            var scheduleType = {
                "Daily": "1",
                "Weekly": "7",
                "Bi-Weekly": "14",
                "Monthly": "30",
                "Quarterly": "90",
                "Semi-Annually": "180",
                "Annually": "365"
            };

            var isScheduled = scheduleType[schedule];
            if (isScheduled == "undefined" || isScheduled == undefined || isScheduled == null) {
                return dated;
            } else {
                var addNext;

                var originalDate = new Date(origDate);
                var scheduleDate = new Date(dated);

                var currentDay = moment(scheduleDate).format("DD");
                var currentMonth = moment(scheduleDate).format("MM");
                var currentYear = moment(scheduleDate).format("YYYY");
                var d = currentDay + '-' + currentMonth + '-' + currentYear;

                if (schedule == "Daily") {
                    addNext = moment(d, "DD-MM-YYYY").add(1, 'days');
                }
                if (schedule == "Weekly") {
                    addNext = moment(d, "DD-MM-YYYY").add(1, 'weeks');
                }
                if (schedule == "Bi-Weekly") {
                    addNext = moment(d, "DD-MM-YYYY").add(2, 'weeks');
                }
                if (schedule == "Monthly") {
                    addNext = moment(d, "DD-MM-YYYY").add(1, 'months');
                }
                if (schedule == "Quarterly") {
                    addNext = moment(d, "DD-MM-YYYY").add(1, 'quarters');
                }
                if (schedule == "Semi-Annually") {
                    addNext = moment(d, "DD-MM-YYYY").add(6, 'months');
                }
                if (schedule == "Annually") {
                    addNext = moment(d, "DD-MM-YYYY").add(1, 'years');
                }

                return addNext;
            }
        },

        format_YYYYMMDD_DateStringToDate: function (dateString) {
            try {
                var dateComponents = dateString.split("-");
                var yyyy = dateComponents[0];
                var mm = String(parseInt(dateComponents[1]) - 1);
                var dd = dateComponents[2];

                return new Date(yyyy, mm, dd, "12", "00", "0000");
            }
            catch (err) {
                console.error(err);
                return null;
            }
        },

        formatDateTo_YYYYMMDD_String: function (date) {
            try {

                if (date == undefined)
                    return null;

                var yyyy = date.getFullYear();
                var mm = date.getMonth() + 1;
                if (String(mm).length < 2)
                    mm = "0" + String(mm);

                var dd = date.getDate();
                if (String(dd).length < 2)
                    dd = "0" + String(dd);

                return yyyy + "-" + mm + "-" + dd;
            }
            catch (err) {
                console.error(err);
            }
        },

        formatDateTo_VSOFT_MMDDYYYY_String: function (date) {
            try {

                if (date == undefined)
                    return null;

                var yyyy = date.getFullYear();
                var mm = date.getMonth() + 1;
                if (String(mm).length < 2)
                    mm = "0" + String(mm);

                var dd = date.getDate();
                if (String(dd).length < 2)
                    dd = "0" + String(dd);

                return mm + "/" + dd + "/" + yyyy;

            }
            catch (err) {
                console.error(err);
            }
        },

        formatVSOFT_MMDDYYYY_StringToDate: function (dateString) {
            try {

                if (dateString == undefined)
                    return null;

                dateComponents = dateString.split("/");

                var yyyy = dateComponents[2];
                var mm = dateComponents[0];
                var dd = dateComponents[1];

                return new Date(yyyy, mm, dd);

            }
            catch (err) {
                console.error(err);
            }
        },

        differenceOfDates_in_Days: function (date1, date2) {
            /* In javascript, DATE-DATE gives the difference in milliseconds.
             * To get the number of days gap
             * ((( DIFFERENCE-IN-MILLISECONDS / 1000 ) / 60 ) / 60 ) / 24
             */
            diff_in_miliseconds = date2 - date1;
            return diff_in_miliseconds / (1000 * 60 * 60 * 24);
        },

        compareDates: function (dateObject1, dateObject2) {
            try {

                if (dateObject1 == undefined || dateObject2 == undefined)
                    return false;

                var yyyy1 = dateObject1.getFullYear().toString();
                var mm1 = (dateObject1.getMonth() + 1).toString();
                var dd1 = dateObject1.getDate().toString();
                var dateString1 = yyyy1 + "" + mm1 + "" + dd1;

                var yyyy2 = dateObject2.getFullYear().toString();
                var mm2 = (dateObject2.getMonth() + 1).toString();
                var dd2 = dateObject2.getDate().toString();
                var dateString2 = yyyy2 + "" + mm2 + "" + dd2;

                return (dateString1 == dateString2);

            }
            catch (err) {
                console.error(err);
            }
        },

        computeNextTransferDate: function (theLastTransferDate, theFrequency) {
            var theNextTransferDate = null;

            if (theFrequency == "DAILY")
                theNextTransferDate = moment(theLastTransferDate).add(1, 'days');
            else if (theFrequency == "WEEKLY")
                theNextTransferDate = moment(theLastTransferDate).add(7, 'days');
            else if (theFrequency == "BI-WEEKLY")
                theNextTransferDate = moment(theLastTransferDate).add(14, 'days');
            else if (theFrequency == "FORTNIGHTLY")
                theNextTransferDate = moment(theLastTransferDate).add(15, 'days');
            else if (theFrequency == "MONTHLY")
                theNextTransferDate = moment(theLastTransferDate).add(1, 'months');
            else if (theFrequency == "QUARTERLY")
                theNextTransferDate = moment(theLastTransferDate).add(3, 'months');
            else if (theFrequency == "SEMI-ANNUALLY")
                theNextTransferDate = moment(theLastTransferDate).add(6, 'months');
            else if (theFrequency == "ANNUALLY")
                theNextTransferDate = moment(theLastTransferDate).add(12, 'months');

            return theNextTransferDate;
        },

        getTimezoneFromDate: function (targetDate) {
            return String(targetDate.toString().substring(targetDate.toString().indexOf("(") + 1, targetDate.toString().indexOf(")")));
        },

        getDateForLocalTimezone: function (targetDate) {

            if(targetDate==null)
                return null;

            var diff = (new Date().getTimezoneOffset()) * 60 * 1000;
            var localtimezone = this.getTimezoneFromDate(new Date());
            var targettimezone = this.getTimezoneFromDate(targetDate);

            /*document.getElementById("test3")
             .innerHTML="localtimezone : "+localtimezone+" &nbsp;&nbsp"+
             "targettimezone : "+targettimezone+" &nbsp;&nbsp"+diff;*/

            //EST-EDT = 1hr
            if (localtimezone == "EDT" && targettimezone == "EST") {
                if (diff < 0)
                    diff = diff - ((60 * 1000) * 60 * 1); //-1 hr
                else
                    diff = diff + ((60 * 1000) * 60 * 1); //+1 hr
            }

            //EST-EDT = 1hr
            if (localtimezone == "EST" && targettimezone == "EDT") {
                if (diff < 0)
                    diff = diff + ((60 * 1000) * 60 * 1); //-1 hr
                else
                    diff = diff - ((60 * 1000) * 60 * 1); //+1 hr
            }

            //CST-CDT = 1hr
            if (localtimezone == "CDT" && targettimezone == "CST") {
                if (diff < 0)
                    diff = diff - ((60 * 1000) * 60 * 1); //-1 hr
                else
                    diff = diff + ((60 * 1000) * 60 * 1); //+1 hr
            }

            //CST-CDT = 1hr
            if (localtimezone == "CST" && targettimezone == "CDT") {
                if (diff < 0)
                    diff = diff + ((60 * 1000) * 60 * 1); //-1 hr
                else
                    diff = diff - ((60 * 1000) * 60 * 1); //+1 hr
            }

            //document.getElementById("test4").innerHTML=diff+"<br/>"+(new Date(targetDate.getTime()+diff).toString());

            var localdate = new Date(targetDate.getTime() + diff);

            var localdateObject = new Date((localdate.getMonth()+1)+"/"+localdate.getDate()+"/"+localdate.getFullYear());

            return localdateObject;
        },
        replaceString : function (object,text) {
            var textArray = text.split(" ");
            for(var i = 0 ; i < textArray.length ; i++){
                for(obj in object) {
                    if (textArray[i] == obj) {
                        textArray[i] = object[obj]
                    }
                }
            }
            return textArray.join(" ");
        }

    };

    module.exports.util = function () {
        return (new Util());
    };
})();