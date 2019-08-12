    $(document).ready(function(){

        $('#upload_avatar').on('click', function(){
            var token = $('input[name="csrfmiddlewaretoken"]').val()
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
            var token = $('input[name="csrfmiddlewaretoken"]').val()
            var email = $('#reset_pw_div input[name="email"]').val()
            var new_pwd = $('#reset_pw_div input[name="new_pwd"]').val()
            var rnew_pwd = $('#reset_pw_div input[name="cnew_pwd"]').val()

        //post change_avatar
        $.ajax({
            type: "POST",
            url: window.location.protocol+"//"+window.location.host+'/user/reset_password',
            async: true,
            data: {'email': email,'new_pwd': new_pwd, 'rnew_pwd': cnew_pwd, 'csrfmiddlewaretoken':token,},
            processData:false,
            contentType:false,
            success:function(result){
                if (result.res == 1) {
                    alert("Password updated successfully");
                    location.href= window.location.protocol+"//"+window.location.host

                } else if (result.res == 0 ){
                    alert(result.error_msg)
                } else{
                    alert("either 0 nor 1")
                }
            },
            error:function(){
                alert('reset pw fail')
            },
        })
    })

	  	$('#loginBtn').on('click',function(){
		var username = $('#username').val()
		var pwd = $('#pwd').val()
		var token = $('input[name="csrfmiddlewaretoken"]').val()

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
