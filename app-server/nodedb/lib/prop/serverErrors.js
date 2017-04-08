(function () {
    module.exports = function () {
        return {
            404: '<!DOCTYPE HTML><html><head><title>404</title><link href="/css/style.css" rel="stylesheet" type="text/css"  media="all" /></head><body><div class="wrap"><div class="content">' +
                '<img src="/images/error-img.png" title="error" /><p><span><label>O</label>hh.....</span>You Requested the url that is no longer There.</p><div class="copy-right">' +
                '</div></div></div></body></html>'
        }
    }
})();