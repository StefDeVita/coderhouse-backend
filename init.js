const cluster = require('cluster')
const {app,argv,httpServer} = require('./server')
const cpus = require("os").cpus().length;


const PORT =  process.env.PORT || Number(argv.port) || 8080
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
        const server = httpServer.listen(PORT,() => {
            console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
        });
    }
}
else{
    const server = httpServer.listen(PORT,() => {
        console.log(`Servidor escuchando en el puerto ${server.address().port}   `)
    });
}