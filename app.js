const express = require('express');
const routes = require('./routes');
const middlewares = require('./middlewares');
const { returnJson } = require('./my_modules/json_response');

global.returnJson = returnJson;

const app = express();

process.on('unhandledRejection', (reason) =>{
    console.log(reason);
    process.exit(1);
})

app.use(express.json());

middlewares.global(app);
routes(app);

app.use((error, req, res, next) => {
    return returnJson(res, error.statusCode || 500, false, error.message, null);
})

module.exports = app