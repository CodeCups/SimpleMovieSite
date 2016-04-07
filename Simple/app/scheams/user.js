//引入mongoose模块
var mongoose=require('mongoose');
//导入hash加盐 加密模块 不可逆加密
var bcrypt=require('bcrypt-nodejs');
//声明一个模式对象
var UserSchema=new mongoose.Schema({
	//存放字段和类型
	name:{
		unique:true,//唯一的
		type:String,
	},
	password:{
		unique:true,//唯一的
		type:String,
	},
	/**需要有机制控制用户权限的层级**/
	//0 普通用户
	//1 验证通过用户
	//3 资料完善的高级用户




	// >10 管理员 admin
	// >50 超级管理员 super admin
	role:{
		type:Number,
		default:0
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

//为模式添加一个方法‘pre save’每次存取数据之前都会来调用这个方法
UserSchema.pre('save',function(next){
	var user=this;
	//判断数据是否为新加的，方便设置时间
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();	
	}
	//加盐处理密码
	bcrypt.hash(user.password,null,null,function(err,hash){
		if(err){
			return next(err);
		}
		user.password=hash;
		next();
	});
	
})
//添加实例方法
UserSchema.methods={
	comparePassword:function(_password,cb){
		//使用bcrypt进行密码的比对
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err){
				return cb(err);
			}
			cb(null,isMatch);
		})
	}

}
//调用一下静态方法，不会与数据库直接交互，只有经过Modle模型编译实例化后才会具有这个静态方法
UserSchema.statics={
	fetch:function(cb){
	//取出数据库中的所有数据
		return this.find({})
				.sort('meta.updateAt')
				.exec(cb);
	},
	//查询单条的数据
	findById:function(id,cb){
		return this
				.findOne({_id:id})
				.exec(cb);
	},
	//根据名字查询
	findByName: function (_name, cb) {
		return this.findOne({
			name: _name
		}).exec(cb)
	}
};
//将模式导出
module.exports = UserSchema;