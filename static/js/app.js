MILES_TO_METERS = 1609.344;

window.addEventListener('load', event => {
    $("#submit").click(function () {
        if (document.getElementById("searchResults").innerHTML != ``) {
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
        location.href = "#";
        location.href = "#searchResults";
        // document.getElementById("resultTable").click();
        // $('#resultTable')[0].click();
        // clickLink("location.href");
    });

    $("#clear").click(function () {
        removeHash();
        document.getElementById("form").reset();
        document.getElementById("detect-location").checked = false;
        document.getElementById("searchResults").innerHTML = ``;
        document.getElementById("details").innerHTML = ``;
    })
});


function removeHash() {
    history.replaceState('', document.title, window.location.origin + window.location.pathname + window.location.search);
}


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
                    document.getElementById('searchResults').innerHTML = `<div id="no-record">No record has been found</div>`
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


function handleForm(query) {
    var req = new XMLHttpRequest();
    // req.open('GET', 'https://amylee-csci571-220906.wl.r.appspot.com/cook?' + query, true);
    req.open('GET', 'http://127.0.0.1:5000/cook?' + query, true);
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonResponse = JSON.parse(this.responseText);
            console.log(jsonResponse);    // FOR DEBUG PURPOSE
            if (!jsonResponse['businesses']) {
                document.getElementById('searchResults').innerHTML = `<div id="no-record" style="color:black;">No record has been found</div>`

            } else if (jsonResponse['businesses'].length == 0) {
                document.getElementById('searchResults').innerHTML = `<div id="no-record" style="color:black;">No record has been found</div>`
            } else {
                generateTable(jsonResponse);
            }
        }
    }
}

function handleDetails(yelpId) {
    var req = new XMLHttpRequest();
    jsonFormData = {}
    jsonFormData['yelpId'] = yelpId;
    query = $.param(jsonFormData);
    
    req.open('GET', 'http://127.0.0.1:5000/details?' + query, true);
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonResponse = JSON.parse(this.responseText);
            console.log(jsonResponse);    // FOR DEBUG PURPOSE
            generateDetailsCard(jsonResponse);
        }
    }
}

function generateTable(json) {
    document.getElementById('searchResults').innerHTML = "<table id='resultTable'></table>"

    var tableArea = document.getElementById('resultTable');
    tableArea.innerHTML = generateHeader();

    rows = json['businesses'].length;
    for (var i = 1; i <= rows; i++) {
        let image = json['businesses'][i - 1]['image_url'];
        let name = json['businesses'][i - 1]['name'];
        let rating = json['businesses'][i - 1]['rating'];
        let distanceMeter = json['businesses'][i - 1]['distance'];
        let distanceMile = Number((distanceMeter / MILES_TO_METERS).toFixed(2));
        let yelpId = json['businesses'][i - 1]['id'];
        tableArea.innerHTML += addToRow(i, image, name, rating, distanceMile, yelpId);
    }

    var names = document.getElementsByClassName('clickable');
    for (let i = 0; i < names.length; i++) {
        names[i].addEventListener("click", e => {
            yelpId = json['businesses'][i]['id'];
            handleDetails(yelpId);
        });
    };
}

function generateDetailsCard(json) {
    var ifrm = document.getElementById('detailsCard');

    // name
    if (json['name']) {
        let bizname = json['name'];
        ifrm.contentWindow.document.getElementById("bizname").innerHTML = `${bizname}`;
    }

    // open or closed
    if (json['is_closed'] != null) {
        ifrm.contentWindow.document.getElementById("stat").style.display = "block";
        let status = json['is_closed'];
        if (status == "false") {
            ifrm.contentWindow.document.getElementById("status").innerHTML = `Open Now`;
            ifrm.contentWindow.document.querySelector('#status').setAttribute("style", "border:1px solid green; background-color: green; padding:8px 17px 8px 17px; border-radius: 15px; ");
        } else {
            ifrm.contentWindow.document.getElementById("status").innerHTML = `Closed`;
            ifrm.contentWindow.document.querySelector('#status').setAttribute("style", "border:1px solid green; background-color: red; padding:8px 17px 8px 17px; border-radius: 15px; ");
        }
    } else {
        ifrm.contentWindow.document.getElementById("stat").style.display = "none";
    }

    // address
    if (json['location']) {
        ifrm.contentWindow.document.getElementById("addr").style.display = "block";
        if (json['location']['display_address']) {
            let addresses = json['location']['display_address'];
            var addr = '';
            for (let i = 0; i < addresses.length; i++) {
                addr = addr + addresses[i] + " ";
            }
            ifrm.contentWindow.document.getElementById("address").innerHTML = `${addr}`;
        } else {
            ifrm.contentWindow.document.getElementById("addr").style.display = "none";
        }
    } else {
        ifrm.contentWindow.document.getElementById("addr").style.display = "none";
    }

    // transaction
    if (json['transactions']) {
        if (json['transactions'].length > 0) {
            ifrm.contentWindow.document.getElementById("tran").style.display = "block";
            let transactions = json['transactions'];
            var trans = '';
            for (let i = 0; i < transactions.length; i++) {
                if (i == transactions.length - 1) {
                    trans = trans + capitalizeFirstLetter(transactions[i]);
                } else {
                    trans = trans + capitalizeFirstLetter(transactions[i]) + ' | ';
                }
            }
            ifrm.contentWindow.document.getElementById("transcationSupported").innerHTML = `${trans}`;
        } else {
            ifrm.contentWindow.document.getElementById("tran").style.display = "none";
        }
    } else {
        ifrm.contentWindow.document.getElementById("tran").style.display = "none";
    }

    // category
    if (json['categories']) {
        if (json['categories'].length > 0) {
            ifrm.contentWindow.document.getElementById("cate").style.display = "block";
            let categories = json['categories'];
            var cate = '';
            for (let i = 0; i < categories.length; i++) {
                if (i == categories.length - 1) {
                    cate = cate + categories[i]['title'];
                } else {
                    cate = cate + categories[i]['title'] + ' | ';
                }
            }
            ifrm.contentWindow.document.getElementById("category").innerHTML = `${cate}`;
        } else {
            ifrm.contentWindow.document.getElementById("cate").style.display = "none";
        }
    } else {
        ifrm.contentWindow.document.getElementById("cate").style.display = "none";
    }

    // phone number
    if (json['display_phone']) {
        ifrm.contentWindow.document.getElementById("phon").style.display = "block";
        let phone = json['display_phone'];
        ifrm.contentWindow.document.getElementById("phoneNumber").innerHTML = `${phone}`;
    } else {
        ifrm.contentWindow.document.getElementById("phon").style.display = "none";
    }

    // yelp url
    if (json['url']) {
        ifrm.contentWindow.document.getElementById("more").style.display = "block";
        let yelpUrl = json['url'];
        ifrm.contentWindow.document.querySelector('#moreInfo').querySelector('a').setAttribute("href", yelpUrl);
    } else {
        ifrm.contentWindow.document.getElementById("more").style.display = "none";
    }

    // price
    if (json['price']) {
        ifrm.contentWindow.document.getElementById("pric").style.display = "block";
        let price = json['price'];
        ifrm.contentWindow.document.getElementById("price").innerHTML = `${price}`;
    } else {
        ifrm.contentWindow.document.getElementById("pric").style.display = "none";
    }
    
    // photos
    if (json['photos']) {
        let photos = json['photos'];
        for (let i = 1; i <= photos.length; i++) {
            const url = photos[i-1];
            const bgImgUrl = "background-image: url('" + url +"')";
            const text = "<div class='photoCol-text'>Photo " + i + "</div>";
            if (i == 1) {
                ifrm.contentWindow.document.querySelector('#photoCol1').setAttribute("style", bgImgUrl);
                ifrm.contentWindow.document.getElementById("photoCol1").innerHTML = `${text}`
            }
            if (i == 2) {
                ifrm.contentWindow.document.querySelector('#photoCol2').setAttribute("style", bgImgUrl);
                ifrm.contentWindow.document.getElementById("photoCol2").innerHTML = `${text}`
            }
            if (i == 3) {
                ifrm.contentWindow.document.querySelector('#photoCol3').setAttribute("style", bgImgUrl);
                ifrm.contentWindow.document.getElementById("photoCol3").innerHTML = `${text}`
            }
        }
    }

    showDetailsCard();
}

function capitalizeFirstLetter(string) { 
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase(); 
}  

// document.getElementById('searchResults').addEventListener('click', event => {
// let td = event.target.closest('td[class="clickable"]');
// if(td) {
// console.log(event.target.innerText, 'was clicked');
// event.target.innerText, 'was clicked');
// console.log(td);
// generateDetailCard(td[]);
// document.getElementById('details').innerHTML = `${detailCard.html}`;
// event.target.setAttribute("href", "#details");
// event.target.setAttribute(this.href + "#details");
// event.target.setAttribute("onclick", "location.href='#details'");
// event.target.setAttribute("onclick", "location.hash='#details'");
// window.location.hash = "jump_to_this_location";
// event.target.setAttribute("style", "hover: text-decoration");
// event.target.href = "www.google.com";
// }
// });
// }

function showDetailsCard() {
    document.getElementById('detailsCard').style.display = "block";
}

//Generate Header
function generateHeader() {
    var html = "";
    html += "<thead><tr class='table-head'>";
    html += "<th onclick='sortTable(0)' id='th-no' style='height:50px; width:50px; color:black;'>" + 'No.' + "</th>";
    html += "<th onclick='sortTable(1)' id='th-image' style='height:50px; width:100px; color:black;'>" + 'Image' + "</th>";
    html += "<th onclick='sortTable(2)' id='th-name' style='height:50px; width:600px; color:black;'>" + 'Business Name' + "</th>";
    html += "<th onclick='sortTable(3)' id='th-rating' style='height:50px; width:200px; color:black;'>" + 'Rating' + "</th>";
    html += "<th onclick='sortTable(4)' id='th-distance' style='height:50px; width:200px; color:black;'>" + 'Distance (miles)' + "</th>";
    html += "</tr></thead>";
    return html;
}

function addToRow(index, image, name, rating, distance, yelpid) {
    var html = "<tr class='results'>";
    html += "<td>" + index + "</td>";
    html += "<td><img src='" + image + "' width='100px' height='100px' text-align='center'></img></td>";
    html += "<td id='" + yelpid + "' class='clickable'><a href='#details' style='text-decoration: none;'>" + name + "</a></td>";
    html += "<td>" + rating + "</td>";
    html += "<td>" + distance + "</td>";
    html += "</tr>";
    return html;
}

// Reference: @ https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("resultTable");
    // table = document.getElementById("searchResults");
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
    // Keep "No." column unchanged.
    for (let i = 1; i < rows.length; i++) {
        rows[i].getElementsByTagName("TD")[0].innerHTML = i;
    }
}


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
    );
}