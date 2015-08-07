/**
 * Lazuli for LAPIS
 * JS version
 */
var Lazuli = (function () {
  var Lazuli,
  lazQuery,
  lazQ;

  /***
  LU promise
  ***/

  var lp;

  var Promise = function () {
    this.okCallbacks = [];
    this.koCallbacks = [];
  };

  Promise.prototype = {
    okCallbacks: null,
    koCallbacks: null,
    status: 'pending',
    error: null,

    then: function (okCallback, koCallback) {
      var defer = new lp();

      // Add callbacks to the arrays with the defer binded to these callbacks
      this.okCallbacks.push({
        func: okCallback,
        defer: defer
      });

      if (koCallback) {
        this.koCallbacks.push({
          func: koCallback,
          defer: defer
        });
      }

      // Check if the promise is not pending. If not call the callback
      if (this.status === 'resolved') {
        this.executeCallback({
          func: okCallback,
          defer: defer
        }, this.data);
      } else if(this.status === 'rejected') {
        this.executeCallback({
          func: koCallback,
          defer: defer
        }, this.error);
      }

      return defer.promise;
    },

    executeCallback: function (callbackData, result) {
      setTimeout(function () {
        var res = callbackData.func(result);
        if (res instanceof Promise) {
          callbackData.defer.bind(res);
        } else {
          callbackData.defer.resolve(res);
        }
      }, 0);
    }
  };

  lp = function () {
    this.promise = new Promise();
    this.tag = "Lu Promise";
  };

  lp.prototype = {
    promise: null,
    resolve: function (data) {
      var promise = this.promise;
      promise.data = data;
      promise.status = 'resolved';
      promise.okCallbacks.forEach(function(callbackData) {
        promise.executeCallback(callbackData, data);
      });
    },

    reject: function (error) {
      var promise = this.promise;
      promise.error = error;
      promise.status = 'rejected';
      promise.koCallbacks.forEach(function(callbackData) {
        promise.executeCallback(callbackData, error);
      });
    },

    bind: function (promise) {
      var that = this;
      promise.then(function (res) {
        that.resolve(res);
      }, function (err) {
        that.reject(err);
      });
    }
  };

  /***
    END LU Promise
  */

  Lazuli = function (options) {
    this.promise = lp;
    this.query = function (table) {
      return new lazQ(options, table);
    };
  };

  lazQ = function (options, table) {
    var _this = this;

    if (options) {
      for (var k in options) {
        this[k] = options[k];
      }
    }
    this.table = table;
    this.findWhere = "";
    this.strict = "STRICT=";
    this.domainPath =(_this.ssl ? "https://" : "http://") + _this.url;

    this.where = function (searchCriteria) {
      for (var k in searchCriteria) {
        if (searchCriteria.hasOwnProperty(k) && k !== "id") {
          if (searchCriteria[k].equals) {
            _this.findWhere += k + "=" + searchCriteria[k].equals + "&";
            _this.strict += k + ",";
          } else if (searchCriteria[k].contains) {
            _this.findWhere += k + "=" + searchCriteria[k].contains + "&";
          }
        }
      }
      return _this;
    };

    this.find = function () {
      // run the query on the table and return the result
      var defer = new lp(),
        xmlHttp = new XMLHttpRequest();

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          if (xmlHttp.status == 200) {
            console.log("success");
            console.log(xmlHttp.status);
            defer.resolve(xmlHttp.responseText);
          } else if (xmlHttp.status == 301) {
            // sit and wait for redirect bounce
          } else {
            console.log("fail");
            console.log(xmlHttp.status);
            if (xmlHttp.responseText) {
              defer.reject(xmlHttp.responseText);
            } else {
              defer.reject(xmlHttp.statusText);
            }
          }
        }

      };

      xmlHttp.open("GET", _this.domainPath /*+ "/" + _this.table*/ + "/GET/?" + _this.findWhere + "&" + _this.strict /*+ "&CONTENT_TYPE=" + _this.table*/, true);
      xmlHttp.send(null);

      return defer.promise;
    };

    this.limit = function(val) {
        _this.findWhere += "LIMIT=" + val + "&";
        return _this;
    };

    this.arrange = function (by, order) {
      _this.findWhere += "ORDER_BY="+ by +"&ORDER=" + order.toUpperCase() + "&";
      return _this;
    };
    this.byId = function (id) {
      // run the query on the table and return the result
      var defer = new lp(),
        xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
          if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
              console.log("success");
              console.log(xmlHttp.status);
              defer.resolve(xmlHttp.responseText);
            } else if (xmlHttp.status == 301) {
              // sit and wait for redirect bounce
            } else {
              console.log("fail");
              console.log(xmlHttp.status);
              if (xmlHttp.responseText) {
                defer.reject(xmlHttp.responseText);
              } else {
                defer.reject(xmlHttp.statusText);
              }
            }
          }
        };

      xmlHttp.open("GET", _this.domainPath + "/GET/?id=" + id /*+ "&CONTENT_TYPE=" + _this.table*/, true);
      xmlHttp.send(null);

      return defer.promise;
    };
  };

  Lazuli.prototype.Object = function (table) {
    var _this = this;
    this.attr = {};
    this.type = table;

    this.write = function (values) {
      var xmlhttp,
        request = "";

      for (var k in values) {
        request += k + "=" + values[k] + "&";
        _this.attr[k] = values[k];
      }

      if (window.XMLHttpRequest){
        xmlhttp=new XMLHttpRequest();
      } else {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }

      // Making the request
      xmlhttp=new XMLHttpRequest();
      xmlhttp.open("POST","https://lapis.tomi33.co.uk/POST/",true);
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xmlhttp.send(request);

      return _this;
    };

    this.read = function (value) {
      if (_this.attr[value]) return _this.attr[value];
      else return undefined;
    };
  };

  return Lazuli;
})();

if (typeof module !== "undefined") module.exports = Lazuli;
