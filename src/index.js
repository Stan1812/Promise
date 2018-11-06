class Promise {
  constructor() {
    this.callbacks = [];
  }
  reject(res) {
    this.complete('reject', res);
  }
  resolve(res) {
    this.complete('resolve', res);
  }
  complete(type, res) {
    if (type === 'reject' && this.oncatch) {
      this.callbacks = [];
      this.oncatch(res);
    } else if (this.callbacks[0]) {
      let handlerObj = this.callbacks.shift();
      if (handlerObj[type]) {
        handlerObj[type](res);
      }
    }
  }
  then(onSuccess, onFail) {
    this.callbacks.push({ resolve: onSuccess, reject: onFail });
    return this;
  }
  catch(onfail) {
    this.oncatch = onFail;
    return this;
  }
}
