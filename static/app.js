
document.getElementById("submit-button").onclick = getAddress();

function getAddress() {
  document.getElementById("search-result").innerHTML = ``;
  var address = document.getElementById("location").value;
  // alert(address);
  
};

(function () {
  var position = document.getElementById("location").value;
  
  
  function init() {
    var locatorButton = document.getElementById("submit-button");
    locatorButton.addEventListener("click", locatorButtonPressed)

  }

  function locatorButtonPressed() {
    locatorSection.classList.add("loading")

    navigator.geolocation.getCurrentPosition(function (position) {
      getUserAddressBy(position.coords.latitude, position.coords.longitude)
    },
      function (error) {
        locatorSection.classList.remove("loading")
        alert("The Locator was denied :( Please add your address manually")
      })
  }

  function getUserAddressBy(lat, long) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var address = JSON.parse(this.responseText)
        setAddressToInputField(address.results[0].formatted_address)
      }
    };
    xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyBXU0jzc6Rbzd5yAPd5mXWOymaZUMnqKEQ", true);
    xhttp.send();
  }

 

  init()

})();



