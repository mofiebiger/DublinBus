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


  DirectionsRenderer = function(source, destination){
      var request = {
        origin: source,
        destination: destination,
        provideRouteAlternatives: false,
        travelMode: google.maps.DirectionsTravelMode.TRANSIT
      };

      directionsService.route(request, function(response, status){
        if (status == google.maps.DirectionsStatus.OK){

          directionsDisplay.setDirections(response);
          directionsDisplay.setPanel(document.getElementById('directionsSteps').style.display = "block");
          directionsDisplay.setMap(map);

          var _route = response.routes[0].leg[0];

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
        }
      });
    } //DirectionsRenderer Ends

    function fetchAddress(position){
      userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var Locater = new google.maps.Geocoder();

      Locater.geocode({ 'location' : userLatLng }, function(results, status){
          if(status == google.maps.GeocoderStatus.OK){
            var _r = results[0];
            $Selectors.dirSrc.val(_r.formatted_address);
            //document.getElementById("directionsSource").val(_r.formatted_address)
          }
      });

      //Draw a circle around the user position to have an idea of the current localization accuracy
      var circle = new google.maps.Circle({
          center: userLatLng,
          radius: position.coords.accuracy,
          map: map,
          fillColor: '#0000FF',
          fillOpacity: 0.5,
          strokeOpacity: 0,
      });
      map.fitBounds(circle.getBounds());
    } //fetchAddress Ends

    // Display if there is an error with the geolocation
    function geolocationError(positionError) {
      document.getElementById("error").innerHTML += "Error: " + positionError.message + "<br/>";
    }

      function invokeEvents(){
        // Get Directions
        $('#navigateButton').on('click',function(event){
          event.preventDefault();
          var src = $Selectors.dirSrc.val();
          var dst = $Selectors.dirDst.val();

          DirectionsRenderer(src, dst);
        });

        // Use My Location / Geo Location Btn
        $Selectors.geoButton.on('click', function(e) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    fetchAddress(position);
                });
            }
            else {
                document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
            }
        });
      } //invokeEvents Ends

      mapSetUp();
      invokeEvents();




        $.ajax({
          'async' : 'true',
          'url' : '/static/json/stops_info.json',
          'type': 'get',
          'dataType':'json',
          'csrfmiddlewaretoken': '{{ csrf_token }}',
        }).done(function(obj){
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

}; //InitMap Ends

    //load favouties page
    $(document).ready(function(){
      $('#logIn').load('/user/login');
      $('#favouritesInfo').load('/user/favourites');
      $('#touristInfo').load('/user/tourism');
    })

      // used code from 'https://css-tricks.com/prefilling-date-input/'
      // this is used for a default of todays date
      var today = new Date().toISOString().substr(0, 10);
      document.getElementById("rightNow").value = today;

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
            var data_hourly = data_total.hourly;
            var weatherDescription = data.summary;
            displayDescription = ("It Feels Like " + weatherDescription);

            $('#weather_heading').show().html(displayDescription);

            var weatherIcon = data.icon;
            //var weatherIcon = "snow";
            var icons = new Skycons({"color": "white"});

              switch(weatherIcon){
                case "clear-day":
                  icons.set("weatherIcon", Skycons.CLEAR_DAY);
                  break;
                case "clear-night":
                  icons.set("weatherIcon-night", Skycons.CLEAR_NIGHT);
                  break;
                case "partly-cloudy-day":
                  icons.set("weatherIcon", Skycons.PARTLY_CLOUDY_DAY);
                  break;
                case "partly-cloudy-night":
                  icons.set("weatherIcon", Skycons.PARTLY_CLOUDY_NIGHT);
                  break;
                case "cloudy":
                  icons.set("weatherIcon", Skycons.CLOUDY);
                  break;
                case "rain":
                  icons.set("weatherIcon", Skycons.RAIN);
                  break;
                case "sleet":
                  icons.set("weatherIcon", Skycons.SLEET);
                  break;
                case "snow":
                  icons.set("weatherIcon", Skycons.SNOW);
                  break;
                case "wind":
                  icons.set("weatherIcon", Skycons.WIND);
                  break;
                case "fog":
                  icons.set("weatherIcon", Skycons.FOG);
                  break;
              }
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
          })
        } // On8: AKA WeatherDisplay Ends
