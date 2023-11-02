require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./models');
const seedDatabase = require('./scripts/seedDatabase');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser')


var usersRouter = require('./routes/users');
var todosRouter = require('./routes/todos');
var categoryRouter = require('./routes/category');
var statusRouter = require('./routes/status');

var db = require('./models');
db.sequelize.sync({ force: false }).then(() => {
    seedDatabase().then(() => {
        console.log("Database synced and seeded.");
    }).catch(err => {
        console.error("Error seeding database.", err);
    });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', usersRouter);
app.use('/todos', todosRouter);
app.use("/category", categoryRouter);
app.use('/status', statusRouter);

app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

