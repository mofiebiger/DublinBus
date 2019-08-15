$(function(){
    $(document).ready(function(){
        //get bus number
        $.ajax({
        type:"GET",
        url: window.location.protocol+"//"+window.location.host+'/user/favorite_bus_number',
        async: true,
        success:function(result){
            var msg = ""
            for(var i =0; i < result['user_bus_list'].length; i++){
                msg += "<li><a href='#'>"
                    + "<span class='bus_number'>" + result['user_bus_list'][i]['bus_number']+ "</span>"
                    + " from "
                    + "<span class='start_point'>" + result['user_bus_list'][i]['start_point']+ "</span>"
                    + " to "
                    + "<span class='end_point'>" + result['user_bus_list'][i]['end_point'] + "</span>"
                    + "</a><button class='delete_bus_number' hidden>delete</button></li>"
            }
            //write lis to bus_list div
            $('#bus_list').html(msg)
        },
        error:function(){
            console.log('favorite bus number fail')
        },
        })

        //get stop
        $.ajax({
        type:"GET",
        url: window.location.protocol+"//"+window.location.host+'/user/favorite_stop',
        // data:{'user': user},
        async: true,
        success:function(result){
            var msg = ""
            for(var i =0; i < result['user_stop_list'].length; i++){
                msg += "<li><a href='#' id='" + result['user_stop_list'][i] + "'>"
                    +result['user_stop_list'][i]
                    +"</a><button class='delete_stop' hidden>delete</button></li>"
            }
            // write lis tko stop_list div
            $('#stop_list').html(msg)
        },
        error:function(){
            console.log('favorite stop fail')
        },
        })

        //get route
        $.ajax({
        type:"GET",
        url: window.location.protocol+"//"+window.location.host+'/user/favorite_route',
        async: true,
        success:function(result){
            var msg = ""
            for(var i =0; i < result['user_routes_list'].length; i++){
                msg += "<li><a href='#'>"
                    +"<span class='route_start'>"+result['user_routes_list'][i]['route_start']+"</span>"
                    +" to "
                    +"<span class='route_end'>"+ result['user_routes_list'][i]['route_end'] + "</span> "
                    +"</a><button class='delete_route' hidden>delete</button></li>"
            }
            //write lis to #route_list div
            $('#route_list').html(msg)
        },
        error:function(){
            console.log('favorite route fail')
        },
        })
    })

    //store the bus number routes and stops to be deleted
    var deleted_bus_number =[];
    var deleted_stop =[];
    var deleted_route =[];

    $('#delete_favs').on('click', function () {
        //show delete buttons
        $('.delete_bus_number').show();
        $('.delete_route').show();
        $('.delete_stop').show();
        //show save change button hide first delete button
        $('#submit_delete').show();
        $('#delete_favs').hide();

        //hide the deleted bus info and store bus number, start point, end point
        $('.delete_bus_number').on('click', function(){
            $(this).prev().hide();
            $(this).hide();
            deleted_bus_number.push([$(this).prev().children(".bus_number").html(),
                $(this).prev().children(".start_point").html(),
                $(this).prev().children(".end_point").html()]);
            console.log(deleted_bus_number)
        });

        //hide the deleted stop info and store stop id
        $('.delete_stop').on('click', function(){
            $(this).prev().hide();
            $(this).hide();
            deleted_stop.push($(this).prev().attr('id'));
            console.log(deleted_stop);
        });

        //hide the deleted route info and store route start, route end
        $('.delete_route').on('click', function(){
            $(this).prev().hide();
            $(this).hide();
            deleted_route.push([$(this).prev().children(".route_start").html(),
                $(this).prev().children(".route_end").html()]);
            console.log(deleted_route);
        });
    })

    //submit all changes made
    $('#submit_delete').on('click', function(){
        var token = $('input[name="csrfmiddlewaretoken"]').val()

        //delete all buses stored in the array
        $.each(deleted_bus_number, function(index, value){
            $.ajaxSetup({
                  headers:{'X-CSRFToken': token}
              })
                $.ajax({
                    cache:false,
                    type: "DELETE",
                    url:window.location.protocol+"//"+window.location.host+"/user/favorite_bus_number",
                    data:{'bus_number':value[0], 'start_point': value[1], 'end_point': value[2], 'csrfmiddlewaretoken':token},
                    async:true,
                    success:function(result){
                        console.log(result);
                    },
                    error: function(){
                    	swal("remove bus number failed", "Please try it later!", "error");
                    },
                });
        })

        //delete all stops stored in the array
        $.each(deleted_stop, function(index, value){
            $.ajaxSetup({
                  headers:{'X-CSRFToken': token}
              })
		        $.ajax({
			        cache:false,
			        type: "DELETE",
			        url:window.location.protocol+"//"+window.location.host+'/user/favorite_stop',
			        data:{'stop_id':value, 'csrfmiddlewaretoken':token},
			        async:true,
			        success:function(result){
				        console.log(result);
			        },
			        error: function(){
			        	swal("remove stop failed", "Please try it later!", "error");
			        },
		        });
        })

        //delete all routes stored in the array
        $.each(deleted_route, function(index, value){
            $.ajaxSetup({
                  headers:{'X-CSRFToken': token}
              })
		        $.ajax({
			        cache:false,
			        type: "DELETE",
			        url:window.location.protocol+"//"+window.location.host+'/user/favorite_route',
			        data:{'route_start':value[0], 'route_end':value[1], 'csrfmiddlewaretoken':token},
			        async:true,
			        success:function(result){
				        console.log(result);
			        },
			        error: function(){
			        	swal("remove route failed", "Please try it later!", "error");
			        },
		        });
        })

        //hide delete buttons
        $('.delete_bus_number').hide();
        $('.delete_route').hide();
        $('.delete_stop').hide();
        //hide save change button show first hide button
        $('#submit_delete').hide();
        $('#delete_favs').show();
    })
    

})