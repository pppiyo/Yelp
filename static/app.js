'use strict';

// window.addEventListener('load', function () {

//   console.log("Hello World!");

// });

document.getElementById("search-result").innerHTML = ``;

document.getElementById("submit-button").onclick = function getAddress() {
      var address = document.getElementById("location").value;
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var latitude = results[0].geometry.location.lat();
          var longitude = results[0].geometry.location.lng();
          document.addLocation.geolocation.value = latitude + " " + longitude;
          alert(document.getElementById("geolocation").value);
          document.addLocation.submit();
        } else alert("geocode failed:" + status);

      });
      return false;
    }  