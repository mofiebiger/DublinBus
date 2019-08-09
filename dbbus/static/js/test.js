function initMap(position){
var map, directionService, directionsDisplay, autoSrc, autoDest, pinA, pinB;


markerA = new google.maps.MarkerImage('marker.png')
              new google.maps.Size(24, 27),
              new google.maps.Point(0, 0),
              new google.maps.Point(12, 27),

markerB = new google.maps.MarkerImage('marker.png'),
              new google.maps.Size(24, 28),
              new google.maps.Point(0, 0),
              new google.maps.Point(12, 28);


// Caching the Selectors
$Selectors = {
    map: jQuery('#map')[0], //good
    directionsPanel: jQuery('#directionsPanel'), //good
    dirInputs: jQuery('.directionInputs'),
    dirSrc: jQuery('#directionsSource'), //good
    dirDst: jQuery('#directionsDestination'), //good
    navBtn: jQuery('#navigateButton'), //good
    directionsSteps: jQuery('#directionsSteps'), //good
    paneToggle: jQuery('#paneToggle'),
    geoButton: jQuery('#geoButton'), //good
    paneResetBtn: jQuery('#paneReset')
};

// https://thewebstorebyg.wordpress.com/2013/01/11/custom-directions-panel-with-google-maps-api-v3/
function autoCompleteSetup(){
    input1 = document.getElementById('directionsSource');
    searchBox1 = new google.maps.places.Autocomplete(input1);
    searchBox1.setComponentRestrictions(
          {'country': ['irl']});

    input2 = document.getElementById('directionsDestination');
    searchBox2 = new google.maps.places.Autocomplete(input2);
    searchBox2.setComponentRestrictions(
          {'country': ['irl']});
} //autoCompleteSetup Ends

directionsSetUp = function(){
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: false
    });
    
  } //directionsSetUp Ends

  function trafficSetup() {
  // Creating a Custom Control and appending it to the map
  var controlDiv = document.createElement('div'),
      controlUI = document.createElement('div'),
      trafficLayer = new google.maps.TrafficLayer();

  jQuery(controlDiv).addClass('gmap-control-container').addClass('gmnoprint');
  jQuery(controlUI).text('Traffic').addClass('gmap-control');
  jQuery(controlDiv).append(controlUI);

  // Traffic Btn Click Event
  google.maps.event.addDomListener(controlUI, 'click', function() {
      if (typeof trafficLayer.getMap() == 'undefined' || trafficLayer.getMap() === null) {
          jQuery(controlUI).addClass('gmap-control-active');
          trafficLayer.setMap(map);
      } else {
          trafficLayer.setMap(null);
          jQuery(controlUI).removeClass('gmap-control-active');
      }
  });
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
} // trafficSetup Ends


  function mapSetUp(){
    map = new google.maps.Map(document.getElementById('map'),{
    //map = new google.maps.Map($Selectors.map, {
          zoom: 13,
          //latitude and longitude of Dublin (Spire)
          center: new google.maps.LatLng(53.3498, -6.2603),
          mapTypeId: google.maps.MapTypeId.ROADMAP,

          mapTypeControl: true,
          mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DEFAULT,
          position: google.maps.ControlPosition.TOP_RIGHT
          },

          panControl: true,
          panControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
          }

    });
    autoCompleteSetup();
    directionsSetUp();
    trafficSetup();
  } //mapSetUp Ends


  DirectionsRenderer = function(source, destination, date, time){

      var request = {
        origin: source,
        destination: destination,
        provideRouteAlternatives: false,
        travelMode: google.maps.DirectionsTravelMode.TRANSIT,
        transitOptions: {
            departureTime: new Date(date+" "+time),
            modes: ['BUS'],
            routingPreference: 'FEWER_TRANSFERS'
          },
      };

      directionsService.route(request, function(response, status){
        if (status == google.maps.DirectionsStatus.OK){
            var show_div = document.getElementById('directionsSteps');

          var _route = response.routes[0].legs[0];
          console.log(_route);
          var aList = new Array();
          for(var i=0; i<_route['steps'].length; i++){
        	  if (_route['steps'][i].travel_mode == "TRANSIT"){
        	  if (_route.steps[i].transit.line.hasOwnProperty("name")){
        		  aList.push({'short_name':_route.steps[i].transit.line.short_name,'num_stops':_route.steps[i].transit.num_stops,'name':_route.steps[i].transit.line.name});
        	  }else{
        		  aList.push({'short_name':_route.steps[i].transit.line.short_name,'num_stops':_route.steps[i].transit.num_stops,'name':_route.steps[i].transit.headsign})
        	  }
        	  }
          }
          var routes ={'routes':aList,'date':date, 'time':time}
          	$.ajax({
          		url:window.location.protocol+"//"+window.location.host+"/prediction/route",
          		type: 'post',
          		headers:{"X-CSRFToken":$("#directionsPanel input[name='csrfmiddlewaretoken']").val()},
          		contentType: 'application/json;charset=UTF-8',
          		dataType:'json',
          		data: JSON.stringify(routes),
          	}).done(function(data){
            	console.log(data);
            	if (data.res == 1){
            		for(var i=0,j=0; i<_route['steps'].length; i++){
                     	  if (_route['steps'][i].travel_mode == "TRANSIT"){
                     		response.routes[0].legs[0].steps[i].duration = data.response_leg[j];
                     		j+=1;
                     	  }

                  	 }

            	}else{
            		alert(data.errmsg);
            	}


//            	console.log(response);
            	for(var i=0;i< marker_list.length;i++){
            		marker_list[i].setMap(null);
            	}
                directionsDisplay.setDirections(response);

                directionsDisplay.setPanel(show_div);
                directionsDisplay.setMap(map);
          	}).fail(function(){
          		alert('ajax false');
          	});
          pinA = new google.maps.Marker({
            position: _route.start_location,
            map: map,
            icon: markerA
          }),

          pinB = new google.maps.Marker({
            position: _route.end_location,
            map: map,
            icon: markerB
          });
          marker_list.push(pinA);
          marker_list.push(pinB);
        }
      });
    } //DirectionsRenderer Ends

    function fetchGeoAddress(position){
      var Locater = new google.maps.Geocoder();
      userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      Locater.geocode({ 'location' : userLatLng }, function(results, status){
          if(status == google.maps.GeocoderStatus.OK){
            var _r = results[0];
            $Selectors.dirSrc.val(_r.formatted_address);
          }
      });
    } //fetchGeoAddress Ends

    function displayCircle(position){
      //var Locater = new google.maps.Geocoder();
      userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(userLatLng);
      console.log(userLatLng.lat);
      console.log(userLatLng.lng);
      //Draw a circle around the user position to have an idea of the current localization accuracy
      var circle = new google.maps.Circle({
          center: userLatLng,
          radius: 1000, //position.coords.accuracy,
          map: map,
          fillColor: '#0000FF',
          fillOpacity: 0.5,
          strokeOpacity: 0,
      });
      map.fitBounds(circle.getBounds());

      // display stops
      $.ajax({
        'async' : 'true',
        'url' : window.location.protocol+"//"+window.location.host+"/prediction/stops_nearby",
//          'url' : '/static/json/stops_info.json',
        'type': 'get',
        'dataType':'json',
        'data':{'lat': userLatLng.lat,'lon': userLatLng.lng,'radius':1},
      }).done(function(stops){
        var obj = stops.stops;
        console.log(obj);
      for (var i = 0; i < obj.length; i++) {
          var stops = obj;
          stops[i] = {'lat': obj[i].stop_lat, 'lng': obj[i].stop_lon};
      }

      // The location of Dubin
      var dublin = {lat: 53.3498, lng: -6.2603};


      var markers = stops.map(function (location, i) {
          return new google.maps.Marker({
              position: location,
              map: map,
              // icon: markerImage,
              // label: labels[i % labels.length]
          });
      });
      var contentString = 'pppp';
      var infowindow = new google.maps.InfoWindow({
          content: ''
      });

      for (var i = 0; i < markers.length; i++) {
          var marker = markers[i];
          // bindInfoWindow(marker, map, infowindow, content_html);
          // marker.addListener('click', function () {
          //     infowindow.open(map, marker);
          // });
          //     // console.log("var markers");
          var markerCluster = new MarkerClusterer(map, markers,
              {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
      }
    });



    }

    function geolocateUser() {
      // If the browser supports the Geolocation API
      if (navigator.geolocation)
      {
        var positionOptions = {
          enableHighAccuracy: true,
          timeout: 10 * 1000 // 10 seconds
        };
        navigator.geolocation.getCurrentPosition(displayCircle, geolocationError, positionOptions);
      }
      else
        document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
    }

    window.onload = geolocateUser;

    // Display if there is an error with the geolocation
    function geolocationError(positionError) {
      document.getElementById("error").innerHTML += "Error: " + positionError.message + "<br/>";
    }


    function fetchTourismAddress(lat, lng){
      tourismLatLng = new google.maps.LatLng(lat, lng);
      var Locate = new google.maps.Geocoder();

      Locate.geocode({ 'location' : tourismLatLng }, function(results, status){
          if(status == google.maps.GeocoderStatus.OK){
            var _r = results[0];
            $Selectors.dirDst.val(_r.formatted_address);
          }
      });
    }//fetchTourismAddress Ends

    function invokeEvents(){
        // Get Directions
        $('#navigateButton').on('click',function(event){
          event.preventDefault();
          var src = $Selectors.dirSrc.val();
          var dst = $Selectors.dirDst.val();
          var date = $('#dateTime-panel #rightNow').val();
          var time = $('#time #time-button').val();

          DirectionsRenderer(src, dst, date, time);
        });

        // Use My Geo Location Btn
        $Selectors.geoButton.on('click', function(e) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    fetchGeoAddress(position);
                });
            }
            else {
                document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
            }
        });
      } //invokeEvents Ends

      mapSetUp();
      invokeEvents();



      // display tourism locations
      function diplayTouristPage(category){
          $.ajax({
            'async' : 'true',
            'url' : '/static/json/tourism_stops.json',
            'type': 'get',
            'dataType':'json',
          }).done(function(obj){

          var display = "";
          for (var i = 0; i < obj.length; i++) {
            if (obj[i].category == category){
                var locationName = obj[i].name;
                var short_description = obj[i].short_description;
                var long_description = obj[i].description;
                var image = obj[i].image;
                var website = obj[i].link;
                var latitude = obj[i].latitude;
                var longitude = obj[i].longitude;

                function on1() {
                  //document.getElementById("overlay1").style.display = "block";
                  $("overlay1").show();
                }
                console.log(fetchTourismAddress(latitude, longitude));

                // Geo Tourism Location Btn
                //$('#tourismNavBtn').on('click', function(e) {

                display += '<h2>' + locationName + '</h2>';
                display += '<p>' + short_description + '</p>';
                display += '<img src ="/static/images/' + image + '"></img>';
                display += '<p>' + long_description + '</p>';
                display += '<form action="' + website + '"><button class="websiteBtn" type="submit">Website</button></form>';
                //display += '<a action="#journeyInfo"><button id="tourismNavBtn" type="submit">Navigate</button></a>';
                display += '<button type="button" class="tourismNavBtn"  data-toggle="navigator tourismPage">Navigate</button>'
                display += '<hr>'
            }
          }
          $("#container").html(display);

          $('.tourismNavBtn').click(function(){
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(latitude, longitude) {
                        fetchTourismAddress(latitude, longitude);
                        $('#nav li').eq(0).click();
                    });
                }
                else {
                    document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
                }


          })
      });
    }

      initStopPage();
      initFavsPage();
      deleteFavourites();
      on8();

      function invokeTourismBtns(){
        $('#tourismNatureBtn').on('click',function(event){
          event.preventDefault();
          diplayTouristPage("Nature")
        });

        $('#tourismMuseumsBtn').on('click',function(event){
          event.preventDefault();
          diplayTouristPage("Museums & Galleries")
        });

        $('#tourismDrinkBtn').on('click',function(event){
          event.preventDefault();
          diplayTouristPage("Breweries")
        });

        $('#tourismLandmarksBtn').on('click',function(event){
          event.preventDefault();
          diplayTouristPage("Landmarks")
        });

        $('#tourismChurchesBtn').on('click',function(event){
          event.preventDefault();
          diplayTouristPage("Churches")
        });
      } //invokeTourismBtns Ends
      invokeTourismBtns();

   function setBusRoute(){
	   
	   $('#busRoute #searchBusRoute').keyup(function(){
		   $(this).removeAttr('name');
		   $.ajax({
			   'async' : 'false',
//			'url' : window.location.protocol+"//"+window.location.host+"/prediction/get_bus_route_info",
			   'url' : '/static/json/bus_route.json',
			   'type': 'get',
			   'dataType':'json',
//			'data':{'bus_number': busNum,'origin': origin,'destination': dest},
		   }).done(function(stop_list){
			   var selectData = "";
			   for (var i = 0; i < stop_list.length; i++) {
				   if(stop_list[i]['route'].search( $('#busRoute #searchBusRoute').val()) != -1){					   
					   selectData += "<li id=\"" + stop_list[i]['route'] +"_" + stop_list[i]['origin'] +"_" + stop_list[i]['destination'] + "\">" + stop_list[i]['route']+ "(" + stop_list[i]['origin'] + "→" + stop_list[i]['destination'] + ")</li>";
			   }}
			   fieldString = "<ul id=\"busSelector\" >" + selectData + "</ul> ";
			   $("#busRoute #researchContent").parent().css("position","relative");
			   $("#busRoute #researchContent").html(fieldString).css({"position":"absolute","height":"100px"}).show();
			   console.log($("#busRoute #searchBusRoute li").css("height"));
			   $("#busRoute #busSelector li").click(function(){
				   $('#busRoute #searchBusRoute').val($(this).html()).attr('name',$(this).attr('id'));
				   
				   $(this).parent().parent().hide();
			   }).css('overflow','hidden');
			   
		   });
		   
	   })
	   
	   function match_left(word,stop_list){
		   for (var i = 0; i < stop_list.length; i++){
			   
		   } 
		   
	   }
		
		
      // display stops along a bus route
      
		$('#searchBus').bind('click',function(){
						var bus_route = $('#busRoute #searchBusRoute').attr('name');
						console.log(bus_route);
						if(typeof(bus_route) == "undefined"){
							return false;
						}else{		
							
							route_list = bus_route.split('_')
							console.log(route_list);
					    		// display stops along a bus route
					    		$.ajax({
					    			'async' : 'true',
					    			'url' : window.location.protocol+"//"+window.location.host+"/prediction/bus_route",
					    			//  'url' : '/static/json/stops_info.json',
					    			'type': 'get',
					    			'dataType':'json',
					    			'data':{'bus_number': route_list[0],'origin': route_list[1],'destination': route_list[2]},
					    		}).done(function(stop_list){
					    			if(stop_list.res == 1){
					    				var obj = stop_list.stops;
					    				console.log(obj);
					    				for (var i = 0; i < obj.length; i++) {
					    					var stops = obj;
					    					stops[i] = {'lat': parseFloat(obj[i]['fields'].stop_lat), 'lng': parseFloat(obj[i]['fields'].stop_lon)};
					    				}
		
					                    directionsDisplay.setMap(null);
					                    directionsDisplay.setMap(map);					    				
					    				
					    				//remove the markers created before
					    				
					    				for(var i=0;i< marker_list.length;i++){
					                		marker_list[i].setMap(null);
					                	}
//					    				var Path = new google.maps.Polyline({
//					    					path: stops,
//					    					geodesic: true,
//					    					strokeColor: '#FF0000',
//					    					strokeOpacity: 1.0,
//					    					strokeWeight: 2
//					    				});
//					    				Path.setMap(map);
//					    				marker_list.push(Path);
					     		
		
					    				var markers = stops.map(function (location, i) {
					    					return new google.maps.Marker({
					    						position: location,
					    						map: map,
					    						// icon: markerImage,
					    						// label: labels[i % labels.length]
					    					});
					    				});
					    			      for (var i = 0; i < markers.length; i++) {
					    			          var marker = markers[i];
					    			          marker_list.push(marker);
					    			          // bindInfoWindow(marker, map, infowindow, content_html);
					    			          // marker.addListener('click', function () {
					    			          //     infowindow.open(map, marker);
					    			          // });
					    			          //     // console.log("var markers");
					    			          // var markerCluster = new MarkerClusterer(map, markers,
					    			          //     {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
					    			      }					    				
					    				
					    			}else{
					    				alert(stop_list.errmsg);
					    			}
					    		});
					    	}
		      	})
      };
      setBusRoute();
		      	

}; //InitMap Ends

var marker_list = new Array();
function fetchStopAddress(lat, lng){
      stopLatLng = new google.maps.LatLng(lat, lng);
      var Locate = new google.maps.Geocoder();

      Locate.geocode({ 'location' : stopLatLng }, function(results, status){
          if(status == google.maps.GeocoderStatus.OK){
            var _r = results[0];
            $Selectors.dirDst.val(_r.formatted_address);
          }
      });
    }//fetchStopAddress Ends

function writeStopsDataset(){
          $.ajax({
          ache:false,
          type: "GET",
          url:window.location.protocol+"//"+window.location.host+'/user/stop_info',
          async:true,
          success:function(result){
              console.log('success writeStopsDataset()');
              for (var i = 0; i < result.length; i++){
                  var stop_data = result[i]['fields'];
                  $('#stop_datalist').append("<option value='"+ stop_data.stop_id +", "+stop_data.stop_name +"' />");
              }
          },
          error: function(){
              alert("false");
          },
      });
      }

function writeStopDetails(){
          var token = $('input[name="csrfmiddlewaretoken"]').val();
          $('#select_stop').on('click', function(){
          $('#addFav').hide();
          $('#removeFav').hide();
          //path selected stop id to bus_info
          $.ajax({
              ache:false,
              type: "POST",
              url:window.location.protocol+"//"+window.location.host+'/user/stop_info',
              data:{'stop_id':$('#search_stop').val().split(",",1)[0],'csrfmiddlewaretoken':token},
              async:true,
              success:function(result){
                  console.log(result);
                  result = result[0]['fields'];
                  // console.log(result[0]['fields']);
                  var content_html="<h2>"+result.stop_name+"</h2>"
                      + "<h3>" + result.stop_id +"</h3>"
                      + "<button class='stopNavBtn' data-toggle='navigator stopPage'>Navigate</button>"
                      + "<input type='text' id='stop_id' value='"+ result.stop_id +"' hidden>"
                      + "<ul class='routesList'>";
                  //delete the qoutes in results
                  var routes = result.stop_routes.toString().replace(/\'/g,"").replace(/\]/g,"").split(",");
                  for (var i =1; i < routes.length; i++){
                      content_html += "<li><a class='"+ routes[i] +"'>"+ routes[i]+"</a></li> "
                  }
                  content_html +="</ul>";
                  content_html +="<div id='test_error'></div>";

                  $('#stop_content').html(content_html);

                  $('.stopNavBtn').on('click', function(){
                        fetchStopAddress(result.stop_lat, result.stop_lon);
          })

                  //get user_favourite_stop
                  //compare with selected stop id
                  //determine which button to show
                  $.ajax({
                        type:"GET",
                        url: window.location.protocol+"//"+window.location.host+'/user/favorite_stop',
                        async: true,
                        success:function(result1){
                            //msg stors the id of the button
                            var msg = "#addFav"
                            for(var i =0; i < result1['user_stop_list'].length; i++){
                                //if the stop id is in the users' favourites list
                                if (result1['user_stop_list'][i] == $('#stop_id').val()){
                                    msg = "#removeFav";
                                    break
                                }
                            }
                            $(msg).show()
                        },
                        error:function(){
                            console.log('show button fail')
                        },
                    });

                  //add on click functions to each bus routes
                  $(".routesList a").each(function(){
                    $(this).click(function(){

                        //post clicked bus id
                        //write bus info
                        $.ajax({
                          ache:false,
                          type: "POST",
                          url:window.location.protocol+"//"+window.location.host+'/user/bus_info',
                          data:{'bus_id':$(this).text(),'csrfmiddlewaretoken':token},
                          async:true,
                          success:function(result1){
                              $('#busid').html(result1);
                              $('#bus_id').val(result1);
                              $('#addFav_bus').hide();
                              $('#removeFav_bus').hide();
                              $('#bus_info').show();

                                //ajax get users' favs buses
                                //compare with clicked bus id
                                //determine which button to be shown
                              $.ajax({
                                type:"GET",
                                url: window.location.protocol+"//"+window.location.host+'/user/favorite_bus_number',
                                async: true,
                                success:function(result2){
                                    var msg = "#addFav_bus";
                                    for(var i =0; i < result2['user_bus_list'].length; i++){
                                        if (result2['user_bus_list'][i]['bus_number'] == $('#bus_id').val().replace(/\s+/g,"")){
                                            msg = "#removeFav_bus"
                                            break
                                        }
                                    }
                                    $(msg).show()
                                },
                                error:function(){
                                    console.log('result2 failed. show button fail')
                                },
                        })
                      },
                      error: function(){
                          alert("result1 failed. post bus info ajax failed");
                        },
                        })
                     })
                  })
              },
              error: function(){
                  alert("result false");
              },
          })
      })
      }

function invokeAddStopBtn(){
          var token = $('input[name="csrfmiddlewaretoken"]').val();
          $('#addFav').on('click',function(){
              var stop_id = $('#stop_id').val();
		        $.ajax({
			        cache:false,
			        type: "POST",
			        url:window.location.protocol+"//"+window.location.host+'/user/favorite_stop',
			        data:{'stop_id':stop_id,'csrfmiddlewaretoken':token},
			        async:true,
			        success:function(result){
			            //change the button displayed
				        $('#addFav').hide();
				        $('#removeFav').show();
			        },
			        error: function(){
				        alert("add failed");
			        },
		        });
	        });
      }

function invokeDeleteStopBtn(){
          var token = $('input[name="csrfmiddlewaretoken"]').val();
          $('#removeFav').on('click',function(){
              var stop_id = $('#stop_id').val();
              $.ajaxSetup({
                  headers:{'X-CSRFToken': token}
              });
		        $.ajax({
			        cache:false,
			        type: "DELETE",
			        url:window.location.protocol+"//"+window.location.host+'/user/favorite_stop',
			        data:{'stop_id':stop_id, 'csrfmiddlewaretoken':token},
			        async:true,
			        success:function(result){
				        $('#addFav').show();
				        $('#removeFav').hide();
			        },
			        error: function(){
				        alert("remove failed" + token);
			        },
		        });
	        });
      }

function invokeAddBusBtn(){
          var token = $('input[name="csrfmiddlewaretoken"]').val();
          $('#addFav_bus').on('click',function(){
                var bus_number = $('#bus_id').val().replace(/\s+/g,"");
                var start = $('#start_point').text();
                var end = $('#end_point').text();
                $.ajax({
                    cache:false,
                    type: "POST",
                    url:window.location.protocol+"//"+window.location.host+"/user/favorite_bus_number",
                    data:{'bus_number':bus_number, 'start_point': start, 'end_point': end,'csrfmiddlewaretoken':token},
                    async:true,
                    success:function(result){
                        $('#addFav_bus').hide();
                        $('#removeFav_bus').show();
                    },
                    error: function(){
                        alert("add failed");
                    },
                });
            });
      }

function invokeDeleteBusBtn(){
        $('#removeFav_bus').on('click',function(){
                var bus_number = $('#bus_id').val().replace(/\s+/g,"");
                var start = $('#start_point').text();
                var end = $('#end_point').text();
                $.ajaxSetup({
                  headers:{'X-CSRFToken': token}
              });
                $.ajax({
                    cache:false,
                    type: "DELETE",
                    url:window.location.protocol+"//"+window.location.host+"/user/favorite_bus_number",
                    data:{'bus_number':bus_number, 'start_point': start, 'end_point': end,'csrfmiddlewaretoken':token},
                    async:true,
                    success:function(result, status, xml){
                        $('#addFav_bus').show();
                        $('#removeFav_bus').hide();
                    },
                    error: function(){
                        alert("delete failed");
                    },
                });
            });
      }

function initStopPage(){

          //write stops dataset
          writeStopsDataset();

          //write details of selected stop
          writeStopDetails();

          //add stop number to favourites
          invokeAddStopBtn();

          //delete from favs
          invokeDeleteStopBtn();

          //add bus number to favourites
          invokeAddBusBtn();

          //delete from favs
          invokeDeleteBusBtn();
      }

function initFavsPage(){
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
            var msg = "";
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
}

function deleteFavourites(){
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
                        alert("remove bus number failed");
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
				        alert("remove stop failed");
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
				        alert("remove route failed");
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

}



    //load  pages
$(document).ready(function(){
      $('#userPage').load('/user/login');
      $('#contactPage').load('/user/contact');
});
// $('#user-trigger').on('click', function(){
//     $('#userPage').load('/user/login');
// })

      // used code from 'https://css-tricks.com/prefilling-date-input/'
      // this is used for a default of todays date
$(function(){
        var today = new Date().toISOString().substr(0, 10);
        $("input[id='rightNow']").attr('value',today);
      });

      // used code from 'https://codepen.io/rafaelcastrocouto/pen/Iyewu'
      // this is used for a default of the exact time
$(function(){
      var d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      if(h < 10) h = '0' + h;
      if(m < 10) m = '0' + m;
      $('input[type="time"]').each(function(){
        $(this).attr({'value': h + ':' + m});
      });
      });


      //splash overlay code comes from: https://www.sitepoint.com/community/t/how-do-you-make-a-javascript-splash-page/44555/3
$.fn.center = function () {
        this.css("position","absolute");
        this.css("top", Math.max(0, (
          ($(window).height() - $(this).outerHeight()) / 2) +
           $(window).scrollTop()) + "px"
        );
        this.css("left", Math.max(0, (
          ($(window).width() - $(this).outerWidth()) / 2) +
           $(window).scrollLeft()) + "px"
        );
        return this;
      }
$("#splash_overlay").show();
$("#splash-content").show().center();

setTimeout(function(){
        $("#splash_overlay").fadeOut();
      }, 2000);


function on8() {
            $.ajax({
              // 'url': "{% url "prediction:weather" %}",
              'url': window.location.protocol+"//"+window.location.host+"/prediction/weather",
              'type': 'get',
              'dataType':'json',
            }).done(function(data_total){
            var data = data_total.currently;
            var data_hourly = data_total.hourly.data;
            var weatherDescription = data.summary;
            displayDescription = ("It Feels Like " + weatherDescription);

            $('#weather_heading').show().html(displayDescription);

            var weatherIcon = data.icon.toUpperCase().split('-');
            weatherIcon = weatherIcon.join('_')
            
            //var weatherIcon = "snow";
            var icons = new Skycons({"color": "white"});
            icons.set("weatherIcon", Skycons[weatherIcon])
              icons.play();

            //converting fahrenheit to celsius
            var temp = Math.round((data.temperature - 32) * 5/9);

            //converting miles to kilometers
            var wind_speed = Math.round(data.windSpeed * 1.609);

            // conversity humidity to a percentage
            var humidity = Math.round(data.humidity * 100);

            // Displaying Temperature
            var displayTemp = ("Current Temperature: " + temp + " oC");

            // Displaying Wind Speed
            var displayWind = ("Wind Speed: " + wind_speed + " kph!");

            // Displaying humidity
            var displayHumidity = ("Humidity: " + humidity + "%");

            //Display Weather Stats on overlay8
            $('#weather_stats').show().html(displayTemp + "<br/>" + displayWind + "<br/>" + displayHumidity);
          for(var i=0;i<data_hourly.length;i++){
              var weatherIcon = data_hourly[i].icon.toUpperCase().split('-');
              weatherIcon = weatherIcon.join('_')
              var icons = new Skycons({"color": "white"});
              $('#weather_hourly').append('<div><p id="weathertime'+i+'"></p><canvas id="weatherIcon'+i+'" width="55" height="55"></canvas><p id="weatherTemp'+i+'"></p></div>')
              icons.set("weatherIcon"+i, Skycons[weatherIcon]);
              icons.play();
              var date = new Date(data_hourly[i]['time'])
              console.log(date)
              $('#weathertime'+i).html(date.getHours())
              $('#weatherTemp'+i).html(Math.round((data_hourly[i].temperature - 32) * 5/9))
              $('#weather_hourly div').css({'float':'left'})
          }
            })
        } // On8: AKA WeatherDisplay Ends

//switch the origi point and destination point
 $(function(){
        	 $('#switch_position').click(function(){
        		 var start_point = $('#directionsSource');
             	var start_point_value =start_point.val();
             	var end_point = $('#directionsDestination');
             	start_point.val(end_point.val());
             	end_point.val(start_point_value);
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
        

		      	
      	
        
  