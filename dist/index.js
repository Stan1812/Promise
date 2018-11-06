'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = function () {
  function Promise() {
    _classCallCheck(this, Promise);

    this.callbacks = [];
  }

  _createClass(Promise, [{
    key: 'reject',
    value: function reject(res) {
      this.complete('reject', res);
    }
  }, {
    key: 'resolve',
    value: function resolve(res) {
      this.complete('resolve', res);
    }
  }, {
    key: 'complete',
    value: function complete(type, res) {
      if (type === 'reject' && this.oncatch) {
        this.callbacks = [];
        this.oncatch(res);
      } else if (this.callbacks[0]) {
        var handlerObj = this.callbacks.shift();
        if (handlerObj[type]) {
          handlerObj[type](res);
        }
      }
    }
  }, {
    key: 'then',
    value: function then(onSuccess, onFail) {
      this.callbacks.push({ resolve: onSuccess, reject: onFail });
      return this;
    }
  }, {
    key: 'catch',
    value: function _catch(onfail) {
      this.oncatch = onFail;
      return this;
    }
  }]);

  return Promise;
}();