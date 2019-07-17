$(function(){
    $.ajaxSetup({
                 data: {csrfmiddlewaretoken: '{{ csrf_token }}' },
            });
                  // == 值比较  === 类型比较 $(id) ---->  document.getElementById(id)
    function myFunction(id){
        return typeof id === 'string' ? document.getElementById(id):id;
    }
    // 当页面加载完毕
    window.onload = function(){
        // 拿到所有的标题(li标签) 和 标题对应的内容(div)
        var titles = myFunction('tab-header').getElementsByTagName('li');
        var divs = myFunction('tab-content').getElementsByClassName('dom');
        // 判断
        if(titles.length != divs.length) return;
        // 遍历
        for(var i=0; i<titles.length; i++){
            // 取出li标签
            var li = titles[i];
            li.id = i;
            // 监听鼠标的移动
            li.onmousemove = function(){
                for(var j=0; j<titles.length; j++){
                    titles[j].className = '';
                    divs[j].style.display = 'none';
                }
                this.className = 'selected';
                divs[this.id].style.display = 'block';
            }
        }

        $.ajax({
        type:"GET",
        url: 'http://127.0.0.1:8000/user/favorite_bus_number',
        // data:{'user': user},
        async: true,
        success:function(result){
            var msg = ""
            // console.log(result['user_bus_list'][0]['bus_number'])
            for(var i =0; i < result['user_bus_list'].length; i++){
                // console.log(result['user_stop_list'][i])
                msg += "<li><a href='#'>"+result['user_bus_list'][i]['bus_number']+" from "
                +result['user_bus_list'][i]['start_point']+" to "
                +result['user_bus_list'][i]['end_point']+"</a></li>"
            }
            $('#bus_list').html(msg)
        },
        error:function(){
            console.log('favorite bus number fail')
        },
        })
        $.ajax({
        type:"GET",
        url: 'http://127.0.0.1:8000/user/favorite_stop',
        // data:{'user': user},
        async: true,
        success:function(result){
            var msg = ""
            for(var i =0; i < result['user_stop_list'].length; i++){
                // console.log(result['user_stop_list'][i])
                msg += "<li><a href='#'>"+result['user_stop_list'][i]+"</a></li>"
            }
            // console.log(result['user_stop_list'])
            $('#stop_list').html(msg)
        },
        error:function(){
            console.log('favorite stop fail')
        },
        })

        $.ajax({
        type:"GET",
        url: 'http://127.0.0.1:8000/user/favorite_route',
        // data:{'user': user},
        async: true,
        success:function(result){
            var msg = ""
            for(var i =0; i < result['user_routes_list'].length; i++){
                // console.log(result['user_stop_list'][i])
                // $('#route_list').html("<li><a href='#'>"+result['user_routes_list'][i]+"</a></li>")
                msg += "<li><a href='#'>"+result['user_routes_list'][i]['route_start']+" to "
                    + result['user_routes_list'][i]['route_end'] + "</a></li>"
            }
            $('#route_list').html(msg)
        },
        error:function(){
            console.log('favorite route fail')
        },
        })
    }
    // $('#fav_bus').on('click', function(){
    //     $.ajax({
    //     type:"GET",
    //     url: 'http://127.0.0.1:8000/user/favorite_bus_number',
    //     // data:{'user': user},
    //     async: true,
    //     success:function(result){
    //         console.log(result['user_stop_list'][0]['bus_number'])
    //         for(var i =0; i < result['user_bus_list'].length; i++){
    //             // console.log(result['user_stop_list'][i])
    //             $('#bus_list').html("<li><a href='#'>"+result['user_bus_list'][i]+"</a></li>")
    //         }
    //     },
    //     error:function(){
    //         console.log('favorite bus number fail')
    //     },
    //     })
    // })
    //
    // $('#fav_stop').on('click', function(){
    //     $.ajax({
    //     type:"GET",
    //     url: 'http://127.0.0.1:8000/user/favorite_stop',
    //     // data:{'user': user},
    //     async: true,
    //     success:function(result){
    //         for(var i =0; i < result['user_stop_list'].length; i++){
    //             // console.log(result['user_stop_list'][i])
    //             $('#stop_list').html("<li><a href='#'>"+result['user_stop_list'][i]+"</a></li>")
    //         }
    //         // console.log(result['user_stop_list'])
    //     },
    //     error:function(){
    //         console.log('favorite stop fail')
    //     },
    //     })
    // })
    //
    // $('#fav_route').on('click', function(){
    //     $.ajax({
    //     type:"GET",
    //     url: 'http://127.0.0.1:8000/user/favorite_route',
    //     // data:{'user': user},
    //     async: true,
    //     success:function(result){
    //         for(var i =0; i < result['user_routes_list'].length; i++){
    //             // console.log(result['user_stop_list'][i])
    //             $('#route_list').html("<li><a href='#'>"+result['user_routes_list'][i]+"</a></li>")
    //         }
    //     },
    //     error:function(){
    //         console.log('favorite route fail')
    //     },
    //     })
    // })
})