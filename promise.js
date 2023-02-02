const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

export default class Promise {
  constructor(exec) {
    this.status = PENDING;
    this.res = undefined;
    this.err = undefined;

    this.onReslovedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (res) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.res = res;

        this.onReslovedCallbacks.forEach((fn) => fn(this.res));
      }
    };
    const reject = (err) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.err = err;

        this.onRejectedCallbacks.forEach((fn) => fn(this.err));
      }
    };

    try {
      exec(resolve, reject);
    } catch (err) {
      console.log(err);
    }
  }

  then(onFulfilled, onRejected) {
    switch (this.status) {
      case FULFILLED:
        onFulfilled(this.res);
        break;
      case REJECTED:
        onRejected(this.err);
        break;
      case PENDING:
        // 注册、订阅
        this.onReslovedCallbacks.push(() => {
          // TODO 可扩展
          onFulfilled;
        });
        this.onRejectedCallbacks.push(() => {
          onRejected;
        });
        break;
    }
  }
}
