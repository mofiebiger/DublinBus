$(function(){
	// var token = $("meta[name='_csrf']").attr("content");
	// var header = $("meta[name='_csrf_header']").attr("content");
	// $(document).ajaxSend(function(e, xhr, options) {
	// 	xhr.setRequestHeader(header, token);
	//
	// });
	// $.ajaxSetup({
    //              data: {csrfmiddlewaretoken: '{% csrf_token %}' },
    //         });

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
				$('#test_error').html("<b>" + result + "</b>");
				alert(result);
			},
			error: function(){
				alert("false");
			},
		});
	});


})