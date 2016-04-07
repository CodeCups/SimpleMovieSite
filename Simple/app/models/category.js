//加载工具模块
var mongoose=require('mongoose');
//引入模式文件导出的模块
var CategorySchema=require('../scheams/category');
//编译生成Category模型
var Category=mongoose.model('Category',CategorySchema);

//导出构造函数
module.exports=Category;