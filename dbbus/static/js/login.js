    $(document).ready(function(){

        $('#upload_avatar').on('click', function(){
            var token = $('input[name="csrfmiddlewaretoken"]').val()
            console.log(token)
            var form = new FormData();
            form.append('avatar', $('#file_upload')[0].files[0])
            form.append('csrfmiddlewaretoken', token)

        //post change_avatar
        $.ajax({
            type: "POST",
            url: window.location.protocol+"//"+window.location.host+'/user/change_avatar',
            async: true,
            data: form,
            processData:false,
            contentType:false,
            success:function(result){
                if (result.res == 1) {
                    alert("Profile updated successfully")
                    location.href= window.location.protocol+"//"+window.location.host

                } else if (result.res == 0 ){
                    alert(result.error_msg)
                } else{
                    alert("either 0 nor 1")
                }
            },
            error:function(){
                alert('change avatar fail')
            },
        })
    })

        $('#resetPwBtn').on('click', function(){
            var original_pwd = $('#reset_pw_div input[name="original_pwd"]').val()
            var new_pwd = $('#reset_pw_div input[name="new_pwd"]').val()
            var rnew_pwd = $('#reset_pw_div input[name="rnew_pwd"]').val()
            console.log(original_pwd,new_pwd,rnew_pwd)

        //post change_avatar
        $.ajax({
            type: "POST",
            url: window.location.protocol+"//"+window.location.host+'/user/change_password',
            async: false,
            headers: {
                "X-CSRFToken": $('#reset_pw_div input[name="csrfmiddlewaretoken"]').val()
            },
            data: {'original_pwd': original_pwd,'new_pwd': new_pwd, 'rnew_pwd': rnew_pwd},
            dataType: 'json',
            success:function(result){
                if (result.res == 1) {
                    alert("Password updated successfully, you need to relogin");
                    location.href= window.location.protocol+"//"+window.location.host

                } else if (result.res == 0 ){
                    alert(result.error_msg)
                } else{
                	var error_messages = result.error_msg
                	console.log(error_messages)
//                	for(var i=0; i<error_messages.length,i++){
//                		
//                	}
                    alert(result.error_msg[0])
                }
            },
            error:function(){
                alert('reset pw fail')
            },
        })
        return false;
    })

	  	$('#loginBtn').on('click',function(){
		var username = $('#username').val()
		var pwd = $('#pwd').val()
		var token = $('input[name="csrfmiddlewaretoken"]').val()
		console.log(token)

        //post login
		$.ajax({
			cache:false,
			type: "POST",
			url:window.location.protocol+"//"+window.location.host+"/user/login",
			data:{'username':username, 'pwd': pwd,'csrfmiddlewaretoken':token},
			async:false,
			success:function(result){
				if (result.res == 1){

					location.href=window.location.protocol+"//"+window.location.host;
				}
			},
			error: function(){
				alert("false");
			},
		});
		});



	  	$('#forget_password').on('click', function(){
            $('#forget_pw_div').attr('style',"style","display:block;")
			$('#login_div').attr("style","display:none;")
        })

})
