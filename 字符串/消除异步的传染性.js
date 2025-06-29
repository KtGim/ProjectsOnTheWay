// 消除以下代码的 promise 传染性
// async function getUser() {
//   return await fetch('../static/asyncTest.json');
// }
// async function m1() {
//   const user = await getUser();
//   return user;
// }
// async function m2() {
//   const user = await m2();
//   return user;
// }
// async function m3() {
//   const user = await m2();
//   return user;
// }
// async function main() {
//   const user = await m3();
//   console.log(user);
// }

/**
 * react Suspense 组件的方法
 * 
 */



let cache = {
  url: null
};

function getUser(name) {
    console.log(cache, 'ggg');
  if(!cache[name]) {
    // 模拟发送请求
    throw new Promise(res => {
      setTimeout(() => {
          cache[name] = 'ccckkk'
        res({name: 'ppp'});
      }, 3000);
    })
  }
  console.log(cache, '0po');
  return cache[name]
}

function m1() {
    console.log('1po')
  const user = getUser('test.name');
    console.log(user, 'user')
  return user;
}

function m2() {
    console.log('3po')
  const user = m1();
  return user;
}
function m3() {
    console.log('2po')
  const user = m2();
  return user;
}

function main() {
    console.log('popopo')
  const user = m3();
  console.log(user);
}

function run() {
  try {
    main();
  } catch(err) {
      console.log(err, cache);
    if(err instanceof Promise) {
      err.finally(() => {
          console.log(111);
        main();
      })
    }
  }
}
run();