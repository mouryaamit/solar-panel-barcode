(function(){

    var requestMx = require('./sessionRequest');

    var errorResponse = require('../../gen/errorResponse');

    var xmltojson = require('xml2js');

    function Mx(config , tnxId){
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.tnxId= tnxId;
    }

    Mx.prototype = {
        requestSession: function(callback, widgetType){
            this.callback = callback;
            this.widgetType = widgetType;
            var handleRes  = this.responseHandle.bind(this);
            var session = requestMx(handleRes , this.tnxId);
            session.requestMx(widgetType);
        },
        responseHandle: function(err , result){
            if(err){
                this.callback(this.errorResponse.SessionCreationFailed , null);
            }else{
                var xmlJSON = this.xmlToJson.bind(this);
                xmlJSON(result);
            }
        },
        xmlToJson : function(response){
            var that = this;

            xmltojson.parseString(response ,{explicitRoot : false ,ignoreAttrs: true ,explicitArray: false ,tagNameProcessors : [function(name){
                var indexAt = name.indexOf(':');
                if(indexAt == -1){
                    return name;
                }else {
                    return name.slice(indexAt + 1, name.length);
                }
            }]}, function(err , result){
                that.callback(null , result);
            });
        }
    };

    module.exports = function(config , callback , tnxId){
        return (new Mx(config ,callback , tnxId));
    }
})();