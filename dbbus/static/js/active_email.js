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
        				alert(result.success_msg)
    					location.href=window.location.protocol+"//"+window.location.host;

        				
        			}else{	
        				alert(result.error_msg)
        			}
        		},
        		error: function(){
        			alert("Network problem!");
        		},
        	});
        });
        


})
