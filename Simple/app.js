var express = require("express");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);//使用mongo做session会话的持久化
var path=require("path");
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var middleware=require('morgan');
var multipart = require('connect-multiparty');
var fs=require('fs');
var serveStatic=require('serve-static');

//加载模块
var models_path=__dirname+'/app/models'
var walk=function(path){
	//边里所有路径
	fs
	.readdirSync(path)
	.forEach(function(file){
		var newPath=path+'/'+file;
		var stat =fs.statSync(newPath);

		if(stat.isFile()){
			if(/(.*)\.(js|coffee)/.test(file)){
				require(newPath)
			}
		}else if(stat.isDirectory()){
			walk(newPath);
		}
	})
}
walk(models_path);


var port = process.env.PORT||3000;

var app = express();

var mongoPath="mongodb://localhost/Node";

var store = new MongoStore({
	url:mongoPath,
	collection:"sessions"
});
mongoose.connect(mongoPath);
//设置视图的根目录
app.set("views","./app/views/pages");
 //设置默认的模板引擎
app.set("view engine","jade");
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser)
//静态资源目录
app.use(serveStatic(path.join(__dirname,'public')));
app.locals.moment=require('moment')
//使用session会话
//使用cookie中间件
app.use(cookieParser());
app.use(session({
 	secret: 'Node',
 	store:store
}))
//引入表单处理中间件
app.use(multipart());
//错误输出
var env=process.env.NODE_ENV||'development'
if('development' === env){
	//当env时开发环境的时候---设置
	app.set('showStackError',true);//错误可以在屏幕上打印出来
	//中间件传入配置的参数值
	app.use(middleware(":method :url :status"))//希望看到的请求状态，也可传入dev
	//窗口上的源码格式化提高可读性
	app.locals.pretty =true ;
	//设置数据库
	mongoose.set('debug',true);
}

//应用路由文件
require('./config/routes')(app);

 //监听端口 
app.listen(port);
 //打印日志
console.log("服务启动，端口号是："+port);