var map, directionService, directionsDisplay, autoSrc, autoDest, pinA, pinB, markerCluster, circle;

var marker_list = [];
var oldfeed = "TEST";




function initMap(position) {

    // repeatedy refresh the traffic feed
    TrafficFeed();
    setInterval(() => TrafficFeed(), 600000);

    markerA =
    new google.maps.Size(24, 27),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 27),

        markerB =
        new google.maps.Size(24, 28),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 28);

    var content_html = '';
    var infowindow = new google.maps.InfoWindow({
        content: '',
    });

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
    function autoCompleteSetup() {
        input1 = document.getElementById('directionsSource');
        searchBox1 = new google.maps.places.Autocomplete(input1);
        searchBox1.setComponentRestrictions({
            'country': ['irl']
        });

        input2 = document.getElementById('directionsDestination');
        searchBox2 = new google.maps.places.Autocomplete(input2);
        searchBox2.setComponentRestrictions({
            'country': ['irl']
        });
    } //autoCompleteSetup Ends

    directionsSetUp = function () {
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
        google.maps.event.addDomListener(controlUI, 'click', function () {
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


    function mapSetUp() {
        map = new google.maps.Map(document.getElementById('map'), {
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
    
    

    DirectionsRenderer = function (source, destination, date, time) {

        var request = {
            origin: source,
            destination: destination,
            provideRouteAlternatives: false,
            travelMode: google.maps.DirectionsTravelMode.TRANSIT,
            transitOptions: {
                departureTime: new Date(date + " " + time),
                modes: ['BUS'],
                routingPreference: 'FEWER_TRANSFERS' //FEWER_TRANSFER' and LESS_WALKING
            },
        };
        // show the route
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {

                var show_div = document.getElementById('directionsSteps');
                var _route = response.routes[0].legs[0];
                console.log(_route);
                var aList = new Array();
                for (var i = 0; i < _route['steps'].length; i++) {
                    if (_route['steps'][i].travel_mode == "TRANSIT") {
                        if (_route.steps[i].transit.line.hasOwnProperty("name")) {
                            aList.push({
                                'short_name': _route.steps[i].transit.line.short_name,
                                'num_stops': _route.steps[i].transit.num_stops,
                                'name': _route.steps[i].transit.line.name,
                                'departure_stop_lat':_route['steps'][i].transit.departure_stop.location.lat(),
                                'departure_stop_lon':_route['steps'][i].transit.departure_stop.location.lng(),
                                'arrival_stop_lat':_route['steps'][i].transit.arrival_stop.location.lat(),
                                'arrival_stop_lon':_route['steps'][i].transit.arrival_stop.location.lng(),
                            });
                        } else {
                            aList.push({
                                'short_name': _route.steps[i].transit.line.short_name,
                                'num_stops': _route.steps[i].transit.num_stops,
                                'name': _route.steps[i].transit.headsign,
                                'departure_stop_lat':_route['steps'][i].transit.departure_stop.location.lat(),
                                'departure_stop_lon':_route['steps'][i].transit.departure_stop.location.lng(),
                                'arrival_stop_lat':_route['steps'][i].transit.arrival_stop.location.lat(),
                                'arrival_stop_lon':_route['steps'][i].transit.arrival_stop.location.lng(),
                            })
                        }
                    }
                }
                var routes = {
                    'routes': aList,
                    'date': date,
                    'time': time
                }
                $.ajax({
                    url: window.location.protocol + "//" + window.location.host + "/prediction/route",
                    type: 'post',
                    headers: {
                        "X-CSRFToken": $("#directionsPanel input[name='csrfmiddlewaretoken']").val()
                    },
                    contentType: 'application/json;charset=UTF-8',
                    dataType: 'json',
                    data: JSON.stringify(routes),
                }).done(function (data) {
                    console.log(data);
                    if (data.res == 1) {
                        var total_time = 0;
                        for (var i = 0, j = 0; i < _route['steps'].length; i++) {
                            if (_route['steps'][i].travel_mode == "TRANSIT") {
                                if (data.response_leg[j].text != "" && data.response_leg[j].value != 0) {
                                    response.routes[0].legs[0].steps[i].duration = data.response_leg[j];
                                }
                                j += 1;
                            }
                            total_time += _route['steps'][i]['duration'].value;
                        }
                        response.routes[0].legs[0].duration.value = total_time;
                        response.routes[0].legs[0].duration.text = Math.round(total_time / 60) + 'mins';

                    }
                    // remove the points shown in the previous step
                    deleteMarkers()
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setPanel(show_div);
                    directionsDisplay.setMap(map);
                }).fail(function () {
                    swal("Network fail!", "Please try it later!", "error");
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


    function fetchGeoAddress(position) {
        var Locater = new google.maps.Geocoder();
        userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        Locater.geocode({
            'location': userLatLng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var _r = results[0];
                $Selectors.dirSrc.val(_r.formatted_address);
            }
        });
    } //fetchGeoAddress Ends

    function bindInfoWindow(marker, map, infoWindow, html) {
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent(html);
            infoWindow.open(map, marker);
        });

    }


    function displayCircle(position) {
        //var Locater = new google.maps.Geocoder();
        userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //Draw a circle around the user position to have an idea of the current localization accuracy

        // marker = new google.maps.marker({
        //     position: userLatLng,
        //     icon: "/static/images/transparent_Circle_Marker.png",
        //     map:map,
        // });
        circle = new google.maps.Circle({
            // center: {lat: 53.3498, lng: -6.2603},
            center: userLatLng,
            radius: 1000, //position.coords.accuracy,
            map: map,
            fillColor: '#1a7bba',
            fillOpacity: 0.25,
            strokeOpacity: 0,
        });
        //   map.fitBounds(circle.getBounds());
        map.setCenter(userLatLng);

        // display stops
        $.ajax({
            'async': 'true',
            'url': window.location.protocol + "//" + window.location.host + "/prediction/stops_nearby",
            'type': 'get',
            'dataType': 'json',
            // 'data':{'lat': 53.3498,'lon': -6.2603,'radius':1},
            'data': {
                'lat': userLatLng.lat,
                'lon': userLatLng.lng,
                'radius': 1
            },
        }).done(function (result) {
            var obj = result.stops;
            // The location of Dubin
            var dublin = {
                lat: 53.3498,
                lng: -6.2603
            };
            if (obj.length === 0) {
                swal("No stops!", "There is no Dublin bus stop nearby.", "warning");
            } else {
                var stops = [];
                var stop_content = [];
                for (var i = 0; i < obj.length; i++) {

                    stops[i] = {
                        'lat': parseFloat(obj[i].stop_lat),
                        'lng': parseFloat(obj[i].stop_lon)
                    };
                    stop_content[i] = {
                        'id': obj[i].id,
                        'stop_id': obj[i].stop_id,
                        'stop_name': obj[i].stop_name
                    };
                }

                var markers = stops.map(function (location, i) {
                    return new google.maps.Marker({
                        position: location,
                        map: map,
                        // icon: markerImage,
                    });
                });


                for (var i = 0; i < markers.length; i++) {
                    var marker = markers[i];
                    marker_list.push(marker);
                    content_html = "<h3>" + stop_content[i].stop_id + "</h3>" +
                        "<h4>" + stop_content[i].stop_name + "</h4>" +
                        "<button class='markerNavBtn' data-toggle='navigator' onclick='fetchMarkerAddress(" + stops[i].lat + "," + stops[i].lng + ")'>Navigate</button>" +
                        "<button class='toStopPage' data-toggle='stopPage' onclick='seeStopDetail(" + stop_content[i].stop_id + ")'>See Details</button>";
                    bindInfoWindow(marker, map, infowindow, content_html);
                }



                markerCluster = new MarkerClusterer(map, markers, {
                    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                });
            }

        });
    }

    function geolocateUser() {
        // If the browser supports the Geolocation API
        if (navigator.geolocation) {
            var positionOptions = {
                enableHighAccuracy: true,
                timeout: 10 * 1000 // 10 seconds
            };
            navigator.geolocation.getCurrentPosition(displayCircle, geolocationError, positionOptions);
        } else
            document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
    }

    window.onload = geolocateUser;

    // Display if there is an error with the geolocation
    function geolocationError(positionError) {
        document.getElementById("error").innerHTML += "Error: " + positionError.message + "<br/>";
    }


    function fetchTourismAddress(lat, lng) {
        tourismLatLng = new google.maps.LatLng(lat, lng);
        var Locate = new google.maps.Geocoder();

        Locate.geocode({
            'location': tourismLatLng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var _r = results[0];
                $Selectors.dirDst.val(_r.formatted_address);
            }
        });
    } //fetchTourismAddress Ends

    function invokeEvents() {
        // Get Directions
        $('#navigateButton').on('click', function (event) {
            event.preventDefault();
            var src = $Selectors.dirSrc.val();
            var dst = $Selectors.dirDst.val();
            var date = $('#dateTime-panel #rightNow').val();
            var time = $('#time #time-button').val();

            DirectionsRenderer(src, dst, date, time);
        });

        // Use My Geo Location Btn
        $Selectors.geoButton.on('click', function (e) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    fetchGeoAddress(position);
                });
            } else {
                document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
            }
        });
    } //invokeEvents Ends

    mapSetUp();
    invokeEvents();

    // display tourism locations
    function diplayTouristPage(category) {
        $.ajax({
            'async': 'true',
            'url': '/static/json/tourism_stops.json',
            'type': 'get',
            'dataType': 'json',
        }).done(function (obj) {

            var display = "";
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].category == category) {
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

                    // Geo Tourism Location Btn
                    //$('#tourismNavBtn').on('click', function(e) {

                    display += '<h2 style="color:#e5e5e5">' + locationName + '</h2>';
                    display += '<p style="color:#e5e5e5">' + short_description + '</p>';
                    display += '<img src ="/static/images/' + image + '" style="width: 300px"></img>';
                    display += '<p style="color:#e5e5e5">' + long_description + '</p>';
                    display += '<form action="' + website + '"><button class="websiteBtn" type="submit">Website</button></form>';
                    //display += '<a action="#journeyInfo"><button id="tourismNavBtn" type="submit">Navigate</button></a>';
                    display += '<button type="button" class="tourismNavBtn"  data-toggle="navigator tourismPage">Navigate</button>'
                    display += '<hr>'
                }
            }
            $("#container").html(display);

            $('.tourismNavBtn').click(function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (latitude, longitude) {
                        fetchTourismAddress(latitude, longitude);
                    });
                } else {
                    document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
                }


            })
        });
    }

    initStopPage();
    initFavsPage();
    // deleteFavourites();


    on8();

    function invokeTourismBtns() {
        $('#tourismNatureBtn').on('click', function (event) {
            event.preventDefault();
            diplayTouristPage("Nature")
        });

        $('#tourismMuseumsBtn').on('click', function (event) {
            event.preventDefault();
            diplayTouristPage("Museums & Galleries")
        });

        $('#tourismDrinkBtn').on('click', function (event) {
            event.preventDefault();
            diplayTouristPage("Breweries")
        });

        $('#tourismLandmarksBtn').on('click', function (event) {
            event.preventDefault();
            diplayTouristPage("Landmarks")
        });

        $('#tourismChurchesBtn').on('click', function (event) {
            event.preventDefault();
            diplayTouristPage("Churches")
        });
    } //invokeTourismBtns Ends
    invokeTourismBtns();

    function setBusRoute() {
        $.ajax({
            'async': 'false',
            'url': '/static/json/bus_route.json',
            'type': 'get',
            'dataType': 'json',
        }).done(function (stop_data) {
            for (var i = 0; i < stop_data.length; i++) {
                $('#bus_datalist').append("<option value=\"" + stop_data[i].route + "," + stop_data[i].origin + "," + stop_data[i].destination + "\" />");
            }
        });

        // display stops along a bus route
        $('#searchBus').bind('click', function () {
            var bus_route = $('#busRoute #searchBusRoute').val();
            if (typeof (bus_route) == "undefined") {
                alert("Please enter valid bus information.")
            } else {
                route_list = bus_route.split(',');

                // display stops along a bus route
                $.ajax({
                    'async': 'true',
                    'url': window.location.protocol + "//" + window.location.host + "/prediction/bus_route",
                    'type': 'get',
                    'dataType': 'json',
                    'data': {
                        'bus_number': route_list[0],
                        'origin': route_list[1],
                        'destination': route_list[2]
                    },
                }).done(function (stop_list) {
                    if (stop_list.res == 1) {
                        var obj = stop_list.stops;
                        var stops = [];
                        var stop_content = [];
                        for (var i = 0; i < obj.length; i++) {
                            stops[i] = {
                                'lat': parseFloat(obj[i]['fields'].stop_lat),
                                'lng': parseFloat(obj[i]['fields'].stop_lon)
                            };
                            stop_content[i] = {
                                'id': obj[i]['fields'].id,
                                'stop_id': obj[i]['fields'].stop_id,
                                'stop_name': obj[i]['fields'].stop_name
                            };
                        }

                        directionsDisplay.setMap(null);

                        if (marker_list.length != 0) {

                            //remove the markers created before
                            deleteMarkers();
                        }
                        var lineSymbol = {
                        	    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        	    scale: 5,
                        	    strokeColor: '#1a7bba'
                        	  };
                                             var Path = new google.maps.Polyline({
                         					    					path: stops,
                         					    				    icons: [{
                         					    				       icon: lineSymbol,
                         					    				       offset: '100%'
                         					    				     }],
                         					    					geodesic: true,
                         					    					strokeColor: '#00BBFF',
                         					    					strokeOpacity: 1.0,
                         					    					strokeWeight: 5
                         					    				});
                                             Path.setMap(map);
                                             marker_list.push(Path);

                         map.setCenter(stops[0]);
                        var markers = stops.map(function (location, i) {
                            return new google.maps.Marker({
                                position: location,
                                map: map,
                            });
                        });
                        animateCircle(Path)
                        for (var i = 0; i < markers.length; i++) {
                            var marker = markers[i];
                            marker_list.push(marker);
                            content_html = "<h3>" + stop_content[i].stop_id + "</h3>" +
                                "<h4>" + stop_content[i].stop_name + "</h4>" +
                                "<button class='markerNavBtn' data-toggle='navigator' onclick='fetchMarkerAddress(" + stops[i].lat + "," + stops[i].lng + ")'>Navigate</button>" +
                                "<button class='toStopPage' data-toggle='stopPage' onclick='seeStopDetail(" + stop_content[i].stop_id + ")'>See Details</button>";
                            bindInfoWindow(marker, map, infowindow, content_html);
                        }
                        displayBusDetail();
                        invokeBusDetail();


                    } else {
                        swal(stop_list.errmsg, "error");
                    }
                });

                // invokeBusDetail();

            }
        })
    }
    setBusRoute();

    function animateCircle(line) {
        var count = 0;
        window.setInterval(function() {
          count = (count + 1) % 200;

          var icons = line.get('icons');
          icons[0].offset = (count / 2) + '%';
          line.set('icons', icons);
      }, 50);
    }


    invokeAddRoutesBtn();
    initAddFavRoutes();
    invokeDeleteRoutesBtn();


}; //InitMap Ends

var marker_list = new Array();

function initAddFavRoutes() {
    //get user_favourite_stop
    //compare with selected stop id
    //determine which button to show
    $.ajax({
        type: "GET",
        url: window.location.protocol + "//" + window.location.host + '/user/favorite_route',
        async: true,
        success: function (route_result) {
            if (route_result.res == 1) {
                var msg = "#addFav_route";
                for (var i = 0; i < route_result['user_routes_list'].length; i++) {
                    //if the stop id is in the users' favourites list
                    if ((route_result.user_routes_list[i].route_start == $('#directionsSource').val()) && (route_result.user_routes_list[i].route_end == $('#directionsDestination').val())) {
                        msg = "#removeFav.route";
                        break
                    }
                }
                $(msg).show()
            } else {
                $('.login-required').show();
            }
        },
        error: function () {
            alert("Oops, something wrong, please try again.");
            console.log('show button fail')
        },
    });
}

function invokeAddRoutesBtn() {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#addFav_route').on('click', function () {
        var route_start = $('#directionsSource').val();
        var route_end = $('#directionsDestination').val();
        if ((route_start == route_end) || (route_start == "") || (route_end == "")) {
            alert("Please enter valid departure and destination.");
        } else {
            $.ajax({
                cache: false,
                type: "POST",
                url: window.location.protocol + "//" + window.location.host + '/user/favorite_route',
                data: {
                    'route_start': route_start,
                    'route_end': route_end,
                    'csrfmiddlewaretoken': token
                },
                async: true,
                success: function (add_route_result) {
                    if (add_route_result.res == 1) {
                        //change the button displayed
                        $('#addFav_route').hide();
                        $('#removeFav_route').show();
                    } else if (add_route_result.res == 0) {
                        alert(add_route_result.error_msg)
                    } else {
                        alert("Oops, something wring, please try again.")
                    }
                },
                error: function () {
                    alert("Oops, something wring, please try again.")
                },
            });
        }
    });

}

function invokeDeleteRoutesBtn() {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#removeFav_route').on('click', function () {
        var route_start = $('#directionsSource').val();
        var route_end = $('#directionsDestination').val();
        $.ajaxSetup({
            headers: {
                'X-CSRFToken': token
            }
        });
        $.ajax({
            cache: false,
            type: "DELETE",
            url: window.location.protocol + "//" + window.location.host + '/user/favorite_route',
            data: {
                'route_start': route_start,
                'route_end': route_end,
                'csrfmiddlewaretoken': token
            },
            async: true,
            success: function (delete_route_result) {
                if (delete_route_result.res == 1) {
                    //change the button displayed
                    $('#addFav_route').show();
                    $('#removeFav_route').hide();
                } else if (delete_route_result.res == 0) {
                    alert(delete_route_result.error_msg)
                } else {
                    alert("Oops, something wring, please try again.")
                }
            },
            error: function () {
                alert("Oops, something wring, please try again.");
            },
        });
    });
}

function displayBusDetail() {
    $('#search-bus-id').html(route_list[0]);
    $('#bus-departure').html(route_list[1]);
    $('#bus-destination').html(route_list[2]);
    $('.bus-details').attr("style", "display:block;");
    $('#addFav_bus').hide();
    $('#removeFav_bus').hide();
    //ajax get users' favs buses
    // compare with clicked bus id
    //determine which button to be shown
    $.ajax({
        type: "GET",
        url: window.location.protocol + "//" + window.location.host + '/user/favorite_bus_number',
        async: true,
        success: function (result2) {
            if (result2.res == 1) {
                var msg = "#addFav_bus";
                for (var i = 0; i < result2['user_bus_list'].length; i++) {
                    if (result2['user_bus_list'][i]['bus_number'] == route_list[0].replace(/\s+/g, "")) {
                        msg = "#removeFav_bus"
                        break
                    }
                }
                $(msg).show()
            } else {
                $('.login-required').show();
            }
        },
        error: function () {
            console.log('result2 failed. show button fail')
        },
    });
}

function fetchMarkerAddress(lat, lng) {
    markerLatLng = new google.maps.LatLng(lat, lng);
    var Locate = new google.maps.Geocoder();


    Locate.geocode({
        'location': markerLatLng
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var _r = results[0];
            $Selectors.dirDst.val(_r.formatted_address);
        }
    });
    console.log("fetch marker address end")
} //fetchStopAddress Ends

function fetchStopAddress(lat, lng) {
    stopLatLng = new google.maps.LatLng(lat, lng);
    var Locate = new google.maps.Geocoder();

    Locate.geocode({
        'location': stopLatLng
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var _r = results[0];
            $Selectors.dirDst.val(_r.formatted_address);
        }
    });
} //fetchStopAddress Ends

function writeStopsDataset() {
    $.ajax({
        ache: false,
        type: "GET",
        url: window.location.protocol + "//" + window.location.host + '/user/stop_info',
        async: true,
        success: function (result) {
            for (var i = 0; i < result.length; i++) {
                var stop_data = result[i]['fields'];
                $('#stop_datalist').append("<option value=\"" + stop_data.stop_id + ", " + stop_data.stop_name + "\" />");
            }
        },
        error: function () {
            swal("Network fail!", "Please try it later!", "error");
        },
    });
}

function writeStopDetails() {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#select_stop').on('click', function () {
        $('#addFav').hide();
        $('#removeFav').hide();
        //path selected stop id to bus_info
        $.ajax({
            ache: false,
            type: "POST",
            url: window.location.protocol + "//" + window.location.host + '/user/stop_info',
            data: {
                'stop_id': $('#search_stop').val().split(",", 1)[0],
                'csrfmiddlewaretoken': token
            },
            async: true,
            success: function (result) {
                if (result.res == 1) {
                    result = result.json_data[0]['fields'];
                    var content_html = "<h2>" + result.stop_name + "</h2>" +
                        "<h3>" + result.stop_id + "</h3>" +
                        "<button class='stopNavBtn' data-toggle='navigator stopPage'>Navigate</button>" +
                        "<input type='text' id='stop_id' value='" + result.stop_id + "' style='display: none'>";
                    content_html += "<div id='test_error'></div>";

                    $('#stop_content').html(content_html);

                    $('.stopNavBtn').on('click', function () {
                        fetchStopAddress(result.stop_lat, result.stop_lon);
                    });

                    //get user_favourite_stop
                    //compare with selected stop id
                    //determine which button to show
                    $.ajax({
                        type: "GET",
                        url: window.location.protocol + "//" + window.location.host + '/user/favorite_stop',
                        async: true,
                        success: function (result1) {
                            if (result1.res == 1) {
                                var msg = "#addFav";
                                for (var i = 0; i < result1['user_stop_list'].length; i++) {
                                    //if the stop id is in the users' favourites list
                                    if (result1['user_stop_list'][i] == $('#stop_id').val()) {
                                        msg = "#removeFav";
                                        break
                                    }
                                }
                                $(msg).show()
                            } else {
                                $('.login-required').show();
                            }
                        },
                        error: function () {
                            alert("Oops, something wrong, please try again.");
                            console.log('show button fail')
                        },
                    });
                } else {
                    alert(result.error_msg)
                }
            },
            error: function () {
                swal("Network fail!", "Please try it later!", "error");
            },
        })
        Generate_Graph();
    })
}

function invokeAddStopBtn() {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#addFav').on('click', function () {
        var stop_id = $('#stop_id').val();
        $.ajax({
            cache: false,
            type: "POST",
            url: window.location.protocol + "//" + window.location.host + '/user/favorite_stop',
            data: {
                'stop_id': stop_id,
                'csrfmiddlewaretoken': token
            },
            async: true,
            success: function (result) {
                //change the button displayed
                $('#addFav').hide();
                $('#removeFav').show();
            },
            error: function () {
                swal("Added fail!", "Please try it later!", "error");
            },
        });
    });
}

function invokeDeleteStopBtn() {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#removeFav').on('click', function () {
        var stop_id = $('#stop_id').val();
        $.ajaxSetup({
            headers: {
                'X-CSRFToken': token
            }
        });
        $.ajax({
            cache: false,
            type: "DELETE",
            url: window.location.protocol + "//" + window.location.host + '/user/favorite_stop',
            data: {
                'stop_id': stop_id,
                'csrfmiddlewaretoken': token
            },
            async: true,
            success: function (result) {
                $('#addFav').show();
                $('#removeFav').hide();
            },
            error: function () {
                swal("Remove failed!", "Please try it later!", "error");
            },
        });
    });
}

function invokeAddBusBtn() {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#addFav_bus').on('click', function () {
        var bus_number = $('#search-bus-id').html();
        // var bus_number = $('#search-bus-id').val().replace(/\s+/g,"");
        var start = $('#bus-departure').text();
        var end = $('#bus-destination').text();
        $.ajax({
            cache: false,
            type: "POST",
            url: window.location.protocol + "//" + window.location.host + "/user/favorite_bus_number",
            data: {
                'bus_number': bus_number,
                'start_point': start,
                'end_point': end,
                'csrfmiddlewaretoken': token
            },
            async: true,
            success: function (result) {
                $('#addFav_bus').hide();
                $('#removeFav_bus').show();
            },
            error: function () {
                swal("Add failed!", "Please try it later!", "error");
            },

        });

        //get user_favourite_stop
        //compare with selected stop id
        //determine which button to show
        $.ajax({
            type: "GET",
            url: window.location.protocol + "//" + window.location.host + '/user/favorite_stop',
            async: true,
            success: function (result1) {
                //msg stors the id of the button
                // var msg = "#addFav";
                if (result1.res == 1) {
                    var msg = "#addFav";
                    for (var i = 0; i < result1['user_stop_list'].length; i++) {
                        //if the stop id is in the users' favourites list
                        if (result1['user_stop_list'][i] == $('#stop_id').val()) {
                            msg = "#removeFav";
                            break
                        }
                    }
                    $(msg).show()
                } else {
                    $('.login-required').show();
                }
            },
            error: function () {
                swal("Network fail!", "Please try it later!", "error");
            },
        });
    });
};

function invokeAddStopBtn() {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#addFav').on('click', function () {
        var stop_id = $('#stop_id').val();
        $.ajax({
            cache: false,
            type: "POST",
            url: window.location.protocol + "//" + window.location.host + '/user/favorite_stop',
            data: {
                'stop_id': stop_id,
                'csrfmiddlewaretoken': token
            },
            async: true,
            success: function (result) {
                //change the button displayed
                $('#addFav').hide();
                $('#removeFav').show();
            },
            error: function () {
                swal("Added fail!", "Please try it later!", "error");
            },
        });
    });
}

function invokeDeleteStopBtn() {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#removeFav').on('click', function () {
        var stop_id = $('#stop_id').val();
        $.ajaxSetup({
            headers: {
                'X-CSRFToken': token
            }
        });
        $.ajax({
            cache: false,
            type: "DELETE",
            url: window.location.protocol + "//" + window.location.host + '/user/favorite_stop',
            data: {
                'stop_id': stop_id,
                'csrfmiddlewaretoken': token
            },
            async: true,
            success: function (result) {
                $('#addFav').show();
                $('#removeFav').hide();
            },
            error: function () {
                swal("Remove failed!", "Please try it later!", "error");
            },
        });
    });
}

function invokeAddBusBtn() {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#addFav_bus').on('click', function () {
        var bus_number = $('#search-bus-id').html();
        // var bus_number = $('#search-bus-id').val().replace(/\s+/g,"");
        var start = $('#bus-departure').text();
        var end = $('#bus-destination').text();
        $.ajax({
            cache: false,
            type: "POST",
            url: window.location.protocol + "//" + window.location.host + "/user/favorite_bus_number",
            data: {
                'bus_number': bus_number,
                'start_point': start,
                'end_point': end,
                'csrfmiddlewaretoken': token
            },
            async: true,
            success: function (result) {
                $('#addFav_bus').hide();
                $('#removeFav_bus').show();
            },
            error: function () {
                swal("Add failed!", "Please try it later!", "error");
            },
        });
    });
}

function invokeDeleteBusBtn() {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#removeFav_bus').on('click', function () {
        var bus_number = $('#search-bus-id').html();
        // var bus_number = $('#search-bus-id').val().replace(/\s+/g,"");
        var start = $('#bus-departure').text();
        var end = $('#bus-destination').text();
        $.ajaxSetup({
            headers: {
                'X-CSRFToken': token
            }
        });
        $.ajax({
            cache: false,
            type: "DELETE",
            url: window.location.protocol + "//" + window.location.host + "/user/favorite_bus_number",
            data: {
                'bus_number': bus_number,
                'start_point': start,
                'end_point': end,
                'csrfmiddlewaretoken': token
            },
            async: true,
            success: function (result, status, xml) {
                $('#addFav_bus').show();
                $('#removeFav_bus').hide();
            },
            error: function () {
                swal("delete failed!", "Please try it later!", "error");
            },
        });
    });
}

function initStopPage() {

    //write stops dataset
    writeStopsDataset();

    //write details of selected stop
    writeStopDetails();

    //add stop number to favourites
    invokeAddStopBtn();

    //delete from favs
    invokeDeleteStopBtn();

    //add bus number to favourites
    // invokeAddBusBtn();
    //
    // //delete from favs
    // invokeDeleteBusBtn();
}

function initFavsPage() {
    //get bus number
    $.ajax({
        type: "GET",
        url: window.location.protocol + "//" + window.location.host + '/user/favorite_bus_number',
        async: true,
        success: function (result) {
            var msg = "";
            if (result.res == 1) {
                for (var i = 0; i < result['user_bus_list'].length; i++) {
                    msg += "<li><a href='#'>" +
                        "<span class='bus_number'>" + result['user_bus_list'][i]['bus_number'] + "</span>&nbsp;&nbsp;&nbsp;&nbsp;</a><button class='delete_bus_number' hidden>delete</button><br>" +
                        " <span class='start_end'>" +
                        "<span class='start_point'>" + result['user_bus_list'][i]['start_point'] + "</span>&nbsp;&nbsp;" +
                        "<i class=\"fa fa-arrow-circle-right\"></i>&nbsp;&nbsp;" +
                        "<span class='end_point'>" + result['user_bus_list'][i]['end_point'] + "</span></span> " +
                        "<hr></li>"
                }

            } else {
                msg = "";
            }


            //write lis to bus_list div
            $('#bus_list').html(msg)
        },
        error: function () {
            console.log('favorite bus number fail')
        },
    })
    //get stop
    $.ajax({
        type: "GET",
        url: window.location.protocol + "//" + window.location.host + '/user/favorite_stop',
        async: true,
        success: function (fav_result) {
            var msg = "";
            if (fav_result.res == 1) {
                for (var i = 0; i < fav_result['user_stop_list'].length; i++) {

                    msg += "<li><a href='#' id='" + fav_result['user_stop_list'][i] + "' onclick='seeStopDetail(" + fav_result['user_stop_list'][i] + ")' data-toggle='stopPage favsPage'>" +
                        fav_result['user_stop_list'][i] +
                        "</a><button class='delete_stop' hidden>delete</button></li>"

                }
            } else {
                msg = "";
            }

            // write lis tko stop_list div
            $('#stop_list').html(msg)
        },
        error: function () {
            console.log('favorite stop fail')
        },
    })
    //get route
    $.ajax({
        type: "GET",
        url: window.location.protocol + "//" + window.location.host + '/user/favorite_route',
        async: true,
        success: function (result) {
            var msg = "";
            if (result.res == 1) {
                for (var i = 0; i < result['user_routes_list'].length; i++) {
                    msg += "<li><a href='#'>" +
                        "<span class='route_start'>" + result['user_routes_list'][i]['route_start'] + "</span><br>" +
                        "<i class=\"fa fa-arrow-circle-down\"></i><br>" +
                        "<span class='route_end'>" + result['user_routes_list'][i]['route_end'] + "</span><br> " +
                        "</a><button class='delete_route' hidden>delete</button></li><hr>"

                }
            } else {
                msg = "";
            }
            //write lis to #route_list div
            $('#route_list').html(msg)
        },
        error: function () {
            alert("Oops, something wrong when showing the favourites, please try again.")

        },
    })

    deleteFavourites();
}

function deleteFavourites() {
    //store the bus number routes and stops to be deleted
    var deleted_bus_number = [];
    var deleted_stop = [];
    var deleted_route = [];

    $('#delete_favs').on('click', function () {
        //show delete buttons
        $('.delete_bus_number').show();
        $('.delete_route').show();
        $('.delete_stop').show();
        //show save change button hide first delete button
        $('#submit_delete').show();
        $('#delete_favs').hide();

        //hide the deleted bus info and store bus number, start point, end point
        $('.delete_bus_number').on('click', function () {
            $(this).prev().hide();
            $(this).hide();
            deleted_bus_number.push([$(this).prev().children(".bus_number").html(),
                $(this).prev().children(".start_point").html(),
                $(this).prev().children(".end_point").html()
            ]);
            console.log(deleted_bus_number)
        });

        //hide the deleted stop info and store stop id
        $('.delete_stop').on('click', function () {
            $(this).prarent().hide();

            $(this).hide();
            deleted_stop.push($(this).prev().attr('id'));
            console.log(deleted_stop);
        });

        //hide the deleted route info and store route start, route end
        $('.delete_route').on('click', function () {
            $(this).prev().hide();
            $(this).parent().hide();
            $(this).hide();
            deleted_route.push([$(this).prev().children(".route_start").html(),
                $(this).prev().children(".route_end").html()
            ]);
            console.log(deleted_route);
        });
    })

    //submit all changes made
    $('#submit_delete').on('click', function () {
        var token = $('input[name="csrfmiddlewaretoken"]').val()

        //delete all buses stored in the array
        $.each(deleted_bus_number, function (index, value) {
            $.ajaxSetup({
                headers: {
                    'X-CSRFToken': token
                }
            })
            $.ajax({
                cache: false,
                type: "DELETE",
                url: window.location.protocol + "//" + window.location.host + "/user/favorite_bus_number",
                data: {
                    'bus_number': value[0],
                    'start_point': value[1],
                    'end_point': value[2],
                    'csrfmiddlewaretoken': token
                },
                async: true,
                success: function (result) {
                    console.log(result);
                },
                error: function () {
                    swal("remove bus number failed", "Please try it later!", "error");
                },
            });
        })

        //delete all stops stored in the array
        $.each(deleted_stop, function (index, value) {
            $.ajaxSetup({
                headers: {
                    'X-CSRFToken': token
                }
            })
            $.ajax({
                cache: false,
                type: "DELETE",
                url: window.location.protocol + "//" + window.location.host + '/user/favorite_stop',
                data: {
                    'stop_id': value,
                    'csrfmiddlewaretoken': token
                },
                async: true,
                success: function (result) {
                    console.log(result);
                },
                error: function () {
                    swal("remove stop failed", "Please try it later!", "error");
                },
            });
        })

        //delete all routes stored in the array
        $.each(deleted_route, function (index, value) {
            $.ajaxSetup({
                headers: {
                    'X-CSRFToken': token
                }
            })
            $.ajax({
                cache: false,
                type: "DELETE",
                url: window.location.protocol + "//" + window.location.host + '/user/favorite_route',
                data: {
                    'route_start': value[0],
                    'route_end': value[1],
                    'csrfmiddlewaretoken': token
                },
                async: true,
                success: function (result) {
                    console.log(result);
                },
                error: function () {
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

}

function seeStopDetail(stop_id) {
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    $('#search_stop').val(stop_id);
    $('#addFav').hide();
    $('#removeFav').hide();
    //path selected stop id to bus_info
    $.ajax({
        ache: false,
        type: "POST",
        url: window.location.protocol + "//" + window.location.host + '/user/stop_info',
        data: {
            'stop_id': $('#search_stop').val().split(",", 1)[0],
            'csrfmiddlewaretoken': token
        },
        async: true,
        success: function (result) {
            console.log(result)
            if (result.res == 1) {

                result = result.json_data[0]['fields'];
                // console.log(result[0]['fields']);
                var content_html = "<h2>" + result.stop_name + "</h2>" +
                    "<h3>" + result.stop_id + "</h3>" +
                    "<button class='stopNavBtn' data-toggle='navigator stopPage'>Navigate</button>" +
                    "<input type='text' id='stop_id' value='" + result.stop_id + "' style='display: none'>";
                // + "<ul class='routesList'>";
                //delete the qoutes in results
                // var routes = result.stop_routes.toString().replace(/\'/g,"").replace(/\]/g,"").split(",");
                // for (var i =1; i < routes.length; i++){
                //     content_html += "<li><a class='"+ routes[i] +"'>"+ routes[i]+"</a></li> "
                // }
                // content_html +="</ul>";
                content_html += "<div id='test_error'></div>";

                $('#stop_content').html(content_html);

                $('.stopNavBtn').on('click', function () {
                    fetchStopAddress(result.stop_lat, result.stop_lon);
                });

                //get user_favourite_stop
                //compare with selected stop id
                //determine which button to show
                $.ajax({
                    type: "GET",
                    url: window.location.protocol + "//" + window.location.host + '/user/favorite_stop',
                    async: true,
                    success: function (result1) {
                        //msg stors the id of the button
                        // var msg = "#addFav";
                        if (result1.res == 1) {
                            var msg = "#addFav";
                            for (var i = 0; i < result1['user_stop_list'].length; i++) {
                                //if the stop id is in the users' favourites list
                                if (result1['user_stop_list'][i] == $('#stop_id').val()) {
                                    msg = "#removeFav";
                                    break
                                }
                            }
                            $(msg).show()
                        } else {
                            $('.login-required').show();
                        }
                    },
                    error: function () {
                        console.log('show button fail')
                    },
                });
            } else {
                alert(result.error_msg);
            }
        },
        error: function () {
            alert("result false");
        },
    })
}

function invokeBusDetail() {
    invokeAddBusBtn();
    invokeDeleteBusBtn()
}

//load  pages
$(document).ready(function () {
    $('#userPage').load('/user/login');
    $('#contactPage').load('/user/contact');

});

// used code from 'https://css-tricks.com/prefilling-date-input/'
// this is used for a default of todays date
$(function () {
    var today = new Date().toISOString().substr(0, 10);
    $("input[id='rightNow']").attr('value', today);
});

// used code from 'https://codepen.io/rafaelcastrocouto/pen/Iyewu'
// this is used for a default of the exact time
$(function () {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    $('input[type="time"]').each(function () {
        $(this).attr({
            'value': h + ':' + m
        });
    });
});
$('.JP').on('click', function () {
    console.log("click jp")
    invokeAddRoutesBtn();
    initAddFavRoutes();
    invokeDeleteRoutesBtn();
})


//splash overlay code comes from: https://www.sitepoint.com/community/t/how-do-you-make-a-javascript-splash-page/44555/3
$.fn.center = function () {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (
            ($(window).height() - $(this).outerHeight()) / 2) +
        $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (
            ($(window).width() - $(this).outerWidth()) / 2) +
        $(window).scrollLeft()) + "px");
    return this;
}
$("#splash_overlay").show();
$("#splash-content").show().center();

setTimeout(function () {
    $("#splash_overlay").fadeOut();
}, 2000);


function TrafficFeed() {

    $.ajax({
        'url': window.location.protocol + "//" + window.location.host + "/user/TrafficFeed",
        'type': 'get',
        'dataType': 'json',
    }).done(function (trafficdata) {

        var entries = trafficdata['data']

        if (oldfeed != "TEST") {
            if (entries[0].title != oldfeed[0].title) {

                // change the icon here to show a new noticifation 
                console.log("changed traffic feed");
            }
        };
        var innertext_ = "<ul class=\"trafficfeedlist\"><li>";

        for (i = 0; i < entries.length; i++) {

            innertext_ += entries[i].title;

            innertext_ += "<br><a href=" + entries[i].link + ">more >>></a>"

            if (i < entries.length - 1) {
                innertext_ += "</li><hr><li>";
            }
        };
        innertext_ += "</li></ul>";

        $("#trafficfeed").html(innertext_);

        // replace the old feed with the new one and wait to run again.
        oldfeed = entries;
    })
}


function on8() {
    $.ajax({
        // 'url': "{% url "prediction:weather" %}",
        'url': window.location.protocol + "//" + window.location.host + "/prediction/weather",
        'type': 'get',
        'dataType': 'json',
    }).done(function (data_total) {
        var data = data_total.currently;
        var data_hourly = data_total.hourly.data;
        var data_daily = data_total.daily;
        var weatherDescription = data.summary;
        displayDescription = ("Today: " + data_daily.data[0].summary + " For now, it feels like " + weatherDescription.toLowerCase() + ".");

        $('#weather_heading').show().html(displayDescription).css({
            'font-size': 20,
            'color': '#e5e5e5'
        });
        $('#currentTemperature').show().html(Math.round(data.temperature) + "℃").css({
            'font-size': 55,
            "line-height": "100%",
            'color': '#e5e5e5'
        });

        var weatherIcon = data.icon.toUpperCase().split('-');
        weatherIcon = weatherIcon.join('_')

        //var weatherIcon = "snow";
        var icons = new Skycons({
            "monochrome": false,
            "colors": {
                "main": "white",
                "cloud": "#c1c1c1",
                "moon": "#494960"
            }
        });
        icons.set("weatherIcon", Skycons[weatherIcon])
        icons.play();

        // Displaying Sunrise
        var sunrise_time = new Date(data_daily.data[0].sunriseTime * 1000)
        var sunrise = ("Sunrise: " + sunrise_time.getHours() + ":" + sunrise_time.getMinutes());

        // Displaying Sunset
        var sunset_time = new Date(data_daily.data[0].sunsetTime * 1000)
        var sunset = ("Sunset: " + sunset_time.getHours() + ":" + sunset_time.getMinutes());

        // Displaying Wind Speed
        var displayWind = ("Wind Speed: " + Math.round(data.windSpeed) + " m/s");

        // Displaying humidity
        var displayHumidity = ("Humidity: " + Math.round(data.humidity * 100) + "%");

        // Displaying pressure
        var pressure = ("Pressure: " + Math.round(data.pressure) + "hPa");

        // Displaying pressure
        var visibility = ("Visibility: " + Math.round(data.visibility) + "km");
        //Display Weather Stats on overlay8
        $('#weather_stats').show().html(sunrise + "<br/>" + sunset + "<br/><br/>" + displayWind + "<br/>" + displayHumidity + "<br/><br/>" + pressure + "<br/>" + visibility).css({
            'font-size': 20,
            'color': '#e5e5e5'
        });
        for (var i = 0; i < data_hourly.length; i++) {
            var weatherIcon = data_hourly[i].icon.toUpperCase().split('-');
            weatherIcon = weatherIcon.join('_')
            var icons = new Skycons({
                "monochrome": false,
                "colors": {
                    "main": "white",
                    "cloud": "#c1c1c1",
                    "moon": "#494960"
                }
            });
            $('#weather_hourly').append('<div><p id="weathertime' + i + '"></p><canvas id="weatherIcon' + i + '" width="55" height="55"></canvas><p id="weatherTemp' + i + '"></p></div>')
            icons.set("weatherIcon" + i, Skycons[weatherIcon]);
            icons.play();
            var date = new Date(data_hourly[i]['time'] * 1000)
            if (i == 0) {
                $('#weathertime' + i).html("Now").css({
                    'text-align': 'center',
                    'color': 'white',
                    'margin-left': '5px'
                })
            } else {
                $('#weathertime' + i).html(date.getHours() + ":00").css({
                    'text-align': 'center',
                    'color': 'white',
                    'margin-left': '5px'
                })
            }
            $('#weatherTemp' + i).html(Math.round((data_hourly[i].temperature)) + "℃").css({
                'text-align': 'center',
                'color': 'white'
            })
            $('#weather_hourly div').css({
                'float': 'left',
                'height': '100px',
                'width': '60px',
                'margin-left': '5px'
            })
            $('#weather_hourly').css({
                'height': '100px',
                'overflow': 'hidden'
            })
        }
        for (var i = 0; i < data_daily.data.length; i++) {
            if (i == 0) {
                $('#weather_daily').append('<div><div id="weekday' + i + '"></div><div id="weatherDailyIcon' + i + '" width="55" height="55"></div><div id="weatherDailyTemp' + i + '"></div></div>')
                $('#weekday' + i).html('Weekday').css({
                    'text-align': 'left',
                    'color': 'white',
                    'float': 'left',
                    'font-size': 20,
                    'width': "33%"
                }).append('<hr>')
                $('#weatherDailyTemp' + i).html('Temp:Min/Max').css({
                    'text-align': 'right',
                    'color': 'white',
                    'float': 'right',
                    'font-size': 20,
                    'width': "34%",
                    'margin-right': '0px'
                }).append('<hr>')

                $('#weatherDailyIcon' + i).html('Forecast').css({
                    'text-align': 'center',
                    'color': 'white',
                    'float': 'left',
                    'font-size': 20,
                    'width': "33%",
                    'margin-right': '0px'
                }).append('<hr>')
            } else {
                $('#weather_daily').append('<div><div id="weekday' + i + '"></div><canvas id="weatherDailyIcon' + i + '" width="55" height="55"></canvas><div id="weatherDailyTemp' + i + '"></div></div>')
                var weatherIcon = data_daily.data[i].icon.toUpperCase().split('-');
                weatherIcon = weatherIcon.join('_')
                var icons = new Skycons({
                    "monochrome": false,
                    "colors": {
                        "main": "white",
                        "cloud": "#c1c1c1",
                        "moon": "#494960"
                    }
                });
                icons.set("weatherDailyIcon" + i, Skycons[weatherIcon]);
                icons.play();
                var date = new Date(data_daily.data[i]['time'] * 1000)
                var iWeek = date.getDay();
                $('#weekday' + i).html(fnToweek(iWeek)).css({
                    'text-align': 'left',
                    'color': 'white',
                    'float': 'left',
                    'font-size': 20,
                    'width': "33%"
                })
                $('#weatherDailyTemp' + i).html(Math.round((data_daily.data[i].temperatureMin)) + "℃/" + Math.round((data_daily.data[i].temperatureMax)) + "℃").css({
                    'text-align': 'right',
                    'color': 'white',
                    'float': 'right',
                    'font-size': 20,
                    'width': "33%",
                    'margin-right': '12px'
                })
            }


        }
    })

    function fnToweek(n) {

        if (n == 0) {
            return 'Sunday';
        } else if (n == 1) {
            return 'Monday';
        } else if (n == 2) {
            return 'Tuesday';
        } else if (n == 3) {
            return 'Wednesday';
        } else if (n == 4) {
            return 'Thursday';
        } else if (n == 5) {
            return 'Friday';
        } else {
            return 'Saturday';
        }
    }

} // AKA WeatherDisplay Ends

//switch the origi point and destination point
$(function () {
    $('#switch_position').click(function () {
        var start_point = $('#directionsSource');
        var start_point_value = start_point.val();
        var end_point = $('#directionsDestination');
        start_point.val(end_point.val());
        end_point.val(start_point_value);
    });
});

$('#contact_info').submit(function () {
    var contact = $('textarea[name="contact"]').val()
    var token = $('input[name="csrfmiddlewaretoken"]').val()
    $.ajax({
        cache: false,
        type: "POST",
        url: window.location.protocol + "//" + window.location.host + "/user/contact",
        data: {
            'contact': contact,
            'csrfmiddlewaretoken': token
        },
        dataType: 'json',

        async: false,

    }).done(function (result) {
        if (result.res == 1) {
            window.confirm(result.success_msg);
        } else {
            window.confirm(result.error_msg);
        }
    }).fail(function () {
        swal("Network failed", "Please try it later!", "error");
    });
    return false;
});


// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < marker_list.length; i++) {
        marker_list[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearAllMarkers() {
    setMapOnAll(null);
    markerCluster.clearMarkers();
    circle.setMap(null);

}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearAllMarkers();
    marker_list = [];
}

function Generate_Graph(arrival_times) {

    // Need to make the graph take inputs of time. So that mu can be changed as needed.
    // sigma can be calucalted in the backend

    arrival_times = [60, 300, 600];

    $.ajax({
        'url': window.location.protocol + "//" + window.location.host + "/user/Graph_distribution",
        // 'type': 'POST',
        'type': 'get',
        'dataType': 'json',
        // 'data':{'mus':arrival_times}
    }).done(function (graphdata) {

        graphdata = graphdata['graph_data'];

        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(prepareChart);

        function prepareChart() {

            var x_bound_upper = 0;

            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Time');
            data.addColumn('number', 'Probability');

            graphdata.forEach(function (set) {

                x = set['xvals'];
                y = set['yvals'];

                for (i = 0; i < x.length; i++) {
                    data.addRow([x[i], y[i]]);

                    if (x[i] > x_bound_upper)
                        x_bound_upper = x[i];
                }
            });

            var options = {
                title: 'Sample Chart',
                hAxis: {
                    title: 'Time',
                    titleTextStyle: {
                        color: '#333'
                    },
                    minValue: 0,
                    viewWindow: {
                        max: x_bound_upper + 0.5 * x_bound_upper
                    },
                },
                vAxis: {
                    minValue: 0
                },
                'backgroundColor': 'transparent'
            };

            var chart = new google.visualization.AreaChart(document.getElementById('Graph_div'));
            chart.draw(data, options);

        };
    });
};