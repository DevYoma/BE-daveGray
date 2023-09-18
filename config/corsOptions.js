const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){ // !origin === undefined
            callback(null, true)
        } else{
            callback(new Error("Not allowed by CORS"))
        }
    },
    optionsSuccessStatus: 200, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}

module.exports = corsOptions;