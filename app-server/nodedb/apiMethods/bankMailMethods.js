(function () {

    var fs = require('fs');

    var path = require('path');

    var moment = require('moment');

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var scp2 = require('scp2')

    var Client = require('ssh2').Client;

    var ssh2 = new Client();

    var mkdirp = require("mkdirp")

    var utils = require('../lib/utils/utils');

    function BankMail(config, tnxId) {
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.BankMail;
    }

    BankMail.prototype = {
        sendEmailFromAdmin: function (reqBody, callback) {
            var userMethods = require('./userMethods');
            this.callback = callback;

            this.message = reqBody.message;
            this.subject = reqBody.subject;

            this.isAttachment = false;
            var files = reqBody.files;
            if (files.length > 0) {
                var that = this;
                this.isAttachment = true;
                that.attachmentArr = null || [];
                var location = "attachments"
                var filePath = path.resolve('./' + location + '/' + reqBody.userName);
                that.files = files;
                var getDirName = require("path").dirname;
                mkdirp(getDirName(filePath + '/test'), function (err) {
                });
                ssh2.on('ready', function () {
                    ssh2.exec('mkdir -p ' + that.config.omniWebServer.path + '/' + location + '/' + reqBody.userName, function (err, stream) {
                        return ssh2.end();
                    });
                }).connect({
                    host: that.config.omniWebServer.host,
                    username: that.config.omniWebServer.username,
                    password: that.config.omniWebServer.password,
                    port: 22
                });
                for (var i = 0; i < that.files.length; i++) {
                    var fileNameCheck = that.files[i].name.split(".");
                    if(fileNameCheck.length > 2){
                        return 0;
                    }
                    if (fileNameCheck[1] == "gif"
                        || fileNameCheck[1] == "jpg"
                        || fileNameCheck[1] == "jpeg"
                        || fileNameCheck[1] == "png"
                        || fileNameCheck[1] == "doc"
                        || fileNameCheck[1] == "docx"
                        || fileNameCheck[1] == "xls"
                        || fileNameCheck[1] == "xlsx"
                        || fileNameCheck[1] == "pdf") {
                    } else {
                        return 0;
                    }
                    var fileName = this.utils.getToken() + path.extname(that.files[i].name);
                    that.files[i].fileName = fileName;
                    var attachObj = {
                        path: location + '/' + reqBody.userName + '/' + fileName,
                        fileName: that.files[i].name,
                        fileSize: that.files[i].size
                    };
                    that.attachmentArr.push(attachObj);
                }
                setTimeout(function () {
                    for (var i = 0; i < that.files.length; i++) {
                        var fileName = that.files[i].fileName;
                        fs.writeFileSync(filePath + '/' + fileName, that.files[i].base64String, 'base64');
                        scp2.scp(filePath + '/' + fileName, {
                            host: that.config.omniWebServer.host,
                            username: that.config.omniWebServer.username,
                            password: that.config.omniWebServer.password,
                            path: that.config.omniWebServer.path + '/' + location + '/' + reqBody.userName + '/' + fileName
                        }, function (err) {
                            if (err)
                                console.error('File transfer failed: ' + fileName);
                        })

                    }
                }, 1000);

            }

            var user = userMethods(this.config, this.tnxId);
            var resHandle = this.completeAdminEmail.bind(this);
            var routed = {
                institutionId: this.config.instId
            };

            if (reqBody.messageType == "Individual") {
                routed.userName = reqBody.userName;
            } else {
                routed.accessType = reqBody.accessType;
                if (reqBody.accessType == "All") routed = {institutionId: this.config.instId};
            }
            user.defaultAllMethod(routed, resHandle);
        },
        completeAdminEmail: function (err, result) {
            if (result.length > 0) {

                for (var i = 0; i < result.length; i++) {
                    var messageId = this.utils.getToken();

                    var routed = {
                        institutionId: this.config.instId,
                        sendFrom: 'admin',
                        sendTo: 'user',
                        userId: result[i].userId,
                        senderName: this.config.mailerSetting.fromName,
                        receiverName: result[i].userName,
                        messageId: messageId,
                        message: this.message,
                        messageType: 'Bank Mail',
                        subject: this.subject,
                        isAttachment: this.isAttachment,
                        attachments: this.attachmentArr,
                        reply: []
                    };
                    var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                    mongo.Save();
                }
                this.callback(null, {message: this.successResponse.SentMail});
            } else {
                var error = this.errorResponse.UserIDNotFoundFailed;
                this.callback(error, null);
            }
        },
        replyByAdmin: function (reqBody, callback) {
            this.callback = callback;

            this.reqBody = reqBody;
            this.sendToName = reqBody.sendToName;
            var routed = {
                institutionId: this.config.instId,
                messageId: reqBody.messageId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.updateAdminReply.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        updateAdminReply: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                result.isUserRead = false;
                result.isReply = true;
                result.isAdminReply = true;
                result.isUserMessageDeleted = false;
                result.isUserMessageTrash = false;

                var attachmentArr = [];
                var isAttachment = false;
                var reqBody = this.reqBody;
                var files = this.reqBody.files;
                if (files.length > 0) {
                    var that = this;
                    isAttachment = true;
                    var location = "attachments"
                    var filePath = path.resolve('./' + location + '/' + reqBody.sendToName);
                    that.files = files;
                    var getDirName = require("path").dirname;
                    mkdirp(getDirName(filePath + '/test'), function (err) {
                    });
                    ssh2.on('ready', function () {
                        ssh2.exec('mkdir -p ' + that.config.omniWebServer.path + '/' + location + '/' + reqBody.sendToName, function (err, stream) {
                            return ssh2.end();
                        });
                    }).connect({
                        host: that.config.omniWebServer.host,
                        username: that.config.omniWebServer.username,
                        password: that.config.omniWebServer.password,
                        port: 22
                    });
                    for (var i = 0; i < that.files.length; i++) {
                        var fileNameCheck = that.files[i].name.split(".");
                        if(fileNameCheck.length > 2){
                            return 0;
                        }
                        if (fileNameCheck[1] == "gif"
                            || fileNameCheck[1] == "jpg"
                            || fileNameCheck[1] == "jpeg"
                            || fileNameCheck[1] == "png"
                            || fileNameCheck[1] == "doc"
                            || fileNameCheck[1] == "docx"
                            || fileNameCheck[1] == "xls"
                            || fileNameCheck[1] == "xlsx"
                            || fileNameCheck[1] == "pdf") {
                        } else {
                            return 0;
                        }
                        var fileName = this.utils.getToken() + path.extname(that.files[i].name);
                        that.files[i].fileName = fileName;
                        var attachObj = {
                            path: location + '/' + reqBody.sendToName + '/' + fileName,
                            fileName: that.files[i].name,
                            fileSize: that.files[i].size
                        };
                        attachmentArr.push(attachObj);
                    }
                    setTimeout(function () {
                        for (var i = 0; i < that.files.length; i++) {
                            var fileName = that.files[i].fileName;
                            fs.writeFileSync(filePath + '/' + fileName, that.files[i].base64String, 'base64');
                            scp2.scp(filePath + '/' + fileName, {
                                host: that.config.omniWebServer.host,
                                username: that.config.omniWebServer.username,
                                password: that.config.omniWebServer.password,
                                path: that.config.omniWebServer.path + '/' + location + '/' + reqBody.sendToName + '/' + fileName
                            }, function (err) {
                                if (err)
                                    console.error('File transfer failed: ' + fileName);
                            });
                        }
                    }, 1000);
                }

                var replyId = this.utils.getToken();
                var replyObj = {
                    replyDated: new Date(),
                    replyId: replyId,
                    senderName: this.config.mailerSetting.fromName,
                    receiverName: this.sendToName,
                    message: this.reqBody.message,
                    messageType: 'Bank Mail',
                    subject: this.reqBody.subject,
                    isAttachment: isAttachment,
                    attachments: attachmentArr
                };

                result.reply.push(replyObj);
                result.save();

                this.callback(null, {message: this.successResponse.SentMail});
            }
        },
        replyByUser: function (reqBody, callback) {
            this.callback = callback;

            this.reqBody = reqBody;
            this.senderName = reqBody.userSelectedName;
            var routed = {
                institutionId: this.config.instId,
                messageId: reqBody.messageId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.updateUserReply.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        updateUserReply: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                result.isAdminRead = false;
                result.isReply = true;
                result.isUserReply = true;
                result.isAdminMessageDeleted = false;
                result.isAdminMessageTrash = false;
                var attachmentArr = [];
                var isAttachment = false;
                var files = this.reqBody.files;
                if (files.length > 0) {
                    var that = this;
                    isAttachment = true;
                    var location = "attachments"
                    var filePath = path.resolve('./' + location + '/' + this.reqBody.userId);
                    that.files = files;
                    var getDirName = require("path").dirname;
                    mkdirp(getDirName(filePath + '/test'), function (err) {
                    });
                    ssh2.on('ready', function () {
                        ssh2.exec('mkdir -p ' + that.config.omniWebServer.path + '/' + location + '/' + that.reqBody.userId, function (err, stream) {
                            return ssh2.end();
                        });
                    }).connect({
                        host: that.config.omniWebServer.host,
                        username: that.config.omniWebServer.username,
                        password: that.config.omniWebServer.password,
                        port: 22
                    });
                    for (var i = 0; i < that.files.length; i++) {
                        var fileNameCheck = that.files[i].name.split(".");
                        if(fileNameCheck.length > 2){
                            return 0;
                        }
                        if (fileNameCheck[1] == "gif"
                            || fileNameCheck[1] == "jpg"
                            || fileNameCheck[1] == "jpeg"
                            || fileNameCheck[1] == "png"
                            || fileNameCheck[1] == "doc"
                            || fileNameCheck[1] == "docx"
                            || fileNameCheck[1] == "xls"
                            || fileNameCheck[1] == "xlsx"
                            || fileNameCheck[1] == "pdf") {
                        } else {
                            return 0;
                        }
                        var fileName = this.utils.getToken() + path.extname(that.files[i].name);
                        that.files[i].fileName = fileName;
                        var attachObj = {
                            path: location + '/' + this.reqBody.userId + '/' + fileName,
                            fileName: that.files[i].name,
                            fileSize: that.files[i].size
                        };
                        attachmentArr.push(attachObj);
                    }
                    setTimeout(function () {
                        for (var i = 0; i < that.files.length; i++) {
                            var fileName = that.files[i].fileName;
                            fs.writeFileSync(filePath + '/' + fileName, that.files[i].base64String, 'base64');
                            scp2.scp(filePath + '/' + fileName, {
                                host: that.config.omniWebServer.host,
                                username: that.config.omniWebServer.username,
                                password: that.config.omniWebServer.password,
                                path: that.config.omniWebServer.path + '/' + location + '/' + that.reqBody.userId + '/' + fileName
                            }, function (err) {
                                if (err)
                                    console.error('File transfer failed: ' + fileName);
                            })
                        }
                    }, 1000);
                }

                var replyId = this.utils.getToken();
                var replyObj = {
                    replyDated: new Date(),
                    replyId: replyId,
                    senderName: this.senderName,
                    receiverName: this.config.mailerSetting.fromName,
                    message: this.reqBody.message,
                    subject: this.reqBody.subject,
                    isAttachment: isAttachment,
                    attachments: attachmentArr
                };

                result.reply.push(replyObj);
                result.save();

                this.callback(null, {message: this.successResponse.SentMail});
            }
        },
        sendEmailFromUser: function (reqBody, callback) {
            this.callback = callback;

            this.message = reqBody.message;
            this.subject = reqBody.subject;

            var attachmentArr = [];
            var isAttachment = false;
            var files = reqBody.files;
            if (files.length > 0) {
                var that = this;
                isAttachment = true;
                var location = "attachments"
                var filePath = path.resolve('./' + location + '/' + reqBody.userId);
                that.files = files;
                var getDirName = require("path").dirname;
                mkdirp(getDirName(filePath + '/test'), function (err) {
                });
                ssh2.on('ready', function () {
                    ssh2.exec('mkdir -p ' + that.config.omniWebServer.path + '/' + location + '/' + reqBody.userId, function (err, stream) {
                        return ssh2.end();
                    });
                }).connect({
                    host: that.config.omniWebServer.host,
                    username: that.config.omniWebServer.username,
                    password: that.config.omniWebServer.password,
                    port: 22
                });
                for (var i = 0; i < that.files.length; i++) {
                    var fileNameCheck = that.files[i].name.split(".");
                    if(fileNameCheck.length > 2){
                        return 0;
                    }
                    if (fileNameCheck[1] == "gif"
                        || fileNameCheck[1] == "jpg"
                        || fileNameCheck[1] == "jpeg"
                        || fileNameCheck[1] == "png"
                        || fileNameCheck[1] == "doc"
                        || fileNameCheck[1] == "docx"
                        || fileNameCheck[1] == "xls"
                        || fileNameCheck[1] == "xlsx"
                        || fileNameCheck[1] == "pdf") {
                    } else {
                        return 0;
                    }
                    var fileName = this.utils.getToken() + path.extname(that.files[i].name);
                    that.files[i].fileName = fileName;
                    var attachObj = {
                        path: location + '/' + reqBody.userId + '/' + fileName,
                        fileName: that.files[i].name,
                        fileSize: that.files[i].size
                    };
                    attachmentArr.push(attachObj);
                }
                setTimeout(function () {

                    for (var i = 0; i < that.files.length; i++) {
                        var fileName = that.files[i].fileName;
                        fs.writeFileSync(filePath + '/' + fileName, that.files[i].base64String, 'base64');
                        scp2.scp(filePath + '/' + fileName, {
                            host: that.config.omniWebServer.host,
                            username: that.config.omniWebServer.username,
                            password: that.config.omniWebServer.password,
                            path: that.config.omniWebServer.path + '/' + location + '/' + reqBody.userId + '/' + fileName
                        }, function (err) {
                            if (err)
                                console.error('File transfer failed: ' + fileName);
                        })
                    }
                }, 1000);

            }


            var messageId = this.utils.getToken();

            var routed = {
                institutionId: this.config.instId,
                sendFrom: 'user',
                sendTo: 'admin',
                userId: reqBody.userId,
                senderName: reqBody.userSelectedName,
                receiverName: this.config.mailerSetting.fromName,
                messageId: messageId,
                message: this.message,
                messageType: 'Bank Mail',
                subject: this.subject,
                isAttachment: isAttachment,
                attachments: attachmentArr,
                reply: []
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.completeUserEmail.bind(this);
            mongo.Save(resHandle);
        },
        completeUserEmail: function (err, result) {
            if (err) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null, {message: this.successResponse.SentMail});
            }
        },
        adminMessageToTrash: function (reqBody, callback) {
            this.callback = callback;

            var trashMessages = reqBody.trashMessage;
            for (var i = 0; i < trashMessages.length; i++) {
                var routed = {
                    institutionId: this.config.instId,
                    messageId: trashMessages[i].messageId
                };

                var done = false;
                if (i == (trashMessages.length - 1)) done = this.updatedTrashBox.bind(this);
                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var trashBox = new TrashMethods(this.config, this.tnxId, done);
                var resHandle = trashBox.updateAdminTrash.bind(trashBox);
                mongo.FindOneMethod(resHandle);
            }
        },
        userMessageToTrash: function (reqBody, callback) {
            this.callback = callback;

            var trashMessages = reqBody.trashMessage;
            this.userId = reqBody.userId;
            for (var i = 0; i < trashMessages.length; i++) {
                var routed = {
                    institutionId: this.config.instId,
                    userId: this.userId,
                    messageId: trashMessages[i].messageId
                };

                var done = false;
                if (i == (trashMessages.length - 1)) done = this.updatedTrashBox.bind(this);
                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var trashBox = new TrashMethods(this.config, this.tnxId, done);
                var resHandle = trashBox.updateUserTrash.bind(trashBox);
                mongo.FindOneMethod(resHandle);
            }
        },
        updatedTrashBox: function () {
            this.callback(null, {message: this.successResponse.TrashMail});
        },
        showAdminInbox: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                $or: [
                    {sendFrom: 'user'},
                    {isUserReply: true}
                ],
                isAdminMessageTrash: false,
                isAdminMessageDeleted: false
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.listMailBox.bind(this);
            mongo.FindMethod(resHandle);
        },
        showUserInbox: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                $or: [
                    {sendFrom: 'admin'},
                    {isAdminReply: true}
                ],
                userId: reqBody.userId,
                isUserMessageTrash: false,
                isUserMessageDeleted: false
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.listMailBox.bind(this);
            mongo.FindMethod(resHandle);
        },
        showAdminSentBox: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                $or: [
                    {sendFrom: 'admin'},
                    {isAdminReply: true}
                ],
                isAdminMessageTrash: false,
                isAdminMessageDeleted: false
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.listMailBox.bind(this);
            mongo.FindMethod(resHandle);
        },
        showUserSentBox: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId,
                $or: [
                    {sendFrom: 'user'},
                    {isUserReply: true}
                ],
                isUserMessageTrash: false,
                isUserMessageDeleted: false
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.listMailBox.bind(this);
            mongo.FindMethod(resHandle);
        },
        showAdminTrashBox: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                isAdminMessageTrash: true,
                isAdminMessageDeleted: false
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.listMailBox.bind(this);
            mongo.FindMethod(resHandle);
        },
        showUserTrashBox: function (reqBody, callback) {
            this.callback = callback;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId,
                isUserMessageTrash: true,
                isUserMessageDeleted: false
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.listMailBox.bind(this);
            mongo.FindMethod(resHandle);
        },
        removeFromAdminTrash: function (reqBody, callback) {
            this.callback = callback;

            var deleteMessages = reqBody.deleteMessage;
            for (var i = 0; i < deleteMessages.length; i++) {
                var routed = {
                    institutionId: this.config.instId,
                    messageId: deleteMessages[i].messageId
                };

                var done = false;
                if (i == (deleteMessages.length - 1)) done = this.updatedTrashBox.bind(this);
                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var trashBox = new TrashMethods(this.config, this.tnxId, done);
                var resHandle = trashBox.deleteAdminTrash.bind(trashBox);
                mongo.FindOneMethod(resHandle);
            }
        },
        removeFromUserTrash: function (reqBody, callback) {
            this.callback = callback;

            var deleteMessages = reqBody.deleteMessage;
            this.userId = reqBody.userId;
            for (var i = 0; i < deleteMessages.length; i++) {
                var routed = {
                    institutionId: this.config.instId,
                    userId: this.userId,
                    messageId: deleteMessages[i].messageId
                };

                var done = false;
                if (i == (deleteMessages.length - 1)) done = this.updatedTrashBox.bind(this);
                var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
                var trashBox = new TrashMethods(this.config, this.tnxId, done);
                var resHandle = trashBox.deleteUserTrash.bind(trashBox);
                mongo.FindOneMethod(resHandle);
            }
        },
        listMailBox: function (err, result) {
            if (err) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                this.callback(null, result);
            }
        },
        markIsAdminRead: function (reqBody, callback) {
            this.callback = callback;

            this.watHappned = true;

            var routed = {
                institutionId: this.config.instId,
                messageId: reqBody.messageId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.updateMailAdminRead.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        markIsUserRead: function (reqBody, callback) {
            this.callback = callback;

            this.watHappned = true;

            var routed = {
                institutionId: this.config.instId,
                userId: reqBody.userId,
                messageId: reqBody.messageId
            };

            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            var resHandle = this.updateMailUserRead.bind(this);
            mongo.FindOneMethod(resHandle);
        },
        markIsUnRead: function (reqBody, callback) {
        },
        updateMailAdminRead: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                result.isAdminRead = this.watHappned;
                result.save();
                this.callback(null, {message: 'Read/UnRead Completed'});
            }
        },
        updateMailUserRead: function (err, result) {
            if (!result) {
                var error = this.errorResponse.OperationFailed;
                this.callback(error, null);
            } else {
                result.isUserRead = this.watHappned;
                result.save();
                this.callback(null, {message: 'Read/UnRead Completed'});
            }
        },
        statementsDeEnrollments: function (data) {
            var messageId = this.utils.getToken();
            var subject = 'eStatements DeEnroll';
            var template = 'Dear Admin, \n\n' +
                'eStatements de-enrollment request details are below: \n' +
                'Request Date & Time : ' + (new Date()) + '\n' +
                'Account number for which de-enrollment has been requested : ' + data.accountNumber + '\n' +
                'User who has requested eStatements de-enrollment : ' + data.customerName + '\n' +
                'Email id of the user : ' + data.EmailId + '\n' +
                'For any questions please contact the sender.';
            var routed = {
                institutionId: this.config.instId,
                sendFrom: 'user',
                sendTo: 'admin',
                userId: data.userId,
                receiverName: this.config.mailerSetting.fromName,
                messageId: messageId,
                senderName: data.userName,
                message: template,
                messageType: subject,
                subject: subject,
                isAttachment: false,
                isUserMessageDeleted: true,
                attachments: [],
                reply: []
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.Save();
        },
        statementsEnrollments: function (data) {
            var messageId = this.utils.getToken();
            var subject = 'eStatements Enroll';
            var template = 'Dear Admin, \n\n' +
                'eStatements enrollment request details are below: \n' +
                'Request Date & Time : ' + (new Date()) + '\n' +
                'Account number for which enrollment has been requested : ' + data.accountNumber + '\n' +
                'User who has requested eStatements enrollment : ' + data.customerName + '\n' +
                'Email id of the user : ' + data.EmailId + '\n' +
                'For any questions please contact the sender.';
            var routed = {
                institutionId: this.config.instId,
                sendFrom: 'user',
                sendTo: 'admin',
                userId: data.userId,
                senderName: data.userName,
                receiverName: this.config.mailerSetting.fromName,
                messageId: messageId,
                message: template,
                messageType: subject,
                subject: subject,
                isAttachment: false,
                isUserMessageDeleted: true,
                attachments: [],
                reply: []
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.Save();
        },
        addWireTransfer: function (data) {

            var subject = 'Wire Transfer';

            /*'From: \n'+
             'Date: '+ moment(data.createdOn).format("dddd, MMMM D, YYYY") +'\n'+
             'Subject: '+ subject +'\n'+
             'To: DoNotReply@pointbank.com\n'+*/

            var wireTemplate = 'Wire transfer request details are given below.\n' +
                'Request Date & Time – ' + moment(data.createdOn).format("dddd, MMMM D, YYYY h:mm:ss A") + '\n' +
                'Sender Information\n' +
                'Account – ' + data.fromAccount + '\n' +
                'Amount - $ ' + data.amount + '\n' +
                'Recipient Information\n' +
                'Recipient Name – ' + data.beneficiary.beneficiaryName + '\n' +
                'Recipient Account – ' + data.beneficiary.recipientBankInfo.accountNo + '\n';

            if (data.beneficiary.specialInstruction.instruction1) wireTemplate = wireTemplate + 'Special Instructions1 – ' + data.beneficiary.specialInstruction.instruction1 + '\n';
            if (data.beneficiary.specialInstruction.instruction2) wireTemplate = wireTemplate + 'Special Instructions2 – ' + data.beneficiary.specialInstruction.instruction2 + '\n';
            if (data.beneficiary.specialInstruction.instruction3) wireTemplate = wireTemplate + 'Special Instructions3 – ' + data.beneficiary.specialInstruction.instruction3 + '\n';
            if (data.beneficiary.specialInstruction.instruction4) wireTemplate = wireTemplate + 'Special Instructions4 – ' + data.beneficiary.specialInstruction.instruction4 + '\n';
            wireTemplate = wireTemplate + 'Recipient Bank Information\n' +
                'Recipient Bank Name – ' + data.beneficiary.recipientBankInfo.bankName + '\n' +
                'Recipient Bank Routing Number – ' + data.beneficiary.recipientBankInfo.bankRoutingNo + '\n';

            if (data.beneficiary.intermediateBank.bankName || data.beneficiary.intermediateBank.bankRoutingNo) wireTemplate = wireTemplate + 'Intermediate Bank Information\n';
            if (data.beneficiary.intermediateBank.bankName) wireTemplate = wireTemplate + 'Intermediate Bank Name – ' + data.beneficiary.intermediateBank.bankName + '\n';
            if (data.beneficiary.intermediateBank.bankRoutingNo) wireTemplate = wireTemplate + 'Intermediate Bank Routing Number – ' + data.beneficiary.intermediateBank.bankRoutingNo + '\n';

            wireTemplate = wireTemplate + 'Schedule Information\n' +
                'Schedule Date – ' + moment(data.scheduledInfo.recurringNextDate).format("MM/DD/YYYY") + '\n' +
                'Schedule Type – ' + data.scheduledInfo.scheduledType + '\n';

            if (data.scheduledInfo.scheduledType == "Recurring") wireTemplate = wireTemplate + 'Frequency – ' + data.scheduledInfo.frequency + '\n' + 'Expiration Date – ' + data.scheduledInfo.expiryDate + '\n';

            wireTemplate = wireTemplate + '\tThe request is to be processed immediately.\n' +
                'For any questions please contact the sender.\n' +
                '\nIMPORTANT/CONFIDENTIAL: This transmission is intended only for the use of the addressee(s) shown.It contains information that may be privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient of this transmission, you are hereby notified that the copying, use, or distribution of any information or materials transmitted herewith is strictly prohibited. If you have received this transmission by mistake, please contact sender immediately.';

            var messageId = this.utils.getToken();

            var routed = {
                institutionId: this.config.instId,
                bankId: this.config.instId,
                sendFrom: 'user',
                sendTo: 'admin',
                userId: data.userId,
                senderName: data.userSelectedName,
                receiverName: this.config.mailerSetting.fromName,
                messageId: messageId,
                message: wireTemplate,
                messageType: subject,
                subject: subject,
                isAttachment: false,
                isUserMessageDeleted: true,
                attachments: [],
                reply: []
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.Save();
        },
        addOrderCheckBook: function (data) {

            var subject = 'Check Orders';

            /*'From: \n'+
             'Date: '+ moment(data.createdOn).format("dddd, MMMM D, YYYY") +'\n'+
             'Subject: '+ subject +'\n'+
             'To: DoNotReply@pointbank.com\n'+*/

            var newDated = new Date();
            var orderCheckTemplate = 'Check Order request details are given below.\n' +
                'Request Date & Time – ' + moment(newDated).format("dddd, MMMM D, YYYY h:mm:ss A") + '\n' +
                'Check Order details\n' +
                'Account – ' + data.accountNo + '\n' +
                'Phone Number – ' + data.phoneNumber + '\n' +
                'Starting Check Number – ' + data.startingCheckNo + '\n' +
                'Number of Boxes – ' + data.noOfBoxes + '\n' +
                'Design – ' + data.design + '\n' +
                'Style – ' + data.style + '\n';

            if (data.comments) orderCheckTemplate = orderCheckTemplate + 'Comments – ' + data.comments + '\n';

            orderCheckTemplate = orderCheckTemplate + '\tThe request is to be processed immediately in Deluxe\n' +
                'For any questions please contact the sender.\n' +
                '\nIMPORTANT/CONFIDENTIAL: This transmission is intended only for the use of the addressee(s) shown.It contains information that may be privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient of this transmission, you are hereby notified that the copying, use, or distribution of any information or materials transmitted herewith is strictly prohibited. If you have received this transmission by mistake, please contact sender immediately.';

            var messageId = this.utils.getToken();

            var routed = {
                institutionId: this.config.instId,
                sendFrom: 'user',
                sendTo: 'admin',
                userId: data.userId,
                senderName: data.userSelectedName,
                receiverName: this.config.mailerSetting.fromName,
                messageId: messageId,
                message: orderCheckTemplate,
                messageType: subject,
                subject: subject,
                isAttachment: false,
                isUserMessageDeleted: true,
                attachments: [],
                reply: []
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.Save();
        },
        addChangePersonalInfo: function (data) {

            var subject = 'Update Personal Info';

            /*'From: \n'+
             'Date: '+ moment(data.createdOn).format("dddd, MMMM D, YYYY") +'\n'+
             'Subject: '+ subject +'\n'+
             'To: DoNotReply@pointbank.com\n'+*/

            var newDated = new Date();
            var updateTemplate = 'Update personal info request details are given below.\n' +
                'Request Date & Time – ' + moment(newDated).format("dddd, MMMM D, YYYY h:mm:ss A") + '\n' +
                'Update personal Info Details\n';

            if (data.AddressLine1 != '') updateTemplate = updateTemplate + 'Address Line 1 – ' + data.AddressLine1 + '\n';
            if (data.AddressLine2 != '') updateTemplate = updateTemplate + 'Address Line 2 – ' + data.AddressLine2 + '\n';
            if (data.city != '') updateTemplate = updateTemplate + 'City – ' + data.city + '\n';
            if (data.state != '') updateTemplate = updateTemplate + 'State – ' + data.state + '\n';
            if (data.zip != '') updateTemplate = updateTemplate + 'Zip Code – ' + data.zip + '\n';
            if (data.country != '') updateTemplate = updateTemplate + 'Country – ' + data.country + '\n';
            if (data.homePhone != '') updateTemplate = updateTemplate + 'Home Phone – ' + data.homePhone + '\n';
            if (data.workPhone != '') updateTemplate = updateTemplate + 'Work Phone – ' + data.workPhone + '\n';
            if (data.cellPhone != '') updateTemplate = updateTemplate + 'Cell Phone – ' + data.cellPhone + '\n';
            if (data.emailId != '') updateTemplate = updateTemplate + 'E-Mail ID – ' + data.emailId + '\n';

            updateTemplate = updateTemplate + '\tThe request is to be processed immediately.\n' +
                'For any questions please contact the sender.\n' +
                '\nIMPORTANT/CONFIDENTIAL: This transmission is intended only for the use of the addressee(s) shown.It contains information that may be privileged, confidential and/or exempt from disclosure under applicable law. If you are not the intended recipient of this transmission, you are hereby notified that the copying, use, or distribution of any information or materials transmitted herewith is strictly prohibited. If you have received this transmission by mistake, please contact sender immediately.';

            var messageId = this.utils.getToken();

            var routed = {
                institutionId: this.config.instId,
                sendFrom: 'user',
                sendTo: 'admin',
                userId: data.userId,
                senderName: data.userSelectedName,
                receiverName: this.config.mailerSetting.fromName,
                messageId: messageId,
                message: updateTemplate,
                messageType: 'Change Personal Information',
                subject: subject,
                isAttachment: false,
                isUserMessageDeleted: true,
                attachments: [],
                reply: []
            };
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.Save();
        }
    };

    var TrashMethods = function (config, tnxId, done) {
        this.config = config;
        this.tnxId = tnxId;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.done = done;
    };

    TrashMethods.prototype = {
        updateAdminTrash: function (err, result) {
            if (result) {
                /*var routed = {
                 mailBelongsTo: 'admin',
                 userId: result.userId,
                 senderName: result.senderName,
                 messageId: result.messageId,
                 message: result.message,
                 subject: result.subject,
                 isUserRead: result.isUserRead,
                 isAdminRead: result.isAdminRead,
                 isReply: result.isReply,
                 isAdminReply: result.isAdminReply,
                 isUserReply: result.isUserReply,
                 isAttachment: result.isAttachment,
                 attachments: result.attachments,
                 reply: result.reply
                 };
                 var mongo = this.utils.initMongo(this.trashModel, routed, this.tnxId);
                 mongo.Save();*/

                /*var rmObj = {messageId: result.messageId};
                 var mongoRm = this.utils.initMongo(this.model, rmObj, this.tnxId);
                 mongoRm.Remove();*/

                result.isAdminMessageTrash = true;
                result.save();
            }

            if (this.done) this.done();
        },
        deleteAdminTrash: function (err, result) {
            if (result) {
                result.isAdminMessageDeleted = true;
                result.save();
            }
            if (this.done) this.done();
        },
        updateUserTrash: function (err, result) {
            if (result) {
                result.isUserMessageTrash = true;
                result.save();
            }

            if (this.done) this.done();
        },
        deleteUserTrash: function (err, result) {
            if (result) {
                result.isUserMessageDeleted = true;
                result.save();
            }
            if (this.done) this.done();
        }
    };

    module.exports = function (config, tnxId) {
        return (new BankMail(config, tnxId));
    };
})();