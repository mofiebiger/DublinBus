$(function(){

	$.ajaxSetup({
                 data: {csrfmiddlewaretoken: '{{ csrf_token }}' },
            });

	$('#loginBtn').on('click',function(){
		var username = $('#username').val()
		var pwd = $('#pwd').val()
		var token = $('input[name="csrfmiddlewaretoken"]').val()
		alert(token);
		$.ajax({
			cache:false,
			type: "POST",
			// url:"/user/Login_form_post",
			url:"http://127.0.0.1:8000/user/login",
			data:{'username':username, 'pwd': pwd,'csrfmiddlewaretoken':token},
			// data:{'user_name':name},
			// dataType:'json',
			async:true,
			// beforeSend:function(xhr,settings){
			// 	xhr.setRequestHeader("X-CSRFToken", "{{ csrf_token }}");
			// },
			success:function(result){
				// if(data.status == 'success'){
                //         alert("提交成功");
                //          window.location.reload();//刷新当前页面.
                //     }else if(data.status == 'fail'){
                //         alert("评论错误，请重新评论");
				// 	}
				$('#test_error').html("<b>" + result + "</b>");
				alert(result);
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