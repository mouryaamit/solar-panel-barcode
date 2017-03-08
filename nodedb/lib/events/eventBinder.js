(function(){

    var eventEmitterCaller = require('./eventEmitter').eventEmitterHandler;
    var eventListenerCaller = require('./eventListener').eventListenerHandler;

    var eventEmitter = module.exports.eventEmitter = new eventEmitterCaller();
    var eventListener = module.exports.eventListener = new eventListenerCaller(eventEmitter);

    eventEmitter.on('sendResponse', eventListener.sendResponseHandler);

})();