(function () {

    var responseObj = require('.././callbacks').response;

    module.exports.eventListenerHandler = function () {

        this.sendResponseHandler = function (response , responseData) {
            responseObj(response , responseData);
        };
    };
})();