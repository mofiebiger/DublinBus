$(function(){
	$('#loginBtn').on('click',function(){
		var username = $('#username').val()
		var pwd = $('#pwd').val()
		var token = $('input[name="csrfmiddlewaretoken"]').val()
		$.ajax({
			cache:false,
			type: "POST",
			url:"http://127.0.0.1:8000/user/login",
			data:{'username':username, 'pwd': pwd,'csrfmiddlewaretoken':token},
			async:true,
			success:function(result){
				if (result.res == 0){
					$('#user_info').attr("style","display:block;")
					$('#login_div').attr("style","display:none;")
					// location.href = "http://127.0.0.1:8000/user/user_info"
				}
				console.log(result.res)
			},
			error: function(){
				alert("false");
			},
		});
	});


})