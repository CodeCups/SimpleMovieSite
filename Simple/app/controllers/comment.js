
var Comment=require('../models/comment');

exports.save=function(req,res){
	// console.log(req.body);
	//拿到评论对象
	var _comment=req.body;
	// //得到电影的id
	var movieId=_comment.movie;
	console.log(_comment);

	/***回复的处理**/
	//查看是否存在cid---有则表示有用户评论回复
	if(_comment.cid){
		//找到主评论的id--通过回调拿到主评论
		Comment.findById(_comment.cid,function(err,comment){
			console.log(comment);
			if(err){
				console.log(err);
			}
			var newReply={
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content
			}
			//向当前的comment添加一条数据
			comment.reply.push(newReply);
			// console.log(_comment);
			// //保存
			comment.save(function(err,comment){
				// console.log('reply')
		        console.log(comment.reply.from)
				if(err){
					// console.log('err:')
					console.log(err);
				}
				//保存成功后刷新到评论电影的页面
				res.redirect('/movie/'+movieId);
			});
		});
	}else{
	/**评论的处理**/
	// //构造一个comment对象
		var comment=new Comment(_comment);

		comment.save(function(err,comment){
			if(err){
				console.log(err);
			}
			//保存成功后刷新到评论电影的页面
			res.redirect('/movie/'+movieId);
		});
	}
};