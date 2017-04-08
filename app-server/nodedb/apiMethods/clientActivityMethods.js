(function(){

    var _ = require('underscore');

    var errorResponse = require('../gen/errorResponse');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var moment = require('moment');


    function ClientActivity(config , tnxId){
        var utils = require('../lib/utils/utils');
        var dated = new Date();
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.dated = (dated.getMonth() + 1) + "/" + dated.getDate() + "/" + dated.getFullYear().toString().substr(2,2);
        this.utils = utils.util();
       // this.model = require('../lib/models/dbModel').SessionReport;
        this.model = mongoModelName.modelName.SessionReport;

    }

    ClientActivity.prototype = {
        getClientActivityReport : function(reqBody , callback){
            this.reqBody = reqBody;
            this.callback = callback;
            /*var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId,
                createdOn: reqBody.fromDate,
                updatedOn: reqBody.toDate
            };*/
            var fromDate = moment(reqBody.fromDate,'MM/DD/YYYY').startOf("day");
            var toDate = moment(reqBody.toDate,'MM/DD/YYYY').endOf("day");
            var routed = {
                'institutionId': this.config.instId,
                'userId': reqBody.selectedUserId,
                '$and':[{'createdOn': { $gte:fromDate  }}, {'createdOn': { $lte: toDate }}]
            };
            var fileds = "createdOn moduleType activityType transaction.message transaction.ipAddress transaction.url";

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId,fileds);
            var resHandle = this.findClientActivity.bind(this);
            mongo.FindMethod(resHandle);
        },
        findClientActivity: function(err , result){
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null, result);
            }

        }
    };

    module.exports = function(config , tnxId){
        return (new ClientActivity(config , tnxId));
    };
})();