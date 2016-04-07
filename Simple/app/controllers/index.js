var Movie=require('../models/movie');
var Category=require('../models/category');
//负责和首页进行交互

exports.index=function(req,res){
	Category
    .find({})
    .populate({path: 'movies', options: {limit: 6}})
    .exec(function (err, categories) {
      if (err) {
        console.log(err)
      }
      res.render('index', {
        title : 'Node 首页',
        categories: categories
      })  
  });
};
//search page 
exports.search = function (req, res) {
	var cateId=req.query.cat;
	var page=parseInt(req.query.p,10) || 0;
	var search=req.query.search;//搜索
	var count=2;
	var index=page*count;
	console.log();

	if(cateId){
		Category
	    .find({_id:cateId})
	    .populate({path: 'movies', options: {limit: 6}})
	    .exec(function (err, categories) {
	      if (err) {
	        console.log(err)
	      }
	      var category=categories[0]||{};
	      var movies=category.movies||[];
	      var result=movies.slice(index,index+count);

	      res.render('result', {
	        title : '查询结果',
	        courrentPage:page+1,
	        movies:result,
	        totalPage:Math.ceil(movies.length/count),
	        keyword:category.name,
	        query:'cat='+cateId
	      })  
	  });
	}else{
		Movie
		.find({title:new RegExp(search + '*', 'i')})//通过正则表达式进行模糊查询
		.exec(function(err,movies){
			 if (err) {
		        console.log(err)
		      }
		      var result=movies.slice(index,index+count);

		      res.render('result', {
		        title : '查询结果',
		        courrentPage:page+1,
		        movies:result,
		        totalPage:Math.ceil(movies.length/count),
		        keyword:search,
		        query:'cat='+search
		      })  
		});
	}

	
};