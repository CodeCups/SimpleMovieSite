//路由模块
var Index=require('../app/controllers/index');
var Movie=require('../app/controllers/movie');
var User=require('../app/controllers/user');
var Comment=require('../app/controllers/comment');
var Category=require('../app/controllers/category');


//将这个模块抛出
module.exports=function(app){
	//用户登录信息预处理---所有的界面都会判断
	app.use(function(req,res,next){
		var _user=req.session.user;
		app.locals.user=_user;
		next();
		
	});
	//路由--
/*****首页*****/
	app.get('/',Index.index);
	app.get('/results', Index.search);

/***用户****/
	//注册/user/signup
	app.post('/user/signup',User.signup);
	//登录
	app.post('/user/signin',User.signin);
	app.get('/signin',User.showSignin);
	app.get('/signup',User.showSignup);
	//退出
	app.get('/logout',User.logout);
	//用户列表
	app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.list);

	

/****电影*****/
	//电影详情
	app.get('/movie/:id',Movie.detail);
	//admin页面
	app.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new);
	//列表页
	app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
	//保存
	app.post('/admin/movie',User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save);
	//更新
	app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);
	//删除
	app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.delet);

/********评论********/
	app.post('/user/comment',User.signinRequired,Comment.save);

/******分类*****/
	app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.new);
	//保存
	app.post('/admin/category',User.signinRequired,User.adminRequired,Category.save);
	//分类列表
	app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.list);


}