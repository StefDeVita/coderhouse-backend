const yargs = require('yargs/yargs')(process.argv.slice(2))
const cluster = require('cluster')
const {app} = require('./server')
const httpServer = require('http')
const cpus = require("os").cpus().length;

const argv = yargs.alias({
    p: 'port',
    m:'mode'
}).default({
    port:8080,
    mode:'fork'
}).argv
const PORT = argv.port
if(argv.mode === 'CLUSTER'){
    if(cluster.isMaster){
        console.log(`Master ${process.pid} esta corriendo`)
        for (let i = 0; i < cpus; i++) {
            cluster.fork();
            
        }
        cluster.on('exit',worker =>{
            console.log(`worker ${worker.process.pid} finalizo`)
            cluster.fork()
        })

    }
    else{
        const server = httpServer.Server(app).listen(PORT,() => {
            console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
        });
    }
}
else{
    const server = httpServer.Server(app).listen(PORT,() => {
        console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
    });
}