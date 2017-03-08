/**
 * Created by amitmourya on 08/03/17.
 */
// Simple HTTP server that renders barcode images using bwip-js.
var http   = require('http');
var bwipjs = require('bwip-js');

// Example of how to load a font into bwipjs.
//    bwipjs.loadFont(fontname, sizemult, fontdata)
//
// To unload a font (and free up space for another):
//    bwipjs.unloadFont(fontname)
//
// bwipjs.loadFont('Inconsolata', 108,
//     require('fs').readFileSync('fonts/Inconsolata.otf', 'binary'));

http.createServer(function(req, res) {
    // If the url does not begin /?bcid= then 404.  Otherwise, we end up
    // returning 400 on requests like favicon.ico.
    // console.log(req)
    if (req.url.indexOf('/?bcid=') != 0) {
        res.writeHead(404, { 'Content-Type':'text/plain' });
        res.end('BWIPJS: Unknown request format.', 'utf8');
    } else {
        bwipjs.toBuffer({
            bcid:        'code128',       // Barcode type
            text:        '0123456789',    // Text to encode
            scale:       3,               // 3x scaling factor
            height:      10,              // Bar height, in millimeters
            includetext: true,            // Show human-readable text
            textxalign:  'center',        // Always good to set this
            textfont:    'Inconsolata',   // Use your custom font
            textsize:    13               // Font size, in points
        }, function (err, png) {
            if (err) {
                // Decide how to handle the error
                // `err` may be a string or Error object
            } else {
                res.end(new Buffer(png).toString('base64'));
                // `png` is a Buffer
                // png.length           : PNG file length
                // png.readUInt32BE(16) : PNG image width
                // png.readUInt32BE(20) : PNG image height
            }
        });
        // bwipjs(req, res);
    }

}).listen(3030);

//http://localhost:3030/?bcid=qrcode&text=978-1-56581-231-4+52250&includetext&guardwhitespace