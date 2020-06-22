const cluster = require('cluster');
const os = require('os');
const express = require('express');

if(cluster.isMaster) {
    const numWorkers = os.cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    const app = express();

    app.all('/*', function (req, res) {
       res.send('process ' + process.pid + ' says hello!');
    });

    app.listen(3000, function () {
        console.log('Process ' + process.pid + ' is listening to all incoming request');
    });
}