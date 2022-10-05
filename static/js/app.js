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


function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}


function ajax(location) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(this.responseText);
        };
        xhr.onerror = reject;
        xhr.open("get", "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyBXU0jzc6Rbzd5yAPd5mXWOymaZUMnqKEQ", true);
        xhr.send();
    });
}


function submitForm() {
    event.preventDefault();    // FOR DEBUG PURPOSE

    var formData = new FormData(form); // returns a FormData prototype
    // console.log(formData); // FOR DEBUG PURPOSE

    var checkBox = document.getElementById("detect-location");

    if (checkBox.checked == true) {
        var coordinates = useIpinfo();
        alert(coordinates);
    } else {
        var location = formData.get('location');
        var temp = _.words(location, /[^, ]+/g);
        var str = String(temp);
        // console.log(str);    // FOR DEBUG PURPOSE
        if (str == '') {
            // alert("enter something");
        } else {
            str = str.split(',').join("+");
            // document.getElementById("searchResults").innerHTML = `${str}`;
                ajax(str)
                .then(function (obj) {
                    console.log(obj); // Code depending on result

                    // if (obj["status"] == "ZERO_RESULTS") {
                    //     alert("No results");
                    // } else {
                    //     var lat = obj["results"]["0"]["geometry"]["location"]["lat"];
                    //     var lng = obj["results"]["0"]["geometry"]["location"]["lng"];
                    //     console.log(lat); // FOR DEBUG PURPOSE
                    //     return { "latitude": lat, "longitude": lng }
                    // }
                })
                .catch(function () {
                    console.log("An error occurred"); // Code depending on result
                    // An error occurred
                });  

        //   console.log(results);
            // var coordinates = useGeoCoding(str);
            // alert(coordinates);
        }
    }

    // alert(lng);
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var rawFormJson = JSON.stringify(object);
    // console.log(rawFormJson); // FOR DEBUG PURPOSE
    const tempJson = JSON.parse(rawFormJson);
    renameKey(tempJson, 'keyword', 'term');

    //     tempJson['latitude'] = lat;
    // console.log(tempJson); // FOR DEBUG PURPOSE
    //     tempJson['longitude'] = lng;
    const strDistance = tempJson['distance']
    const radius = parseInt(strDistance) * 1609.34;
    tempJson['radius'] = radius;
    const cookedFormJson = JSON.stringify(tempJson);
    document.getElementById("searchResults").innerHTML = `${cookedFormJson}`; // FOR DEBUG PURPOSE

    // handleForm(jsonFormData);

}



function useIpinfo() {
    const p1 =
        fetch("https://ipinfo.io/json?token=f6e03259a7a9e5").then(
            (response) => response.json()
        ).then(
            (jsonResponse) => {
                let coords = jsonResponse.loc;// handle lng, lat
                // console.log(coords); // FOR DEBUG PURPOSE
                let a = coords.split(',');
                var lat = a[0];
                var lng = a[1];
                var returnJson = {
                    "latitude": lat,
                    "longitude": lng
                }
                return returnJson;
            }
        ).resolve();
    p1.then((value) => {
        return value;
        // expected output: 123
    });
}

    
// function useGeoCoding(location) {
//     var xhr = new XMLHttpRequest();

//     xhr.open("get", "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyBXU0jzc6Rbzd5yAPd5mXWOymaZUMnqKEQ", true);

//     xhr.send();
//     xhr.onreadystatechange = function () {
//         var lat, lng;

//         if (this.readyState == 4 && this.status == 200) {
//             var json = xhr.response;
//             // document.getElementById("searchResults").innerHTML = `${json}`; // FOR DEBUG PURPOSE
//             var obj = JSON.parse(json);
//             // console.log(obj); // FOR DEBUG PURPOSE

//             if (callback) callback(obj);

//             // if (obj["status"] == "ZERO_RESULTS") {
//             //     alert("No results");
//             // } else {
//             //     lat = obj["results"]["0"]["geometry"]["location"]["lat"];
//             //     lng = obj["results"]["0"]["geometry"]["location"]["lng"];
//             //     console.log(lat); // FOR DEBUG PURPOSE
//             // }
//         }
//         // return {
//         //     "latitude": lat,
//         //     "longitude": lng
//         // }
//     };

//     // var returnJson = {
//     //     "latitude": lat,
//     //     "longitude": lng
//     // }
//     // console.log(returnJson); // FOR DEBUG PURPOSE
//     // return returnJson;

//     // console.log(xhr.onreadystatechange);
//     // console.log(returnJson); // FOR DEBUG PURPOSE

// }


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


function handleForm(jsonFormData, callback) {
    var req = new XMLHttpRequest();
    var searchResults = document.getElementById('searchResults'); // FOR DEBUG PURPOSES
    searchResults.innerHTML = jsonFormData; // FOR DEBUG PURPOSES
    req.open('GET', '/cook', true);
    req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    // req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send(jsonFormData);
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // searchResults.innerHTML = this.response;
            const jsonResponse = JSON.parse(this.responseText);
            // console.log(jsonResponse);    // FOR DEBUG PURPOSE
            // alert(jsonResponse['businesses'][0]['name']);
            // generateTable(jsonResponse);
            if (callback) callback(jsonResponse);
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

