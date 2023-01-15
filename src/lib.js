const express = require('express');
const logger = require('./middleware/logger');
const err_404 = require('./middleware/error404');
const main_router = require('./routes/mainRoute');

const app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'))
app.use(logger);
app.use(express.urlencoded());
app.use('/', main_router);
app.use(err_404);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log("Server started!!!") });