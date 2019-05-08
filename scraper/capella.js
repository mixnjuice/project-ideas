const http = require('https');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

[
  'https://www.capellaflavors.com/13ml?product_list_limit=all',
  'https://www.capellaflavors.com/silverline?product_list_limit=all',
].map(function (url) {
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
      // This is what we're looking for:
      // <strong class="product name product-item-name">
      //   <a class="product-item-link"
      //      href="https://www.capellaflavors.com/apple-pie-v2-flavor-concentrate-13ml.html">
      //                                Apple Pie v2  13ml                            </a>
      // </strong>
      const dom = new JSDOM(rawHTML);
      var elements = dom.window.document.querySelectorAll(".product-item-link");
      elements.forEach(function (element) {
        var value = element.textContent.trim();
        if (value == "") {
          return;
        }
        // As we query the 13ml products, they are postfixed with 13ml.
        // Detect and remove the postifx.
        if (value.slice(-2) == "ml") {
          value = value.split(' ').slice(0, -1).join(' ').trim();
        }
        // fix "Blueberry Extra  Flavor" → "Blueberry Extra"
        value = value.split(/  /)[0];
        console.log(value);
      });
    });
  }).on('error', (e) => {
    console.error('Got error: ' + e.message);
  });
});
