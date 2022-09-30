var lng, lat;

function submitForm() {
  event.preventDefault(); 
  // var queryString = $('form').serialize();
  // alert(queryString);
  // console.log(queryString);
  // var loc = parseQuery(queryString)[['location']];
  // console.log(loc);
  // alert(loc);

  // var form = document.getElementById('form');
  
  var formData = new FormData(form);
  
  // JSON.stringify(a); // FOR DEBUG PURPOSE
  
  var checkBox = document.getElementById("detect-location");
  
  if (checkBox.checked == true) {

    useIpinfo();

  } else {

    var location = formData.get('location');
    var a = _.words(location, /[^, ]+/g);
    var str = String(a);
    console.log(str);

    if (str == '') {

      alert("enter something");

    } else {

      str = str.split(',').join("+");
      document.getElementById("output").innerHTML = `${str}`;
      useGeoCoding(str);

    }

  }

}


function useIpinfo() {
  fetch("https://ipinfo.io/json?token=f6e03259a7a9e5").then(
    (response) => response.json()
  ).then(
    (jsonResponse) => {
      let coords = jsonResponse.loc;// handle lng, lat
      console.log(coords); // FOR DEBUG PURPOSE
      // console.log(jsonResponse); // FOR DEBUG PURPOSE
      let a = coords.split(',');
      lat = a[0];
      lng = a[1];
      // alert(lat); // FOR DEBUG PURPOSE
    }
  )

  // fetch("https://ipinfo.io/json?token=f6e03259a7a9e5").then(
  //   (response) => response.json()
  // ).then(
  //   (jsonResponse) => document.getElementById("output").innerHTML = (jsonResponse.loc)
  // )

  // $.get('https://ipinfo.io/json?token=f6e03259a7a9e5', function (data) {
  //   console.log('Response', data);
  // });

}

function useGeoCoding(location) {
  var xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var json = xhr.response;
      document.getElementById("output").innerHTML = `${json}`; // FOR DEBUG PURPOSE
      // console.log(json); // FOR DEBUG PURPOSE
      var obj = JSON.parse(json);
      if (obj["status"] == "ZERO_RESULTS") {
        alert("recheck");
      } else {
        lat = obj["results"]["0"]["geometry"]["location"]["lat"];
        lng = obj["results"]["0"]["geometry"]["location"]["lng"];
        // alert(lat); // FOR DEBUG PURPOSE
      }
    }
  };

  // console.log("https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyBXU0jzc6Rbzd5yAPd5mXWOymaZUMnqKEQ"); // FOR DEBUG PURPOSE

  xhr.open("get", "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyBXU0jzc6Rbzd5yAPd5mXWOymaZUMnqKEQ", true);
  
  xhr.send();
}


  // GDownloadUrl("test1.xml", function (data) {
  //   var xml = xhr.responseXML;
  //   var root = xml.documentElement;
  //   var markers = root.getElementsByTagName("markers"), nameEl;

  //   for (var i = 0, len = markers.length; i < len; ++i) {
  //     nameEl = markers[i].getElementsByTagName("name")[0];
  //     alert(nameEl.firstChild.data);
  //   }
  // });

function disableLocationBox(checkbox) {
  var loc = document.getElementById("location");
  loc.value = ``;
  loc.disabled = checkbox.checked ? true : false;
  if (!loc.disabled) {
    loc.focus();
  }
}

function enableLocationBox() {
  document.getElementById("location").disabled = false;
}

// (function () {
//   var position = document.getElementById("location").value;


//   function init() {
//     var locatorButton = document.getElementById("submit-button");
//     locatorButton.addEventListener("click", locatorButtonPressed)

//   }

//   function locatorButtonPressed() {
//     locatorSection.classList.add("loading")

//     navigator.geolocation.getCurrentPosition(function (position) {
//       getUserAddressBy(position.coords.latitude, position.coords.longitude)
//     },
//       function (error) {
//         locatorSection.classList.remove("loading")
//         alert("The Locator was denied :( Please add your address manually")
//       })
//   }

// function parseQuery(queryString) {
//   var query = {};
//   var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
//   for (var i = 0; i < pairs.length; i++) {
//     var pair = pairs[i].split('=');
//     query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
//   }
//   return query;
// }

//   init()

// })()