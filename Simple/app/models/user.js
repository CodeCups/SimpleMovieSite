//加载工具模块
var mongoose=require('mongoose');
//引入模式文件导出的模块
var UserSchema=require('../scheams/user');
//编译生成User模型
var User=mongoose.model('User',UserSchema);

//导出构造函数
module.exports=User;