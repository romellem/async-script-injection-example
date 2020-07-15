const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

const app = express();
app.use(morgan('combined'));
app.use(compression());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Listening', PORT));
