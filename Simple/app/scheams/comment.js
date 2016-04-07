//引入mongoose模块
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;//主键
//声明一个模式对象
var CommentSchema=new Schema({
	//评论人，评论的当前页面，回复对象，评论内容、
	movie:{
		//通过引入的方式存放电影的id
		type:ObjectId,
		//指向Movie模型
		ref:'Movie'//引用关联文档Populate(Mongo)
	},
	from:{//评论来自于谁
		type:ObjectId,
		ref:'User'
	},
	reply:[{//回复这是一个数组，里面有多个对象
		from:{type:ObjectId,ref:'User'},
		to:{type:ObjectId,ref:'User'},
		content:String

	}],
	to: {
		type: ObjectId, 
		ref: 'User'
	},
	content:String,//内容
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
CommentSchema.pre('save',function(next){
	//判断数据是否为新加的，方便设置时间
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();	
	}
	next();
})

//调用一下静态方法，不会与数据库直接交互，只有经过Modle模型编译实例化后才会具有这个静态方法
CommentSchema.statics={
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
module.exports = CommentSchema;