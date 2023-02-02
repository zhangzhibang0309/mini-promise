const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

function resolvePromise(promise2, x, resolve, reject) {}

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
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        process.nextTick(() => {
        try {
          let x = onFulfilled(this.res);
          // 假设第二层promise成功 那么就调用resolve
          // 但这里其实是有很多情况，所以封装成一个方法去判断
          // 用x的值来判断promise2是成功还是失败

          // 这里有个好奇怪的问题，你只要log promise2他就不会执行，十分诡异，promise2在这个时候还不存在，那也应该是undefined？？？
          // 但是promise2直接用的话会报错，所以要搞个异步任务，让他的执行滞后
          console.log(promise2, "====");

          resolvePromise(promise2, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
        });
      }
      if (this.status === REJECTED) {
        process.nextTick(() => {
          try {
            let x = onRejected(this.err);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      }
      if (this.status === PENDING) {
        // 注册、订阅
        this.onReslovedCallbacks.push((res) => {
          // TODO 可扩展 这就是切面编程
          process.nextTick(() => {
            try {
              let x = onFulfilled(res);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
        this.onRejectedCallbacks.push((err) => {
          process.nextTick(() => {
            try {
              let x = onRejected(err);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              console.log(err);
            }
          });
        });
      }
    });
    return promise2;
  }
}
