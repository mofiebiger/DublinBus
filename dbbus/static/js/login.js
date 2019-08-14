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
            var original_pwd = $('#reset_pw_div input[name="original_pwd"]').val()
            var new_pwd = $('#reset_pw_div input[name="new_pwd"]').val()
            var rnew_pwd = $('#reset_pw_div input[name="rnew_pwd"]').val()

        //post change_password
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

                }else{
                	alert(result.error_msg)
            }},
            error:function(){
                alert('Network problem!')
            },
        })
        return false;
    })
    
    		//reset password through email
            $('#resetPwBtnByEmail').on('click', function(){
            var new_pwd = $('.out input[name="new_pwd"]').val()
            var rnew_pwd = $('.out input[name="rnew_pwd"]').val()

        $.ajax({
            type: "POST",
            url: window.location.href,
            async: false,
            headers: {
                "X-CSRFToken": $('.out input[name="csrfmiddlewaretoken"]').val()
            },
            data: {'new_pwd': new_pwd, 'rnew_pwd': rnew_pwd},
            dataType: 'json',
            success:function(result){
                if (result.res == 1) {
                    alert("Password updated successfully, you need to relogin");
                    location.href= window.location.protocol+"//"+window.location.host

                }else{
                	alert(result.error_msg)
            }},
            error:function(){
                alert('Network problem!')
            },
        })
        return false;
    })

    
    		//FORGET PASSOWRD function
            $('#forgetPwBtn').on('click', function(){
            var email = $('#forget_pw_div input[name="email"]').val()
            var captcha_1 = $('#forget_pw_div #id_captcha_1').val()
            var captcha_0 = $('#forget_pw_div #id_captcha_0').val()


        $.ajax({
            type: "POST",
            url: window.location.protocol+"//"+window.location.host+'/user/forget_password',
            async: false,
            headers: {
                "X-CSRFToken": $('#forget_pw_div input[name="csrfmiddlewaretoken"]').val()
            },
            data: {'email': email,'captcha_0':captcha_0, 'captcha_1':captcha_1},
            dataType: 'json',
            success:function(result){
                if (result.res == 1) {
                    alert(result.success_msg);
                    location.href= window.location.protocol+"//"+window.location.host

                }else{
                	alert(result.error_msg)
            }},
            error:function(){
                alert('Network problem or Server Problem!')
            },
        })
        $('.captcha').click();        
        return false;
    })

//    	login function
	  	$('#loginBtn').on('click',function(){
		var username = $('#login_div #username').val()
		var pwd = $('#login_div #pwd').val()
		var remember = $('#login_div input[name="remember"]:checked').val()
        //post login
		$.ajax({
			cache:false,
			type: "POST",
			url:window.location.protocol+"//"+window.location.host+"/user/login",
            headers: {
                "X-CSRFToken": $('#login_div input[name="csrfmiddlewaretoken"]').val()
            },
			data:{'username':username, 'pwd': pwd, 'remember':remember},
			async:false,
			success:function(result){
				if (result.res == 1){

					location.href=window.location.protocol+"//"+window.location.host;
				}else if (result.res == 0){

					alert(result.errmsg)
				}else{
					var ok = confirm(result.errmsg);
					if(ok){
			        	$.ajax({
			        		cache:false,
			        		type: "POST",
			        		url:window.location.protocol+"//"+window.location.host+"/user/register",
			        		headers: {
			        			"X-CSRFToken": $('#new_user_form input[name="csrfmiddlewaretoken"]').val()
			        		},
			        		data:{'user_name':username, 'code':2},
			        		async:false,
			        		success:function(data){
			        			if (data.res == 1){
			        				alert(data.success_msg)
			        			}else if (data.res == 0){			        				
			        				alert(data.error_msg)
			        			}
			        		},
			        		error: function(){
			        			alert("Network problem!");
			        		},
			        	});						
					}
				}
			},
			error: function(){
				alert("Network problem!");
			},
		});
		});

//    	register function
        $('#regBtn').on('click',function(){
        	var user_name = $('#new_user_form #user_name').val()
        	var email = $('#new_user_form #reg-email').val()
        	var pwd = $('#new_user_form #reg-pwd').val()
        	var rpwd = $('#new_user_form #re-pwd').val()
        	var code = 1
        	//post register
        	$.ajax({
        		cache:false,
        		type: "POST",
        		url:window.location.protocol+"//"+window.location.host+"/user/register",
        		headers: {
        			"X-CSRFToken": $('#new_user_form input[name="csrfmiddlewaretoken"]').val()
        		},
        		data:{'user_name':user_name, 'pwd':pwd, 'rpwd':rpwd, 'code':code, 'email':email},
        		async:false,
        		success:function(result){
        			if (result.res == 1){
        				alert(result.success_msg)
        				$('.toLogin').click();
        			}else if (result.res == 0){
        				
        				alert(result.error_msg)
        			}
        		},
        		error: function(){
        			alert("Network problem!");
        		},
        	});
        });
        


	  	$('#forget_password').on('click', function(){
            $('#forget_pw_div').attr('style',"style","display:block;")
			$('#login_div').attr("style","display:none;")
        })

        
        
        $('.captcha').click(function(){
             $.getJSON("/refresh/",
                      function(result){
                 $('.captcha').attr('src', result['image_url']);
                 $('#id_captcha_0').val(result['key'])
              });});
})
