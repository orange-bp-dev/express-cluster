const express = require("express");
const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master Process Id is - ${process.pid}`);
  const worker1 = require('child_process').fork('./workers/fab-series-worker1')
  const worker2 = require('child_process').fork('./workers/fab-series-worker2')
  console.log(`Child1 Process ID is ${worker1.pid}`)
  console.log(`Child2 Process ID is ${worker2.pid}`)

  worker1.on('message', (number) => {
   console.log(`Fab Number from Child Process - 1 is ${number}`)
  })

  worker2.on('message', (number) => {
   console.log(`Fab Number from Child Process - 2 is ${number}`)
  })

  for (var i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("online", worker => {
    console.log(`worker Id ${worker.id} and PID is ${worker.process.pid}`);
    worker.on('message', num => {
      if (num % 2 === 0) {
        worker1.send(num)
      } else {
        worker2.send(num)
      }
    })
  })

  for (let i = 0; i < totalCPUs - 2; i++){
    let worker = cluster.fork();
    console.log(`worker started on PID - ${worker.process.pid}`);
  }
  console.log(`total number of cpu count is ${totalCPUs}`);

  cluster.on("exit", worker => {
    console.log(`worker id ${worker.id} and PID is ${worker.process.pid} is offline`);
    console.log('lets fork new worker');
    cluster.fork();
})

} else {
  const app = express();
  
  app.get("/", (req, res) => {
    process.send(req.query.number);
    console.log(`Proces Id ${process.pid} received the request!!!!`);
    res.end(`<h3>Request is Succeed!!! Send Email later !!!</h3>`)
  })
  
  app.listen(3000, () => console.log('express app is running on port : 3000'))
  
}
