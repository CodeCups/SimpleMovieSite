//引入mongoose模块
var mongoose=require('mongoose');
var Schema = mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
//声明一个模式对象
var MovieSchema=new Schema({
	//存放字段和类型
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	pv:{
		type:Number,
		default:0
	},
	categroy:{
		type:ObjectId,
		ref:'Category'
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
MovieSchema.pre('save',function(next){
	//判断数据是否为新加的，方便设置时间
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();	
	}
	next();
})

//调用一下静态方法，不会与数据库直接交互，只有经过Modle模型编译实例化后才会具有这个静态方法
MovieSchema.statics={
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
	}
}
//将模式导出
module.exports = MovieSchema;