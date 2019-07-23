$(function(){
	$('#loginBtn').on('click',function(){
		var username = $('#username').val()
		var pwd = $('#pwd').val()
		var token = $('input[name="csrfmiddlewaretoken"]').val()

		$.ajax({
			cache:false,
			type: "POST",
			url:window.location.protocol+"//"+window.location.host+"/user/login",
			data:{'username':username, 'pwd': pwd,'csrfmiddlewaretoken':token},
			async:true,
			success:function(result){
				if (result.res == 0){
					location.href="http://127.0.0.1:8000/user/index"
				}
				// 	$('#user_info').attr("style","display:block;")
				// 	$('#login_div').attr("style","display:none;")
				// }
				console.log(result.res)
			},
			error: function(){
				alert("false");
			},
		});
	});

	$('#contact_info').submit(function(){
		var contact = $('textarea[name="contact"]').val()
		var token = $('input[name="csrfmiddlewaretoken"]').val()
		$.ajax({
			cache:false,
			type: "POST",
			url: window.location.protocol+"//"+window.location.host+"/user/contact",
			data:{'contact': contact,'csrfmiddlewaretoken':token},
			dataType:'json',

			async:false,

			}).done(function(result){
				 if(result.res == 1){
					 window.confirm(result.success_msg);
                    }else {
                    	window.confirm(result.error_msg);
				 	}
			}).fail(function(){
				alert("false1");
			});
		return false;
	});

})
