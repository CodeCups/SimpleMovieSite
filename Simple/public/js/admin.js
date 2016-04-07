//删除个功能使用jquery
$(function(){
	$('.del').click(function(e){//拿到所有的删除按钮，监听点击事件
		var target=$(e.target);
		var id=target.data('id');
		console.log('id:'+id);
		// //拿到表格中的行，删除整行
		 var tr=$('.item-id-'+id);
		 console.log('拿到tr'+tr );
		$.ajax({
			type:'DELETE',
			url:'/admin/movie/list?id='+id
		})
		.done(function(results){
			if(results.success===1){
				if(tr.length>0){
					tr.remove();
				}else{
					console.log('什么情况！！！')
				}
			}
		})

	})
	//跨域请求豆瓣api测试
	$('#douban').blur(function(){
		var douban=$(this);
		var id=douban.val();
		if(id){
			$.ajax({
				url:'https://api.douban.com/v2/movie/subject/'+id,
				cache:true,
				type:'get',
				dataType:'jsonp',
				crossDomain:true,//跨域 
				jsonp:'callback',//jsonp回传的参数名callback
				success:function(data){
					//豆瓣数据进行赋值
					$('#inputTitle').val(data.title)
					$('#inputDoctor').val(data.directors[0].name)
					$('#inputCountry').val(data.countries[0])
					// $('#inputLanguage').val(data.)
					$('#inputPoster').val(data.images.large)
					// $('#inputFlash').val(data.)
					$('#inputYea').val(data.year)
					$('#inputSummary').val(data.summary)

				}

			})
		}
	})
})