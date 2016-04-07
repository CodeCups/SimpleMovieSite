module.exports=function(grunt){

	//编写任务
	grunt.initConfig({
		watch:{
			jade:{
				files:['view/**'],
				options:{
					livererload:true
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				// tasks:['jshint'],//语法检查
				options:{
					livererload:true//当文件出现改动时重新启动服务
				}
			}
		},
		nodemon:{
			dev:{//开发环境
				options:{
					file:'app.js',//当前的入口文件
					args:[],
					ignoredFiles:['README.md','node_modules/**','.DS_Store'],
					watchedExtensions:['js'],
					watchedFolders:['./'],
					debug:true,						delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},
		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.js']
	    },
		jshint: {
			options: {
		        jshintrc: '.jshintrc',
		        ignores: ['public/libs/**/*.js']
		    },
		    all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
		},
		// //js/css文件编译压缩
		less: {
			development: {
				options: {
					compress:true,
					yuicompress:true,
					optimization:2
				},
				files: {
					"public/build/index.css": "public/less/index.less"
				}
			}
		},
		uglify: {
			development:{
				files:{
					'public/build/admin.min.js':'public/js/admin.js',
					'public/build/detail.min.js':[
						'public/js/detail.js'
					]
				}
			}
		},
		concurrent:{
			tasks:['nodemon','watch','less','uglify','jshint'],
			options:{
				logConcurrentOutput:true
			}
		}
	});

	//当有文件添加，删除，修改时会重新执行在这里注册号的任务
	grunt.loadNpmTasks('grunt-contrib-watch');
	//nodemon实时监听入口文件，可以自动重启
	grunt.loadNpmTasks('grunt-nodemon');
	//针对慢任务开发插件入css编译,优化构架时间，可以跑多个阻塞的任务，如watch，nodemon
	grunt.loadNpmTasks('grunt-concurrent');	
	//加载单元测试模块
	grunt.loadNpmTasks('grunt-mocha-test');


	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//设置true，避免其他错误终端整个服务
	grunt.option('force',true);
	//注册默认任务
	grunt.registerTask('default',['concurrent']);
	grunt.registerTask('test',['mochaTest']);

}