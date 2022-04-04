var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var bodyParser = require("body-parser");

var cateRouter = require('./routes/cate');
var orderRouter = require('./routes/orders');
var adminRouter = require("./routes/admin");
var eventRouter = require("./routes/events");
var caseRouter = require("./routes/case");
var articleRouter = require("./routes/article");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: "100mb"})); // 接收文件限制100mb
app.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

app.use('/cate', cateRouter);
app.use('/orders', orderRouter);
app.use("/admins", adminRouter);
app.use("/events", eventRouter);
app.use("/case", caseRouter);
app.use("/article", articleRouter);

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