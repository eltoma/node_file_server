var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');

var fs=require("fs"),
    http=require("http"),
    url=require("url"),
    path=require("path"),
    mime=require("./mime").mime,
    util=require('util');
 
app.set('views', __dirname);
app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );

app.use(express.static(require('path').join(__dirname, 'public'))); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// 访问时间限制
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*10  // 过期时间设置(单位毫秒)
    }
}));
// 新增中间件并设置模板变量值
app.use(function(req, res, next){
    // res.locals对象保存在一次请求范围内的响应体中的本地变量值
    res.locals.user = req.session.user; 
    var err = req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div style="margin-bottom: 20px;color:red;">' + err + '</div>';
    next();
});
 
app.get('/', function(req, res) {
    res.render('login');
});

require('./login')(app);
 
app.listen(1337);
util.debug("服务器开始运行 ");