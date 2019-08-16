    $(document).ready(function(){
//    	register function
        $('#activeEmail').on('click',function(){
        	//post register
        	$.ajax({
        		cache:false,
        		type: "POST",
        		url:window.location.href,
        		headers: {
        			"X-CSRFToken": $('#active_email_div input[name="csrfmiddlewaretoken"]').val()
        		},
        		async:false,
        		success:function(result){
        			if (result.res == 1){
        				swal("Good job", result.success_msg, "success");
    					location.href=window.location.protocol+"//"+window.location.host;

        				
        			}else{	
        				swal("Verification failed", result.error_msg, "error");
        			}
        		},
        		error: function(){
        			swal("Network failed", "Please try it later!", "error");
        		},
        	});
        });
        


})
