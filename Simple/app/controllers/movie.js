var Movie=require('../models/movie');
var Comment=require('../models/comment');
var Category=require('../models/category');
var fs = require('fs');
var path = require('path');	

var _=require('underscore');//新老对象替换
//detail page
exports.detail= function(req,res){
	//实现详情页查询逻辑
	var id=req.params.id;
	// console.log(Movie);
	if(id){
		//访问+1
		Movie.update({_id:id},{$inc:{pv:1}},function(err){
			if(err){
				console.log(err)
			}
		})
		Movie.findById(id,function(err,movie){
			//使用回调的方式获取用户评论的数据渲染到界面中
			//使用回调查询comment---关联查询用户-方法一
			Comment.find({movie:id})
				.populate('from','name')//关联查询名字
				.populate('reply.to', 'name')//关联回复的
				.populate('reply.from ','name')//来着于那个用户的回复
				.exec(function(err,comments){
					if(err){
						console.log('err:')
						console.log(err);
					}
					// console.log(comments._id);
					res.render('detail',{
						title:'Node '+movie.title,
						movie:movie,
						comments:comments
					})
			});
		})
		
	}	
};

	//admin page
exports.new=function(req,res){
	Category.find({},function(err,categories){
		console.log("categories:");
		// comments.log(categories)
		res.render('admin',{
			title:'Node 后台录入页',
			movie:{},
			categories:categories
		})
	});
		
};
	//admin update page
exports.update=function(req,res){
	var id=req.params.id;
	// console.log(id);
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			Category.find({}, function (err, categories) {
				res.render('admin', {
					title: 'Node 后台更新页面',
					movie: movie,
					categories: categories
				})
			})    
		})
	}
};


	//admin post movie
exports.save=function(req,res){
	var id=req.body._id;
	var movieObj=req.body;
	var _movie;
	if(req.poster){
		movieObj.poster=req.poster;
	}
	if(id){
		//不是新添加的电影
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			//替换对象
			_movie=_.extend(movie,movieObj);
			_movie.categroy=movieObj.category;

			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}

				var categoryId = movie.category
				Category.findById(categoryId, function (err, category) {
					category.movies.push(movie._id)
					category.save (function (err, category) {
						res.redirect('/movie/' + movie._id)
					})
				})
			})
		})
	}else{
		_movie=new Movie(movieObj);
		_movie.categroy=movieObj.category;
		var categoryId=movieObj.category;
		var categoryName=movieObj.categoryName;
		_movie.save(function(err,movie){
			if(err){
					console.log(err)
			}
			//将电影的id值存放到哦category中去
			if(categoryId){
				Category.findById(categoryId,function(err,category){
					if(err){
						console.log(err)
					}
					category.movies.push(movie._id);
					category.save(function(err,categroy){
						if(err){
							console.log(err);
						}
						res.redirect('/movie/' + movie._id);
					})
				})
			}else if(categoryName){
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})
				category.save(function (err, category) {
					movie.category = category._id 
					movie.save(function (err, movie) {
						res.redirect('/movie/' + movie._id)						
					})
				})
			}
			
		})
	}
};

	//list page
exports.list=function(req,res){
	//实现查询逻辑
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title:'Node 列表页',
			movies:movies
		})
	})
	
};

	//设置删除的路由
	//list delete movie net::ERR_empty_RESPONSE
exports.delet=function(req,res){
	var query=req._parsedUrl.query;
	if(query!==undefined){
		var id=query.substr(3);
	}
	// console.log(id);
	if(id){
		Movie.remove({_id: id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}

		});
	}
};
//增加存储图片的中间件
exports.savePoster=function(req,res,next){
		// console.log(req.files);
	//拿到上传的文件
	var postData=req.files.uploadPoster;
	// 拿到文件的路径
	var filePath=postData.path;
	//拿到原始名字
	var originalFileName=postData.originalFilename;
	console.log("originalFileName--------------------");
	console.log(originalFileName);
	// 有原始名字代表有文件传过来
	if(originalFileName){
		fs.readFile(filePath,function(err,data){
			var timeName= Date.now();
			var type=postData.type.split('/')[1];
			var poster = timeName+'.'+type;
			var newPath=path.join(__dirname,'../../','/public/upload/'+poster);
			console.log("newPath--------------------");
			console.log(newPath);
			//写入文件
			fs.writeFile(newPath,data,function(){
				if(err){
					return;
				}
				req.poster=poster;
				next();
			})
		});
	}else{
		next();
	}
};