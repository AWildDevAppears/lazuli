/**
 * Lazuli for LAPIS
 * JS version
 */
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

Lazuli = function () {};

lazQ = function (table) {
  var _this = this;
  this.table = table;

  this.where = function (searchCriteria) {
    // TODO: make the search criteria readable by lapis
    _this.findWhere = searchCriteria;
    return _this;
  };
  this.find = function () {
    // run the query on the table and return the result
    var defer = new lp(),
      xmlHttp = new XMLHttpRequest();

    var requestItems = "technology=php";

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState==4 && xmlHttp.status==200) {
        defer.reject(xmlHttp.statusText);
      } else {
        defer.resolve(xmlHttp.responseText);
      }
    };

    xmlHttp.open("GET", "http://lapis.tomi33.co.uk?" + requestItems, true);
    xmlHttp.send(null);

    return defer.promise;
  };
  this.arrange = function (by) {
    _this.order = by;
    return _this;
  };
  this.byId = function (id) {
    // run the query on the table and return the result
    var defer = new lp(),
      xml;

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState==4 && xmlHttp.status==200) {
        defer.reject(xmlHttp.statusText);
      } else {
        defer.resolve(xmlHttp.responseText);
      }
    };

    xmlHttp.open("GET", "http://lapis.tomi33.co.uk?id=" + id, true);
    xmlHttp.send(null);

    return defer.promise;
  };
};

Lazuli.prototype.query = function (table) {
  return new lazQ(table);
};

Lazuli.prototype.Object = function (table) {
  var _this = this;
  this.attr = {};

  this.write = function (values) {
    // put this data onto the server
  };

  this.read = function (value) {
    if (_this.attr[value]) return _this.attr[value];
    else {} // query the server
  };
};



if (typeof module !== "undefined") module.exports = Lazuli;
