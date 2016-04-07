var User=require('../models/user');

exports.showSignup=function(req,res){
	res.render('signup',{
		title:'注册界面'
	})
};

exports.showSignin=function(req,res){
	res.render('signin',{
		title:'登录界面'
	})
};


exports.signup=function(req,res){
	//用户登录
	var _user=req.body;
	var _name=_user.name;
	//判断用户名是否重复通过mongodb
	User.findByName(_name,function(err,user){
		if(err){
			console.log(err);
		}
		console.log(user);
		if(user){
			//如果用户已经存在
			return res.redirect('/signin');
		}else{
			//生成新的用户
			user=new User(_user);
			user.save(function(err,user){
				if(err){
					console.log(err);
				}
				req.session.user = user;
				//重定向到首页
				res.redirect('/');
				// console.log("已保存用户信息:"+user);
			})
		}
	})
};

	//用户登录路由
exports.signin=function(req,res){
	//拿到用户
	var user=req.body;

	// //和数据库进行比对
	var _name=user.name.toString();
	var _password=user.password.toString();
	// //查找用户名是否匹配
	User.findByName(_name,function(err,user){
		if(err){
			console.log(err);
		}
	
		if(!user){
		//如果用户不存在，返回首页，
			console.log('用户不纯在！！！')
			return res.redirect('/signup');
		}
		//存在比较密码
		user.comparePassword(_password,function(err,isMatch){
			if(err){
				console.log(err);
			}
			if(isMatch){
				//将用户状态保存到内存中去使用session会话保存在内存中
				req.session.user = user;
				res.redirect('/');
			}else{
				return res.redirect('/signin');
			}
		});
	});

};
	//登出
exports.logout=function(req,res){
	console.log(req.session.user);
	delete req.session.user;
	// delete app.locals.user;
	res.redirect('/');
};

//userlist 用户信息列表路由
exports.list=function(req,res){
	//实现查询逻辑
	User.fetch(function(err,users){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title:'用户信息列表页',
			users:users
		})
	})
};

//中间件1 查看用户是否登录
exports.signinRequired=function(req,res,next){
	var user=req.session.user;
	if(!user){
		return res.redirect('/signin');
	}
	next()
};

exports.adminRequired=function(req,res,next){
	var user=req.session.user;
	console.log(user.role);

	if(user.role<=10||user.role===undefined){
		return res.redirect('/signin')
	}
	next();
};