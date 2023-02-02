// 1.特点:promise有三个状态 pending态 fulfilled成功态 rejected失败态
// 2.每个promise都有一个then方法，成功和失败的回调
// 3.resolve, reject是两个函数，可以改变状态
// 4.excutor是立刻执行的
// 5.一旦状态发生变化就不能再修改

import MyPromise from "./promise.js";

const promise = new MyPromise((resolve, reject) => {
  // resolve, reject交给用户使用，改变状态
  setTimeout(() => {
    resolve("success");
    reject("reject");
  }, 1000);
});

promise.then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err);
  }
);