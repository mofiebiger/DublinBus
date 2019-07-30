$(function(){

	var error_name = false;
	var error_password = false;
	var error_check_password = false;
	var error_email = false;
	var error_check = false;
	var name_state = false;
	var email_state = false;
	var pwd_state = false;
	var cpwd_state = false;


	$('#user_name').blur(function() {
		check_user_name();
	});

	$('#pwd').blur(function() {
		check_pwd();
	});

	$('#cpwd').blur(function() {
		check_cpwd();
	});

	$('#email').blur(function() {
		check_email();
	});


	$('#regBtn').on('click',function(){
		var name = $('#user_name').val()
		var pwd = $('#pwd').val()
		var cpwd = $('#cpwd').val()
		var email = $('#email').val()
		var token = $('input[name="csrfmiddlewaretoken"]').val()

		$.ajax({
			cache:false,
			type: "POST",
			url: window.location.protocol+"//"+window.location.host+'/user/register',
			data:{'user_name':name, 'pwd': pwd, 'cpwd': cpwd, 'email': email,'csrfmiddlewaretoken':token},
			async:true,
			success:function(result){
				if (result.res==1){
					window.location.href = 'http://127.0.0.1:8000/user/index'
				}
				else{
					$('#test_error').html("<b>" + result.error_msg + "</b>");
				}

			},
			error: function(){
				$('#test_error').html("<b>ajax failed1</b>");
			},
		});
	});

	function check_user_name(){
		var len = $('#user_name').val().length;
		if(len<5||len>20)
		{
			$('#user_name').next().html('Please input username which length is between 5 and 20 characaters')
			$('#user_name').next().show();
			error_name = true;
			name_state = false;
		}
		else
		{
			$('#user_name').next().hide();
			error_name = false;
			name_state = true;
		}
		checkform();
	}

	function check_pwd(){
		var len = $('#pwd').val().length;
		if(len<8||len>20)
		{
			$('#pwd').next().html('The length of password should be between 8 and 20')
			$('#pwd').next().show();
			error_password = true;
			pwd_state = false;
		}
		else
		{
			$('#pwd').next().hide();
			error_password = false;
			pwd_state = true;
		}
		checkform();
	}


	function check_cpwd(){
		var pass = $('#pwd').val();
		var cpass = $('#cpwd').val();

		if(pass!=cpass)
		{
			$('#cpwd').next().html('the password input are not match')
			$('#cpwd').next().show();
			error_check_password = true;
			cpwd_state = false;
		}
		else
		{
			$('#cpwd').next().hide();
			error_check_password = false;
			cpwd_state = true;
		}		
		checkform();
	}

	function check_email(){
		var re = /^[a-z0-9][\w\.\-]*@[a-z0-9\-]+(\.[a-z]{2,5}){1,2}$/;

		if(re.test($('#email').val()))
		{
			$('#email').next().hide();
			error_email = false;
			email_state = true;
		}
		else
		{
			$('#email').next().html('the format of the email is not correct!')
			$('#email').next().show();
			error_check_password = true;
			email_state = false;
		}
		checkform();
	}

	function checkform() {
        // if (name_state && email_state && pwd_state && cpwd_state) {
        //     $("#regBtn").attr('disabled',false);
        // } else {
        //     $("#regBtn").attr('disabled',true);
        // }
    }

	// $('#reg_form').submit(function() {
	// 	check_user_name();
	// 	check_pwd();
	// 	check_cpwd();
	// 	check_email();
	//
	// 	if(error_name == false && error_password == false && error_check_password == false && error_email == false && error_check == false)
	// 	{
	// 		return true;
	// 	}
	// 	else
	// 	{
	// 		// return false;
	// 		$('p.error').hide();
	// 	}
	//
	// });








})