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
          marker_list.push(marker);
          // bindInfoWindow(marker, map, infowindow, content_html);
          // marker.addListener('click', function () {
          //     infowindow.open(map, marker);
          // });
          //     // console.log("var markers");
          // var markerCluster = new MarkerClusterer(map, markers,
          //     {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
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
                display += '<button type="button" class="tourismNavBtn">Navigate</button>'
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
//     $('#tourismNavBtn').on('click',function(event){
//       event.preventDefault();
//       document.getElementById("overlay1").style.display = "block";
// });

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


    //load favouties page
    $(document).ready(function(){
      $('#logIn').load('/user/login');
      $('#favouritesInfo').load('/user/favourites');
      // $('#touristInfo').load('/user/tourism');
      $('#contactInfo').load('/user/contact');
    })

      // used code from 'https://css-tricks.com/prefilling-date-input/'
      // this is used for a default of todays date
      $(function(){
        var today = new Date().toISOString().substr(0, 10);
        $("input[id='rightNow']").attr('value',today);
      })

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

      // Meihan is will potentially use this function for favourites page
      // $(document).ready(function(){#}
      //     $('#side_div').load('/user/test');#}
      // })

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
//              switch(weatherIcon){
//                case "clear-day":
//                  icons.set("weatherIcon", Skycons.CLEAR_DAY);
//                  break;
//                case "clear-night":
//                  icons.set("weatherIcon-night", Skycons.CLEAR_NIGHT);
//                  break;
//                case "partly-cloudy-day":
//                  icons.set("weatherIcon", Skycons.PARTLY_CLOUDY_DAY);
//                  break;
//                case "partly-cloudy-night":
//                  icons.set("weatherIcon", Skycons.PARTLY_CLOUDY_NIGHT);
//                  break;
//                case "cloudy":
//                  icons.set("weatherIcon", Skycons.CLOUDY);
//                  break;
//                case "rain":
//                  icons.set("weatherIcon", Skycons.RAIN);
//                  break;
//                case "sleet":
//                  icons.set("weatherIcon", Skycons.SLEET);
//                  break;
//                case "snow":
//                  icons.set("weatherIcon", Skycons.SNOW);
//                  break;
//                case "wind":
//                  icons.set("weatherIcon", Skycons.WIND);
//                  break;
//                case "fog":
//                  icons.set("weatherIcon", Skycons.FOG);
//                  break;
//              }
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
        

		      	
      	
        
