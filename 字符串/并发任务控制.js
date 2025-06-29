// 如题 ./../并发任务控制.png
function timeout(time) {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, time)
  })
}

let time = null;
let time1 = null;
class SubTask {
  constructor() {
    this.queue = [];
    this.requestCount = 0;
    this.maxCount = 2;
  }

  add(cb) {
    return new Promise((res, rej) => {
      this.queue.push({
        task: cb,
        res,
        rej
      });
      time = time1 = Date.now();
      this.run();
    })
  }

  run() {
    while(this.queue.length && this.requestCount < this.maxCount) {
      const {task, res, rej } = this.queue.shift();
      this.requestCount = this.requestCount + 1 ;
      task().then(() => {
        const newTime = Date.now();
        console.log(newTime - time);
        time = newTime;
        res();
      }).catch(rej).finally(() => {
        this.requestCount = this.requestCount - 1 ;
        this.run();
      });
    }
  }

}

const subTask = new SubTask();

function addTask(time, name) {
  subTask.add(() => timeout(time)).then(() => {
    console.log(`task ${name} finished`, Date.now() - time1);
  })
}

addTask(10000,1);
addTask(5000,2);
addTask(3000,3);
addTask(4000,4);
addTask(5000,5);