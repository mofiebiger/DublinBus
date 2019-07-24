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
			async:false,
			success:function(result){
				if (result.res == 1){

					location.href=window.location.protocol+"//"+window.location.host+"/user/index"
				}else {
					console.log(result.res)
					console.log(result.res ==1)
				}

				// 	$('#user_info').attr("style","display:block;")
				// 	$('#login_div').attr("style","display:none;")
				// }

			},
			error: function(){
				alert("false");
			},
		});
	});

})
