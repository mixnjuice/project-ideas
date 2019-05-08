const util = require('./util.js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const urlPrefix = 'https://shop.perfumersapprentice.com';
util.httpGet(urlPrefix + '/c-54-professional-flavors.aspx',
  function (rawHTML) {
    const dom = new JSDOM(rawHTML);
    var ul = dom.window.document.querySelector(".big-links");
    var elements = Array.prototype.slice.call(ul.getElementsByTagName("a"));

    elements.map(function (element) {
      console.error("fetching: " + urlPrefix + element.href);
      util.httpGet(urlPrefix + element.href, function (rawHTML) {
        const dom = new JSDOM(rawHTML);
        var ul = dom.window.document.querySelector(".product-listing");
        var elements = Array.prototype.slice.call(ul.getElementsByTagName("h2"));
        elements.map(function (element) {
          var value = element.innerHTML;
          // remove everything after and including Flavor
          value = value.split('Flavor')[0].trim();
          // FIXME: how to handle (PG) in the name?
          console.log(value);
        });
      });
    });
  });
