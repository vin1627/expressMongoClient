var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoClient = require('mongodb').MongoClient; // mongo client driver
const url = 'mongodb://localhost:27017'; // mongo url as default
const dbName = 'mongoclientDb'; // database name



var dbase;
// initialize connect to monggo
MongoClient.connect(url, function(err, database){


  if(database){
    dbase = database.db(dbName);
    console.log('connected : mongodb');
  
  }else
  if(err){
    console.log('err : ' ,err)
  }
})


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/mongoclient', function(req, res){
  dbase.collection('todo').save(req.body, function(err, result){
    if(err){
      console.log('err : ',err)
    }
    console.log('save to dbase')
    res.send(200, 
    {
      msg:"successfuly saved!",
      data:req.body
    })
  })
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
