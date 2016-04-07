var Category=require('../models/category');

var _=require('underscore');//新老对象替换


	//admin page
exports.new=function(req,res){
	res.render('category_admin',{
		title:'后台分类录入页',
		category:{}
	})
};
//admin post movie
exports.save=function(req,res){
	var _category=req.body;
	// console.log(_category);
	var newCategory = new Category(_category)
		newCategory.save(function (err, category) {
			if (err) {
			  console.log(err)
			}
			console.log(category)
			res.redirect('/admin/category/list')
		})
};
exports.list=function(req,res){
	//实现查询逻辑
	Category.fetch(function(err,categories){
		if(err){
			console.log(err);
		}
		res.render('categorylist',{
			title:'用户信息列表页',
			categories:categories
		})
	})
};
