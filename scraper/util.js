const http = require('https');

// get the url and call the callback function with the rawHTML as parameter
var util = {
  httpGet: function (url, callback) {
    http.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
      let error;
      if (statusCode !== 200) {
        error = new Error('Request failed. StatusCode: ' + statusCode);
      } else if (!/^text\/html/.test(contentType)) {
        error = new Error('Unexpected content-type: ' + contentType);
      }
      if (error) {
        console.error(error.message);
        res.resume();
        return;
      }
      res.setEncoding('utf8');
      let rawHTML = '';
      res.on('data', (chunk) => { rawHTML += chunk; });
      res.on('end', () => {
        callback(rawHTML);
      });
    }).on('error', (e) => {
      console.error('Got error: ' + e.message);
    });
  }
};
module.exports = util;