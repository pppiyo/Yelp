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
    // console.log(formData); // FOR DEBUG PURPOSE

    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var rawFormJson = JSON.stringify(object);
    const tempJson = JSON.parse(rawFormJson);
    renameKey(tempJson, 'keyword', 'term');
    const strDistance = tempJson['distance']
    const radius = parseInt(strDistance) * 1609.34;
    tempJson['radius'] = radius;
    
    var checkBox = document.getElementById("detect-location");

    if (checkBox.checked == true) {
        useIpinfo(tempJson);
    }
    // } else {
    //     var location = formData.get('location');
    //     var temp = _.words(location, /[^, ]+/g);
    //     var str = String(temp);
    //     // console.log(str);    // FOR DEBUG PURPOSE
    //     if (str == '') {
    //         // alert("enter something");
    //     } else {
    //         str = str.split(',').join("+");
    //         // document.getElementById("searchResults").innerHTML = `${str}`;
    //         // console.log(results);
            
    //         useGeoCoding(str, function acallback(json) {
    //             var lat, lng;
    //             // console.log(json);
    //             if (json["status"] == "ZERO_RESULTS") {
    //                 alert("No results");
    //             } else {
    //                 lat = json["results"]["0"]["geometry"]["location"]["lat"];
    //                 lng = json["results"]["0"]["geometry"]["location"]["lng"];
                    
    //                 tempJson['latitude'] = lat;
    //                 console.log(tempJson); // FOR DEBUG PURPOSE
    //                 tempJson['longitude'] = lng;
    //                 const cookedFormJson = JSON.stringify(tempJson);
    //                 // document.getElementById("searchResults").innerHTML = `${cookedFormJson}`; // FOR DEBUG PURPOSE
    //                 handleForm(tempJson);
    //             }
    //         });
    //     }
    // }
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
            console.log(query);
            handleForm(query);
        }
    )}


function handleForm(query) {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://127.0.0.1:5000/cook?' + query, true);
    // req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            searchResults.innerHTML = this.response;
            const jsonResponse = JSON.parse(this.responseText);
            console.log(jsonResponse);    // FOR DEBUG PURPOSE
            // alert(jsonResponse['businesses'][0]['name']);
            // generateTable(jsonResponse);
            // if (callback) callback(jsonResponse);
        }
    }
}


function generateTable(json) {
    var tableArea = document.getElementById('searchResults');
    rows = json['businesses'].length;
    tableArea.innerHTML = generateHeader();
    for (var i = 1; i <= rows; i++) {
        let image = 'img';
        // let image = json['businesses'][i-1]['image_url'];
        let name = json['businesses'][i - 1]['name'];
        let rating = json['businesses'][i - 1]['rating'];
        let distance = json['businesses'][i - 1]['distance'];
        tableArea.innerHTML += addToRow(i, image, name, rating, distance);
    }
}

//Generate Header
function generateHeader() {
    var html = "<table id='table' class='results' style=''>";
    html += "<thead><tr class=''>";
    html += "<th class='tb-heading ui-state-default'>" + 'No.' + "</th>";
    html += "<th class='tb-heading ui-state-default'>" + 'Image' + "</th>";
    html += "<th class='tb-heading ui-state-default'>" + 'Business Name' + "</th>";
    html += "<th class='tb-heading ui-state-default'>" + 'Rating' + "</th>";
    html += "<th class='tb-heading ui-state-default'>" + 'Distance(miles)' + "</th>";
    html += "</tr></thead></table>";
    return html;
}

//Add new row
function addToRow(index, image, name, rating, distance) {
    var html = "<tr class='trObj'>";
    html += "<td>" + index + "</td>";
    html += "<td>" + image + "</td>";
    html += "<td>" + name + "</td>";
    html += "<td>" + rating + "</td>";
    html += "<td>" + distance + "</td>";
    html += "</tr>";
    return html;
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

// function populateTable(table, rows, cols, content) {
//     var is_func = (typeof content === 'function');
//     if (!table) table = document.createElement('table');
//     var row = document.createElement('tr');
//     row.appendChild(document.createElement('td'));

//     for (var i = 0; i < rows; ++i) {
//         var row = document.createElement('tr');
//         for (var j = 0; j < cols; ++j) {
//             row.appendChild(document.createElement('td'));
//             var text = !is_func ? (content + '') : content(table, i, j);
//             row.cells[j].appendChild(document.createTextNode(text));
//         }
//         table.appendChild(row);
//     }
//     return table;
// }

// alert(jsonResponse['businesses'][0]['name']);


// table_content += "<html><head><title>XML Parse Result</title></head><body></body>";
// ELEMENT_NODE = 1;        // MS parser doesn't define Node.ELEMENT_NODE
// root = xmlDoc.DocumentElement;
// html_text = "<html><head><title>XML Parse Result</title></head><body>";
// html_text += "<table border='1'>";
// caption = xmlDoc.getElementsByTagName("title").item(0).firstChild.nodeValue;
// html_text += "<caption align='left'><h1>" + caption + "</h1></caption>";
// planes = xmlDoc.getElementsByTagName("aircraft");
// planeNodeList = planes.item(0).childNodes;
// html_text += "<tbody>";
// html_text += "<tr>";
// x = 0; y = 0;
// // output the headers
// for (i = 0; i < planeNodeList.length; i++) {
//     if (planeNodeList.item(i).nodeType == ELEMENT_NODE) {
//         header = planeNodeList.item(i).nodeName;
//         if (header == "Airbus") { header = "Family"; x = 120; y = 55; }
//         if (header == "Boeing") { header = "Family"; x = 100; y = 67; }
//         if (header == "seats")
//             header = "Seats";
//         if (header == "Wingspan") header = "Wing Span";
//         if (header == "height") header = "Height";
//         html_text += "<th>" + header + "</th>";
//     }
// }
// html_text += "</tr>";
// // output out the values
// for (i = 0; i < planes.length; i++) //do for all planes
// {
//     planeNodeList = planes.item(i).childNodes; //get properties of a plane
//     html_text += "<tr>";            //start a new row of the output table
//     for (j = 0; j < planeNodeList.length; j++) {
//         if (planeNodeList.item(j).nodeType == ELEMENT_NODE) {
//             if (planeNodeList.item(j).nodeName == "Image") {//handle images separately
//                 html_text += "<td><img src='" + planeNodeList.item(j).firstChild.nodeValue + "' width='" + x + "' height='" + y + "'></td>";
//             }
//             else {
//                 html_text += "<td>" + planeNodeList.item(j).firstChild.nodeValue + "</td>";
//             }
//         }
//     }
//     html_text += "</tr>";
// }
// html_text += "</tbody>"; html_text += "</table>";
// html_text += "</body></html>";


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

function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}
