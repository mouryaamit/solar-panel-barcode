(function(){

    var events = require('events').EventEmitter;
    var util = require('util');

    var eventEmitterHandler = module.exports.eventEmitterHandler = function(){

        events.call(this);

        this.send = function (response , responseObj) {

            this.emit('sendResponse' , response , responseObj);
        };
    };
    util.inherits(eventEmitterHandler, events);
})();