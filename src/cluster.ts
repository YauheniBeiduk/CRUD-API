import cluster from 'cluster';
import { cpus } from 'os';
import process from 'process';

const port = process.env.PORT;

const workers: any = [];

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);
    const numCPUs = cpus().length;

    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork({ PORT: 4000 + i + 1 });
        workers.push(worker);
    }


        cluster.on("message", (worker, message) => {
            console.log(message);
            worker.send(message);
        })
    } else {
    console.log(port);
}