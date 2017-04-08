(function(){

    var fs = require('fs');

    var path = require('path');

    var utils = require('../lib/utils/utils');

    var errorResponse = require('../gen/errorResponse');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var siteSelectedImagesModel = require('../lib/models/dbModel').SiteSelectedImages;

    var bankConfig = require('./bankConfigMethods')

    var scp2 = require('scp2')

    var mkdirp = require("mkdirp")

    function SiteCustomisation(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.utils = utils.util();
        this.model = mongoModelName.modelName.SiteImages;
    }

    SiteCustomisation.prototype = {
        applySiteChanges: function(reqBody , callback){
            this.callback = callback;
            /*Images Creation After Apply Changes*/
            if(reqBody.bigImage) this.createSiteImages(reqBody.bigImage, 'big_image.png');
            if(reqBody.smallImage) this.createSiteImages(reqBody.smallImage, 'small_image.png');
            if(reqBody.headerImage) this.createSiteImages(reqBody.headerImage, 'header_logo.png');
            //if(reqBody.footerImage) this.createSiteImages(reqBody.footerImage, 'footer_logo.png');
            if(reqBody.infoImageOne) this.createSiteImages(reqBody.infoImageOne, 'info_one.png');
            if(reqBody.infoImageTwo) this.createSiteImages(reqBody.infoImageTwo, 'info_two.png');
            if(reqBody.infoImageThree) this.createSiteImages(reqBody.infoImageThree, 'info_three.png');
            if(reqBody.insideHeaderImage) this.createSiteImages(reqBody.insideHeaderImage, 'inside_header_logo.png');
            if(reqBody.insideSidebarImage) this.createSiteImages(reqBody.insideSidebarImage, 'inside_sidebar_image.png');

            /*Site Text Creation After Apply Changes*/
            if(reqBody.headerText) this.createSiteText(reqBody.headerText, 'header_text.html');
            if(reqBody.footerText) this.createSiteText(reqBody.footerText, 'footer_text.html');

            /*Link Creation After Apply Changes*/
            if(reqBody.headerLinkOne) this.createSiteLink(reqBody.headerLinkOne, 'header_link_one.html');
            if(reqBody.headerLinkTwo) this.createSiteLink(reqBody.headerLinkTwo, 'header_link_two.html');
            if(reqBody.headerLinkThree) this.createSiteLink(reqBody.headerLinkThree, 'header_link_three.html');
            if(reqBody.footerLinkOne) this.createSiteLink(reqBody.footerLinkOne, 'footer_link_one.html');
            if(reqBody.footerLinkTwo) this.createSiteLink(reqBody.footerLinkTwo, 'footer_link_two.html');
            if(reqBody.footerLinkThree) this.createSiteLink(reqBody.footerLinkThree, 'footer_link_three.html');
            if(reqBody.footerLinkFour) this.createSiteLink(reqBody.footerLinkFour, 'footer_link_four.html');
            if(reqBody.insideHeaderLinkOne) this.createSiteLink(reqBody.insideHeaderLinkOne, 'inside_header_link_one.html');
            if(reqBody.insideHeaderLinkTwo) this.createSiteLink(reqBody.insideHeaderLinkTwo, 'inside_header_link_two.html');
            if(reqBody.insideHeaderLinkThree) this.createSiteLink(reqBody.insideHeaderLinkThree, 'inside_header_link_three.html');

            /*Description Creation After Apply Changes*/
            if(reqBody.infoDescriptionOne) this.createSiteDescription(reqBody.infoDescriptionOne, 'info_one_description.html');
            if(reqBody.infoDescriptionTwo) this.createSiteDescription(reqBody.infoDescriptionTwo, 'info_two_description.html');
            if(reqBody.infoDescriptionThree) this.createSiteDescription(reqBody.infoDescriptionThree, 'info_three_description.html');

            this.msg = 'Site has been updated';
            var bankDetails = bankConfig(this.config,this.tnxId);
            var resHandle = this.getBankConfigReturn.bind(this);
            bankDetails.getBankConfig(resHandle);
        },
        getBankConfigReturn:function (err,result) {
            result.siteCustomisedOn = new Date();
            result.save();
            var that = this;
            var afterSomeTime = setInterval(function(){
                clearInterval(afterSomeTime);
                that.callback(null , {message: that.msg});
            }, 10000);
        },
        applySiteOverviewChanges: function(reqBody , callback){
            this.callback = callback;

            /*Images Creation After Apply Changes*/
            if(reqBody.bigImage) this.createSiteImages(reqBody.bigImage, 'branding-img.png');
            if(reqBody.sideImage) this.createSiteImages(reqBody.sideImage, 'side-image.png');

            this.msg = 'Site Overview has been updated';
            var bankDetails = bankConfig(this.config,this.tnxId);
            var resHandle = this.getBankConfigReturn.bind(this);
            bankDetails.getBankConfig(resHandle);
        },
        uploadFiles: function(reqBody , callback){
            this.callback = callback;
            var routed = {
                institutionId           : this.config.instId,
                imageId                 : this.utils.getToken(),
                moduleType              : reqBody.moduleType,
                base64String            : reqBody.base64String,
                fileName                : reqBody.fileName,
                fileSize                : reqBody.fileSize,
                fileDimension           : reqBody.fileDimension,
                fileType                : reqBody.fileType
            };

            var resHandle = this.uploadComplete.bind(this);
            var mongo = this.utils.initMongo(this.model, routed, this.tnxId);
            mongo.Save(resHandle);
        },
        uploadComplete: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.callback(null , {message: "File Successfully Uploaded"});
            }
        },
        listUploadedFiles: function(reqBody , callback){
            this.callback = callback;

            this.routed = {
                institutionId           : this.config.instId,
                moduleType              : reqBody.moduleType
            };

            var mongo = this.utils.initMongo(this.model ,this.routed , this.tnxId);
            var resHandle = this.uploadedImageFiles.bind(this);
            mongo.FindMethod(resHandle);
        },
        deleteUploadedFile: function(reqBody , callback){
            this.callback = callback;

            var routed = {
                institutionId       : this.config.instId,
                imageId             : reqBody.imageId
            };

            var mongo = this.utils.initMongo(this.model ,routed , this.tnxId);
            var resHandle = this.deleteComplete.bind(this);
            mongo.Remove(resHandle);
        },
        deleteComplete: function(done){
            this.callback(null , {message : 'Image has been deleted successfully'});
        },
        uploadedImageFiles: function(err , result){
            if(err){
                var error = this.errorResponse.OperationFailed;
                this.callback(error , null);
            }else{
                this.imageFiles = {
                    imageList : result,
                    selectedImageId : ''
                };

                var selector = new SiteSelectedCustomisation({} , this.config , this.tnxId);
                var selectorImage = selector.getSelectedImage.bind(selector);
                var resHandle = this.returnImageFiles.bind(this);
                selectorImage(this.routed, resHandle);
            }
        },
        returnImageFiles: function(err , result){
            if(result) this.imageFiles.selectedImageId = result.imageId;
            this.callback(null , this.imageFiles);
        },
        createSiteImages: function(data, fileName){
            var that = this;
            var location = '/imgs/branding/'+this.config.setLang+'/'+fileName;
            var filePath = path.resolve('./public'+location);
            var getDirName = require("path").dirname
            mkdirp(getDirName(filePath), function (err) {
                if (err) return cb(err)
                else {
                    fs.writeFile(filePath, data.base64String, 'base64', function (err) {
                        if (err) {
                            that.utils.log(that.tnxId, 'fileWrite failed: ' + err, 'console.log');
                        } else {
                            scp2.scp(filePath, {
                                host: that.config.omniWebServer.host,
                                username: that.config.omniWebServer.username,
                                password: that.config.omniWebServer.password,
                                path: that.config.omniWebServer.path + location
                            }, function (err) {
                                if (err)
                                    that.utils.log(that.tnxId, 'file transfer failed: ' + err, 'console.log');
                                else
                                    console.info("File Transferre at location : "+that.config.omniWebServer.username+"@"+that.config.omniWebServer.host+":"+that.config.omniWebServer.path + location)
                            })
                        }
                    });
                }
            });

            var selection = new SiteSelectedCustomisation(data, this.config , this.tnxId);
            selection.imageFileSelector();

            return true;
        },
        createSiteLink: function(data, fileName){
            var that = this;
            var html = '<a href="' + data.url + '" target="_blank">' + data.name + '</a>';
            var location = '/tpl/branding/'+this.config.setLang+'/'+fileName;
            var filePath = path.resolve('./public'+location);
            var getDirName = require("path").dirname
            mkdirp(getDirName(filePath), function (err) {
                if (err) return cb(err)
                else {
                    fs.writeFile(filePath, html, function (err) {
                        if (err) {
                            that.utils.log(that.tnxId, 'fileWrite failed: ' + err, 'console.log');
                        } else {
                            scp2.scp(filePath, {
                                host: that.config.omniWebServer.host,
                                username: that.config.omniWebServer.username,
                                password: that.config.omniWebServer.password,
                                path: that.config.omniWebServer.path + location
                            }, function (err) {
                                if (err)
                                    that.utils.log(that.tnxId, 'file transfer failed: ' + err, 'console.log');
                                else
                                    console.info("File Transferre at location : "+that.config.omniWebServer.username+"@"+that.config.omniWebServer.host+":"+that.config.omniWebServer.path + location)
                            })
                        }
                    });
                    return true;
                }
            });
        },
        createSiteDescription: function(data, fileName) {
            var that = this;
            var html = '<p>' + data.description + '</p>';
            var location = '/tpl/branding/' + this.config.setLang + '/' + fileName;
            var filePath = path.resolve('./public' + location);
            var getDirName = require("path").dirname
            mkdirp(getDirName(filePath), function (err) {
                if (err) return cb(err)
                else {
                    fs.writeFile(filePath, html, function (err) {
                        if (err) {
                            that.utils.log(that.tnxId, 'fileWrite failed: ' + err, 'console.log');
                        } else {
                            scp2.scp(filePath, {
                                host: that.config.omniWebServer.host,
                                username: that.config.omniWebServer.username,
                                password: that.config.omniWebServer.password,
                                path: that.config.omniWebServer.path + location
                            }, function (err) {
                                if (err)
                                    that.utils.log(that.tnxId, 'file transfer failed: ' + err, 'console.log');
                                else
                                    console.info("File Transferre at location : "+that.config.omniWebServer.username+"@"+that.config.omniWebServer.host+":"+that.config.omniWebServer.path + location)
                            })
                        }
                    });
                    return true;
                }
            });
        },
        createSiteText: function(data, fileName) {
            var that = this;
            var html = '' + data.description + '';
            var location = '/tpl/branding/' + this.config.setLang + '/' + fileName;
            var filePath = path.resolve('./public' + location);
            var getDirName = require("path").dirname
            mkdirp(getDirName(filePath), function (err) {
                if (err) return cb(err)
                else {
                    fs.writeFile(filePath, html, function (err) {
                        if (err) {
                            that.utils.log(that.tnxId, 'fileWrite failed: ' + err, 'console.log');
                        } else {
                            scp2.scp(filePath, {
                                host: that.config.omniWebServer.host,
                                username: that.config.omniWebServer.username,
                                password: that.config.omniWebServer.password,
                                path: that.config.omniWebServer.path + location
                            }, function (err) {
                                if (err)
                                    that.utils.log(that.tnxId, 'file transfer failed: ' + err, 'console.log');
                                else
                                    console.info("File Transferre at location : "+that.config.omniWebServer.username+"@"+that.config.omniWebServer.host+":"+that.config.omniWebServer.path + location)
                            })
                        }
                    });
                    return true;
                }
            });
        }
    };

    function SiteSelectedCustomisation(imgRecord, config , tnxId){
        this.imgRecord = imgRecord;
        this.tnxId = tnxId;
        this.config = config;
        this.utils = utils.util();
    }

    SiteSelectedCustomisation.prototype = {
        imageFileSelector: function(){
            var that = this;
            var routedSSC = { institutionId : this.config.instId, moduleType : this.imgRecord.moduleType};
            siteSelectedImagesModel.findOne(routedSSC , function(err , record){
                if(!record){
                    routedSSC.imageId = that.imgRecord.imageId;
                    var sscObj = new siteSelectedImagesModel(routedSSC);
                    sscObj.save(function (err, doc) {
                        that.utils.log(that.tnxId , 'SiteCustomisationSaved' , 'afterSave');
                    });
                }else{
                    record.imageId = that.imgRecord.imageId;
                    record.save();
                }
            });
        },
        getSelectedImage: function(routed, callback) {
            siteSelectedImagesModel.findOne(routed, callback);
        }
    };

    module.exports = function(config , tnxId){
        return (new SiteCustomisation(config , tnxId));
    };
})();