function writeAddressName(latLng) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
              "location": latLng
            },
            function (results, status) {
              if (status == google.maps.GeocoderStatus.OK)
                document.getElementById("address").innerHTML = results[0].formatted_address;
              else
                document.getElementById("error").innerHTML += "Unable to retrieve your address" + "<br />";
            });
      }

      // Initialize and add the map;
      var map;
      var heatmap;
      var stops = [];
      function initMap(position) {
          console.log("init map function");
          var xmlhttp = new XMLHttpRequest();
          var url = "../static/json/stops_info.json";
          xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                  parsedObj = JSON.parse(xmlhttp.responseText);
                  myFunction(parsedObj);

              }
          };

          xmlhttp.open("GET", url, true);
          xmlhttp.send();

          function myFunction(obj) {
              for (var i = 0; i < obj.length; i++) {
                  stops[i] = {'lat': obj[i].stop_lat, 'lng': obj[i].stop_lon};
              }

              var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              // Write the formatted address
              writeAddressName(userLatLng);
              // The location of Dubin
              var dublin = {lat: 53.3498, lng: -6.2603};
              // The map, centered in Dublin
              map = new google.maps.Map(
                  document.getElementById('map'), {zoom: 14, center: dublin});
              //Add some markers to the map.
              console.log(stops.length);
              //add marker image
              // var markerImage = {
              //     url: '../static/images/bus_icon.png',
              //     // This marker is 20 pixels wide by 32 pixels high.
              //     size: new google.maps.Size(26, 26),
              // };
              // var markers = [];
              // for (var i = 0; i < stops.length; i++){
              //     var stop = stops[i];
              //     var marker = new google.maps.Marker({
              //         position: location,
              //         map: map,
              //         icon: markerImage,
              //     })
              //     // marker.addListener('click', function(){
              //     //     infowindow.open(map, marker);
              //     // });
              // markers.push(marker);
              // }
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

              function bindInfoWindow(marker, map, infowindow, html) {
                  // marker.addListener('click', function () {
                  //     infowindow.setContent(html);
                  //     infowindow.open(map, this);
                  // });
              }
              //example infowindow content
              var content_html = '<div id="content">\n' +
                  '        <h4>Stillorgan Road</h4>\n' +
                  '        <h5>Stop 768</h5>\n' +
                  '        46A<br>39A<br>145<br>155<br>' +
                  '    </div>\n' +
                  '    </div>';
              for (var i = 0; i < markers.length; i++) {
                  var marker = markers[i];
                  // bindInfoWindow(marker, map, infowindow, content_html);
                  // marker.addListener('click', function () {
                  //     infowindow.open(map, marker);
                  // });
                  //     // console.log("var markers");
                  var markerCluster = new MarkerClusterer(map, markers,
                      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

                  // var circle = new google.maps.Circle({
                  //     center: userLatLng,
                  //     radius: position.coords.accuracy,
                  //     map: map,
                  //     fillColor: '#0000FF',
                  //     fillOpacity: 0.5,
                  //     strokeColor: '#0000FF',
                  //     strokeOpacity: 1.0
                  // });
                  // map.fitBounds(circle.getBounds());
                  // create traffic layer variable
                  trafficLayer = new google.maps.TrafficLayer();
                  // create heatmap layter variable
                  heatmap = new google.maps.visualization.HeatmapLayer({
                      data: getPoints(),
                  });
              }


          }
      }
          function getPoints() {
              return [
                  new google.maps.LatLng(53.3505, -6.2610),
                  new google.maps.LatLng(53.3504, -6.2609),
                  new google.maps.LatLng(53.3503, -6.2608),
                  new google.maps.LatLng(53.3502, -6.2607),
                  new google.maps.LatLng(53.3501, -6.2606),
                  new google.maps.LatLng(53.3500, -6.2605),
                  new google.maps.LatLng(53.3499, -6.2604),
                  new google.maps.LatLng(53.3498, -6.2603),
                  new google.maps.LatLng(53.3497, -6.2602),
                  new google.maps.LatLng(53.3496, -6.2601),
                  new google.maps.LatLng(53.3495, -6.2600),
                  new google.maps.LatLng(53.3494, -6.2599),
                  new google.maps.LatLng(53.3493, -6.2598),
                  new google.maps.LatLng(53.3492, -6.2597),
                  new google.maps.LatLng(53.3491, -6.2596)
              ];
          }

          //Display Heat Map Layer
          function displayHeatmap(checkbox) {
              if (checkbox.checked) {
                  heatmap.setMap(map);
              } else {
                  heatmap.setMap(null);
              }
          }

          // Display Traffic Layer
          function displayTraffic(checkbox) {
              if (checkbox.checked) {
                  trafficLayer.setMap(map);
              } else {
                  trafficLayer.setMap(null);
              }
          }

          function geolocationError(positionError) {
              document.getElementById("error").innerHTML += "Error: " + positionError.message + "<br />";
          }

          function geolocateUser() {
              // If the browser supports the Geolocation API
              if (navigator.geolocation) {
                  console.log("geolocater executed");
                  var positionOptions = {
                      enableHighAccuracy: true,
                      timeout: 10 * 1000,
                  };

                  navigator.geolocation.getCurrentPosition(initMap, geolocationError, positionOptions);
              } else
                  document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
          }

          window.onload = geolocateUser
