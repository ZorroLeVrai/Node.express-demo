const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const morgan = require('morgan');
const helmet = require('helmet');
//load the Express module
const express = require('express');
const logger = require('./middleware/logger');
const authentificate = require('./middleware/authentificator');
const courses = require('./routes/courses');
const home = require('./routes/home');

const app = express();

//set the templating engine
app.set('view engine', 'pug');
//we should put all our templates into the ./views folder
app.set('views', './views');

//adding a middleware to be able to parse JSON in the body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//all static assets will be put in the `public` folder
app.use(express.static('public'));

app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

//Configuration property
console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Mail Password: ${config.get('mail.password')}`);

if (app.get('env') === 'development')
{
  app.use(morgan('tiny'));
  startupDebugger('Morgan enabled...');
}

//Db work...
dbDebugger('Connected to the database...');

app.use(logger);
app.use(authentificate);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));