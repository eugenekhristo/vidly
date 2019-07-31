const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/routes')(app);
require('./startup/db')();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => winston.info(`Server is running on PORT ${PORT}...`));
