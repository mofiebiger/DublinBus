$(function(){

	$.ajaxSetup({
                 data: {csrfmiddlewaretoken: '{{ csrf_token }}' },
            });

	$('#loginBtn').on('click',function(){
		var username = $('#username').val()
		var pwd = $('#pwd').val()

		$.ajax({
			cache:false,
			type: "POST",
			url:"/user/Login_form_post",
			data:{'username':username, 'pwd': pwd},
			// data:{'user_name':name},
			// dataType:'json',
			async:true,
			// beforeSend:function(xhr,settings){
			// 	xhr.setRequestHeader("X-CSRFToken", "{{ csrf_token }}");
			// },
			success:function(result, status, xml){
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


})