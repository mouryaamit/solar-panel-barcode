(function(){

    var _ = require('underscore');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    function Ach(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.ACHRoutingInfoModel = mongoModelName.modelName.ACHRoutingInfo;
        this.ACHRoutingNoModel = mongoModelName.modelName.ACHRoutingNo;
        this.FedRoutingInfoModel = mongoModelName.modelName.FedRoutingInfo;
        this.FedRoutingNoModel = mongoModelName.modelName.FedRoutingNo;
    }

    Ach.prototype = {
        checkRoutingNo : function(routingNo , callback, type){

            var routed = {
                routingNo          : routingNo
            };

            var mongo = "";
            if(type == "ach") {
                mongo = this.utils.initMongo(this.ACHRoutingNoModel, routed, this.tnxId);
            } else {
                mongo = this.utils.initMongo(this.FedRoutingNoModel, routed, this.tnxId);
            }
            mongo.FindOneMethod(callback);
        },
        retrieveRoutingNumber  : function(reqBody , callback){
            this.callback = callback;
            this.type = reqBody.type;
            this.bankName = reqBody.bankName;
            var scKey = reqBody.stateCode + reqBody.city;
            scKey = scKey.split(" ").join("");
            var routed = {
                scKey          : scKey
            };

            var mongo = "";
            if(this.type == "ach") {
                mongo = this.utils.initMongo(this.ACHRoutingInfoModel, routed, this.tnxId);
            } else {
                mongo = this.utils.initMongo(this.FedRoutingInfoModel, routed, this.tnxId);
            }
            var resHandle = this.routingNumberRetrieval.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        routingNumberRetrieval              : function(err , result){
            if(!result){
                var res = [];
                this.callback(null , res);
            }else{

                var banks = result.banks;
                var regExp = new RegExp(this.bankName , "i");
                var bankFound = [];

                for(var i = 0 ; i < banks.length ; i++){
                    var bankInList = banks[i].bankName;
                    var isTrue = bankInList.search(regExp);

                    if(isTrue >= 0){
                        bankFound.push(banks[i]);
                    }
                }
                this.callback(null , bankFound);
            }
        }
    };

    module.exports = function(config , tnxId){
        return (new Ach(config , tnxId));
    };
})();