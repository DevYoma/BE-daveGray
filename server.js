const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// CUSTOM middleware logger
app.use(logger)

// Handle option credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// CORS
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data in other words, form Data;
app.use(express.urlencoded({ extended: false }))

// built in middleware for json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// serve static files
app.use(express.static(path.join(__dirname, '/public')))

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT) // everything under this will use the verifyJWT, sweet 🚀
app.use('/employees', require('./routes/api/employees'));


// catch all error
app.all('*', (req, res) => {
    res
        .status(404)
        if(req.accepts('html')){
            res.sendFile(path.join(__dirname, 'views', '404.html'))
        }
        else if(req.accepts('json')){
            res.json({
                error: "404 Not Found"
            })
        } else{
            res.type('txt').send("404 Not Found")
        }
})

// CUSTOM ERROR HANDLING
app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

// require('crypto').randomBytes(64).toString('hex')