//加载工具模块
var mongoose=require('mongoose');
//引入模式文件导出的模块
var CommentSchema=require('../scheams/comment');
//编译生成movie模型
var Comment=mongoose.model('Comment',CommentSchema);
//导出构造函数
module.exports=Comment;