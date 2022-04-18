const yargs = require('yargs')


const argv = yargs.alias({
    p: 'port',
    m:'mode'
}).default({
    port:process.argv[2] || 8080,
    mode:'fork'
}).argv