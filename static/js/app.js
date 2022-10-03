var lng, lat, formData;

window.addEventListener('load', event => {
  $("#submit").click(function () {
    if (!$("#keyword")[0].checkValidity())
      $("#keyword")[0].reportValidity()
    else if (!$("#category")[0].checkValidity())
      $("#category")[0].reportValidity()
    else if (!$("#location")[0].checkValidity())
      $("#location")[0].reportValidity()
    else
      submitForm();
  });

  $("#clear").click(function () {
    document.getElementById("form").reset();
    // var a = document.getElementById("table");
    // if (a) {
    //   a.remove();
    // }
    // var b = document.getElementById("details");
    // if (b) {
    //   b.remove();
    // }

    // let nodelist = document.body.childNodes;
    // console.log(nodelist.length);

    document.getElementById("details").innerHTML = ``;
    document.getElementById("table").innerHTML = ``;
    // document.getElementById("details").innerHTML = ``;
    // removeChildren(document.getElementsByTagName("body"));
  })


});

// function removeChildren(parent) {

//   console.log(kids);
//   var kids = parent.childNodes; // Get the list of children 
//   console.log(kids);
  // var numkids = kids.childElementCount; // Figure out how many children there are 
  // console.log(numkids);
  // for (var i = 1; i <= numkids; i++) { // Loop backward through the children 
    // parent.removeChild(kids[i]); // Remove a child 
  // }
  
// }


function submitForm() {
  event.preventDefault();  // FOR DEBUG PURPOSE
  
  formData = new FormData(form); // formData global variable
  // formData.json()

  var object = {};
  formData.forEach((value, key) => object[key] = value);
  var jsonFormData = JSON.stringify(object);

  // document.getElementById("table").innerHTML = `${jsonFormData}`;
  
  var checkBox = document.getElementById("detect-location");
  
  if (checkBox.checked == true) {

    useIpinfo();

  } else {

    var location = formData.get('location');
    var a = _.words(location, /[^, ]+/g);
    var str = String(a);
    console.log(str);

    if (str == '') {

      // alert("enter something");

    } else {

      str = str.split(',').join("+");
      // document.getElementById("table").innerHTML = `${str}`;
      useGeoCoding(str);

    }

  }

  do_ajax(jsonFormData);
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
      // document.getElementById("table").innerHTML = `${json}`; // FOR DEBUG PURPOSE
      // console.log(json); // FOR DEBUG PURPOSE
      var obj = JSON.parse(json);
      if (obj["status"] == "ZERO_RESULTS") {
        alert("No results");
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


function do_ajax(jsonFormData) {
  var req = new XMLHttpRequest();
  var table = document.getElementById('table');
  req.open('GET', '/form', true);
  req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
  req.send(jsonFormData);  
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // var tableSection = document.createElement('section');
      // tableSection.setAttribute('id', 'table');
      // tableSection.innerHTML = `${this.responseText}`;
      // document.body.appendChild(tableSection);

      table.innerHTML = this.responseText;
    } else {
      // table.innerHTML = "hi thehihidfidhs ..."; // FOR DEBUG PURPOSE
    }
  }
}