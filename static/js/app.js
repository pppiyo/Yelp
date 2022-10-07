MILES_TO_METERS = 1609.344;

window.addEventListener('load', event => {
    $("#submit").click(function () {
        if (document.getElementById('searchResults').innerHTML != ``) {
            document.getElementById("searchResults").innerHTML = ``;
            document.getElementById("details").innerHTML = ``;
        }

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
        document.getElementById("searchResults").innerHTML = ``;
        document.getElementById("details").innerHTML = ``;
    })
});


function submitForm() {
    event.preventDefault();    // FOR DEBUG PURPOSE

    var formData = new FormData(form); // returns a FormData prototype

    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var rawFormJson = JSON.stringify(object);
    const tempJson = JSON.parse(rawFormJson);
    renameKey(tempJson, 'keyword', 'term');
    const strDistance = tempJson['distance']
    const radius = Math.round(parseInt(strDistance) * MILES_TO_METERS);
    tempJson['radius'] = radius;
    
    var checkBox = document.getElementById("detect-location");

    if (checkBox.checked == true) {
        useIpinfo(tempJson);
    } else {
        var location = formData.get('location');
        var temp = _.words(location, /[^, ]+/g);
        var str = String(temp);
        if (str == '') {
            alert('\nInvalid input:\n\nYou must either enter a location or click the auto-detect checkbox.');
        } else {
            str = str.split(',').join("+");
            
            useGeoCoding(str, function acallback(json) {
                var lat, lng;
                if (json["status"] == "ZERO_RESULTS") {
                    document.getElementById('searchResults').innerHTML = `<div style="color:black; display:center;">No record has been found</div>`
                } else {
                    lat = json["results"]["0"]["geometry"]["location"]["lat"];
                    lng = json["results"]["0"]["geometry"]["location"]["lng"];
                    
                    tempJson['latitude'] = lat;
                    tempJson['longitude'] = lng;
                    var query = $.param(tempJson);
                    handleForm(query);
                }
            });
        }
    }
}

function useIpinfo(jsonFormData) {
    fetch("https://ipinfo.io/json?token=f6e03259a7a9e5").then(
        (response) => response.json()
    ).then(
        (jsonResponse) => {
            let coords = jsonResponse.loc;
            let a = coords.split(',');
            var lat = a[0];
            var lng = a[1];
            jsonFormData["longitude"] = lng;
            jsonFormData['latitude'] = lat;

            var query = $.param(jsonFormData);
            handleForm(query); // send by query
        }
    )}



function handleForm(query) {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://127.0.0.1:5000/cook', true);
    req.open('GET', 'http://127.0.0.1:5000/cook?' + query, true);
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // searchResults.innerHTML = this.response; // FOR DEBUG PURPOSE
            const jsonResponse = JSON.parse(this.responseText);
            console.log(jsonResponse);    // FOR DEBUG PURPOSE
            if (jsonResponse['businesses'].length == 0) {
                document.getElementById('searchResults').innerHTML = `<div style="color:black;">No record has been found</div>`

            } else {
                generateTable(jsonResponse);
                // document.getElementById('details').innerHTML = `${this.response}`;
            }
        }
    }
}



function generateTable(json) {
    var tableArea = document.getElementById('searchResults');
    tableArea.innerHTML = generateHeader();

    rows = json['businesses'].length;
    for (var i = 1; i <= rows; i++) {
        let image = json['businesses'][i-1]['image_url'];
        let name = json['businesses'][i - 1]['name'];
        let rating = json['businesses'][i - 1]['rating'];
        let distanceMeter = json['businesses'][i - 1]['distance'];
        let distanceMile = (distanceMeter / MILES_TO_METERS).toPrecision(2);
        let yelpid = json['businesses'][i - 1]['id'];
        tableArea.innerHTML += addToRow(i, image, name, rating, distanceMile, yelpid);
    }

    document.getElementById('searchResults').addEventListener('click', event => {
        let td = event.target.closest('td[class="clickable"]');
        if(td) {
            // console.log(event.target.innerText, 'was clicked');
            console.log(td);
            // generateDetailCard(td[]);
            document.getElementById('details').innerHTML = `hi`;
        }
    }
    );
}



//Generate Header
function generateHeader() {
    var html = "";
    html += "<thead><tr class='table-head'>";
    html += "<th onclick='sortTable(0)' id='th-no' style='height:50px; width:100px; color:black;'>" + 'No.' + "</th>";
    html += "<th onclick='sortTable(1)' id='th-image' style='height:50px; width:100px; color:black;'>" + 'Image' + "</th>";
    html += "<th onclick='sortTable(2)' id='th-name' style='height:50px; width:600px; color:black;'>" + 'Business Name' + "</th>";
    html += "<th onclick='sortTable(3)' id='th-rating' style='height:50px; width:200px; color:black;'>" + 'Rating' + "</th>";
    html += "<th onclick='sortTable(4)' id='th-distance' style='height:50px; width:200px; color:black;'>" + 'Distance(miles)' + "</th>";
    html += "</tr></thead>";
    return html;
}


function addToRow(index, image, name, rating, distance, yelpid) {
    var html = "<tr class='results'>";
    html += "<td>" + index + "</td>";
    html += "<td><img src='" + image + "' width='100px' height='100px'></img></td>";
    html += "<td id='" + yelpid + "' class='clickable'>" + name + "</td>";
    html += "<td>" + rating + "</td>";
    html += "<td>" + distance + "</td>";
    html += "</tr>";
    return html;
}



function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("searchResults");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }

    for (let i = 1; i < rows.length; i++) {
        rows[i].getElementsByTagName("TD")[0].innerHTML = i;
    }
}


//Add new row
// function addToRow(index, image, name, rating, distance) {
//     var html = "<tr class='results'>";
//     html += "<td>" + index + "</td>";
//     html += "<td><img src='" + image + "' width='100px' height='100px'></img></td>";
//     html += "<td id=''>" + name + "</td>";
//     html += "<td>" + rating + "</td>";
//     html += "<td>" + distance + "</td>";
//     html += "</tr>";
//     return html;
// }


function enableLocationBox() {
    document.getElementById("location").disabled = false;
}

function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}

function disableLocationBox(checkbox) {
    var loc = document.getElementById("location");
    loc.value = ``;
    loc.disabled = checkbox.checked ? true : false;
    if (!loc.disabled) {
        loc.focus();
    }
}

function useGeoCoding(location, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var jsonObject = JSON.parse(this.responseText);
        callback(jsonObject);
    }
    xhr.open("get", "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyBXU0jzc6Rbzd5yAPd5mXWOymaZUMnqKEQ", true);
    xhr.send();
}

