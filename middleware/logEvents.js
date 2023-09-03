const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
// import { format } from "date-fns";

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    // console.log(logItem);
    //testing 
    try {
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..',  'logs', logName), logItem)
    } catch (error) {
        console.log(error);    
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    console.log(`${req.method} ${req.path}`);
    next(); // this makes it move on to the next
}

module.exports = {
    logger, 
    logEvents
}

// console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'));


// console.log("hello");

// console.log(uuid());

