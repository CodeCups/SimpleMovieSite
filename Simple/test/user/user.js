// //user的测试用例---要引入测试的模块
var crypto = require('crypto');//密码和随机字符串的生成
var bcrypt = require('bcrypt-nodejs');//密码加密模块
var should = require('should');
var app = require('../../app');
var mongoose=require('mongoose');
var User=mongoose.model('User');
var user;
// //获取一个随机字符串，用作测试名字
function getRandomString(len){
	if(!len){
		len=16;
	}
	return crypto.randomBytes(Math.ceil(len/2)).toString('hex')
}

// // //测试用例，可嵌套
describe('<Unit Test',function(){
	describe('Model User:',function(){
		//测试开始前
		before(function(done){
			user={
				name:getRandomString(),
				password:'password'
			}
			done();
		});
		// 确保用户在数据库中不存在
		describe('Before Method Save',function(){
			//it代表一个测试用例 done尽量只调用一次
			it('Should begin withou test user',function(done){
				User.find({name:user.name},function(err,users){
					users.should.have.length(0);
					 //只有用户不存在时进行下一步测试
					 done();
				})
			})
		});
		// 	//测试save的时候 
		describe('User Save',function(){
			//这里会有多个it
			it('Should save without problems',function(done){
				var _user=new User(user);
				_user.save(function(err){
					should.not.exist(err)
					//保存没问题后删掉user
					_user.remove(function(err){
						should.not.exist(err)
						done()  
					})
				})
			});
			it('Should password be hashed correctly',function(done){
				var password=user.password;
				var _user=new User(user);
				_user.save(function(err){ 
					should.not.exist(err);
					//比对password
					_user.password.should.not.have.length(0);
					bcrypt.compare(password,_user.password,function(err,isMatch){
						should.not.exist(err);
						isMatch.should.equal(true);
						_user.remove(function(err){
							should.not.exist(err)
							done()
						})
					})
				})
			});
			//测试用权限
			it('Should have defualt role 0',function(done){
				var _user=new User(user);
				_user.save(function(err){ 
					should.not.exist(err);
					_user.role.should.equal(0)
					_user.remove(function(err){
						should.not.exist(err)
						done()
					})
				})
			});
			//存储重名的user
			it('Should fail to save an existing user',function(done){
				var _user1=new User(user);
				_user1.save(function(err){
					should.not.exist(err);
					var _user2=new User(user);
					_user2.save(function(err){
						should.exist(err)
						_user1.remove(function(err){
							if(!err){
								_user2.remove(function(err){
									should.not.exist(err)
									done()
								})
							}
						})
					})
				});
				
			});
		});
		
		//测试完成之后
		after(function(done){
			//TO DO
 			done();
		});
	})
	

	

	// 	})
})


