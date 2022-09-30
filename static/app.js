function submitForm() {

    const form = document.getElementById('form');
    const formData = new FormData(form);

    console.log(formData.get('location'));

    // for (const value of formData.values()) {
    //   alert(value);
    // }

//     let address = document.getElementById("location").value;

//     output.textContent += `${address}`;
// }
// document.getElementById("submit-button").onclick = getAddress();

    var checkBox = document.getElementById("detect-location");

    if (checkBox.checked == true) {
      useIpinfo();
    } else {
      var location = document.getElementById("location").value;
      useGeoCoding(location);
    }
}

function useIpinfo() {
  fetch("https://ipinfo.io/json?token=f6e03259a7a9e5").then(
    (response) => response.json()
  ).then(
    (jsonResponse) => document.getElementById("output").innerHTML = (jsonResponse.loc)
  )

  // $.get('https://ipinfo.io/json?token=f6e03259a7a9e5', function (data) {
  //   console.log('Response', data);
  // });
}

function useGeoCoding(location) {
  alert('todo: use geocoding');
}

function disableLocationBox(checkbox) {
  var loc = document.getElementById("location");
  loc.value = ``;
  loc.disabled = checkbox.checked ? true : false;
  if (!loc.disabled) {
    loc.focus();
  }
}


// function getAddress() {
//   document.getElementById("search-result").innerHTML = ``;
//   var address = document.getElementById("location").value;
//   // alert(address);
  
// };

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

//   function getUserAddressBy(lat, long) {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//       if (this.readyState == 4 && this.status == 200) {
//         var address = JSON.parse(this.responseText)
//         setAddressToInputField(address.results[0].formatted_address)
//       }
//     };
//     xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyBXU0jzc6Rbzd5yAPd5mXWOymaZUMnqKEQ", true);
//     xhttp.send();
//   }

 

//   init()

// })()