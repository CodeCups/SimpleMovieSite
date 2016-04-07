//加载工具模块
var mongoose=require('mongoose');
//引入模式文件导出的模块
var MovieSchema=require('../scheams/movie');
//编译生成movie模型
var Movie=mongoose.model('Movie',MovieSchema);

//导出构造函数
module.exports=Movie;