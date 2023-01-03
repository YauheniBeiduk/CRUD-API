import cluster from 'node:cluster';
import { cpus } from 'node:os';
import process from 'node:process';


if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);
    const numCPUs = cpus().length;

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({PORT: 4000 + i});


        cluster.on("message", (worker, message) => {
            console.log(message);
            worker.send(message);
        })
    }
} else {
    console.log(process.env.PORT)
}
