'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// class Promise {
//     constructor (){
//       this.callbacks = []
//       this.oncatch = null
//     }

//     reject(result){
//       this.complete('reject', result)
//     }

//     resolve(result){
//       this.complete('resolve', result)
//     }

//     complete(type, result){
//       if(type==='reject' && this.oncatch){
//         this.callbacks = []
//         this.oncatch(result)
//       }else if(this.callbacks[0]) { 
//         var handlerObj = this.callbacks.shift()
//         if(handlerObj[type]){
//           handlerObj[type](result)
//         }
//       }
//     }

//     then(onsuccess, onfail){
//       this.callbacks.push({
//         resolve: onsuccess,
//         reject: onfail
//       })
//       return this
//     }

//     catch(onfail){
//       this.oncatch = onfail
//       return this
//     }
//   }
var State = {
  pending: '0',
  resolved: '1',
  rejected: '2'
};

var Promise = function () {
  function Promise(executor) {
    var _this = this;

    _classCallCheck(this, Promise);

    this.state = State.pending;
    this.value = undefined;
    this.callbacks = [];
    if (typeof executor === 'function') {
      var resolve = function resolve(value) {
        _this.transition(State.resolved, value);
      };
      var reject = function reject(value) {
        _this.transition(State.rejected, value);
      };
      executor(resolve, reject);
    }
  }

  _createClass(Promise, [{
    key: 'transition',
    value: function transition(state, value) {
      if (this.state === State.pending) {
        this.state = state;
        this.value = value;
        this.callbacks.forEach(function (callback) {
          return callback();
        });
      }
    }
  }, {
    key: 'then',
    value: function then(onResolved, onRejected) {
      var _this2 = this;

      var self = this;
      var promise2 = new Promise(function (resolve, reject) {
        var scheduleFn = function scheduleFn() {
          setTimeout(function () {
            onResolved = typeof onResolved === 'function' ? onResolved : function (v) {
              return v;
            };
            onRejected = typeof onRejected === 'function' ? onRejected : function (v) {
              throw v;
            };
            try {
              if (self.state === State.resolved) {
                resolve(onResolved(self.value));
              } else {
                resolve(onRejected(self.value));
              }
            } catch (e) {
              reject(e);
            }
          });
        };
        if (_this2.state === State.pending) {
          _this2.callbacks.push(scheduleFn);
        } else {
          scheduleFn();
        }
      });
      return promise2;
    }
  }]);

  return Promise;
}();

exports.Promise = Promise;