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
const State = {
  pending: '0',
  resolved: '1',
  rejected: '2',
};
class Promise {
  constructor(executor) {
    this.state = State.pending;
    this.value = undefined;
    this.callbacks = [];
    if (typeof executor === 'function') {
      let resolve = value => {
        this.transition(State.resolved, value);
      };
      let reject = value => {
        this.transition(State.rejected, value);
      };
      executor(resolve, reject);
    }
  }
  transition(state, value) {
    if (this.state === State.pending) {
      this.state = state;
      this.value = value;
      this.callbacks.forEach(callback => callback());
    }
  }
  then(onResolved, onRejected) {
    const self = this;
    let promise2 = new Promise((resolve, reject) => {
      let scheduleFn = () => {
        setTimeout(() => {
          onResolved = typeof onResolved === 'function' ? onResolved : v => v;
          onRejected =
            typeof onRejected === 'function'
              ? onRejected
              : v => {
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
      if (this.state === State.pending) {
        this.callbacks.push(scheduleFn);
      } else {
        scheduleFn();
      }
    });
    return promise2;
  }
}
export { Promise };
