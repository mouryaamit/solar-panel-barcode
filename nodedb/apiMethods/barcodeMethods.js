/**
 * Created by amitmourya on 08/03/17.
 */
(function(){

    var utils = require('../lib/utils/utils');

    var _ = require('underscore');

    var genPass = require('password.js');
    genPass.charsLowerCase = 'abcdefghjkmnpqrstuvwxyz';
    genPass.charsUpperCase = 'ABCDEFGHJKMNPQRSTUVWXYZ';

    var errorResponse = require('../gen/errorResponse');

    var successResponse = require('../gen/successResponseMessage');

    var mongoModelName = require('../lib/mongoQuery/mongoModelObj');

    var generateId = require('time-uuid/time');

    var gm = require('gm').subClass({ appPath: "/usr/local/bin/" });
    var bwipjs = require('bwip-js');

    function BarcodeMethod(config , tnxId){
        this.tnxId = tnxId;
        this.config = config;
        this.errorResponse = errorResponse.ErrorMessage(config);
        this.successResponse = successResponse(config);
        this.utils = utils.util();
    }

    BarcodeMethod.prototype = {
        genrateBarcode:function (reqBody,reqParam,reqQuery,callback) {
            console.log(reqBody)
            console.log(reqParam)
            console.log(reqQuery)
            bwipjs.toBuffer({
                // bcid:        'code128',       // Barcode type
                bcid:        'qrcode',       // Barcode type
                // bcid:        reqQuery.bcid,       // Barcode type
                text:        "reqQuery.text",    // Text to encode
                scale:       3,               // 3x scaling factor
                // height:      10,              // Bar height, in millimeters
                includetext: true,            // Show human-readable text
                textxalign:  'center',        // Always good to set this
                textfont:    'Inconsolata',   // Use your custom font
                textsize:    13,               // Font size, in points
                paddingwidth : 13,
                paddingheight : 13,
                monochrome:false
            }, function (err, png) {
                if (err) {
                    // Decide how to handle the error
                    // `err` may be a string or Error object
                } else {
                    callback(null,"data:image/png;base64,"+new Buffer(png).toString('base64'));
                    // `png` is a Buffer
                    // png.length           : PNG file length
                    // png.readUInt32BE(16) : PNG image width
                    // png.readUInt32BE(20) : PNG image height
                }
            });
        }
    };

    module.exports = function(config , tnxId){
        return (new BarcodeMethod(config , tnxId));
    };
})();