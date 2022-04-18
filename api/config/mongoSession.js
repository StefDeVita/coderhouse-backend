const MongoStore = require('connect-mongo');
const advancedOptions = {useNewUrlParser:true,useUnifiedTopology:true}

const mongoSession = {
    store:MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        mongoOptions: advancedOptions
    }),
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:6000000
    }
}

module.exports = mongoSession