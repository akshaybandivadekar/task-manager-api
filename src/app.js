const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
require('../src/db/mongoose');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//
// Without middleware : new request => run route handler
//
// With middleware    : new request => do something => run route handler
//

module.exports = app;