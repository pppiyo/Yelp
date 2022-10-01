var lng, lat;

function submitForm() {
  event.preventDefault();  // FOR DEBUG PURPOSE
  
  var formData = new FormData(form);
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

  xhr.open("get", "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyBXU0jzc6Rbzd5yAPd5mXWOymaZUMnqKEQ", true);
  
  xhr.send();
}


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