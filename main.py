from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/')
def homepage():
    return app.send_static_file("index.html")

@app.get('/cook')
def cook_form_data():
    term = request.args.get('term')
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    categories = request.args.get('categories')
    radius = request.args.get('radius')

    url = 'https://api.yelp.com/v3/businesses/search'

    header = {'Authorization': 'Bearer eOCtSLcSjoo8DlufDEjkoF7Rjf9mHwrBRI_U6aPMluevSq_imUgoz13T-Au87od_4FmrsJ6iBChruHOxDXclMK5hbMixXZipfp1CuwPNdNDDC7NWypTros3P1Q4oY3Yx'}

    payload = {'term': term, 'latitude': latitude,
               'longitude': longitude, 'categories': categories, 'radius': radius}

    r = requests.get(url, headers=header, params=payload)

    return r.json()


@app.get('/details')
def get_biz_detail():
    
    yelpId = request.args.get('yelpId')
    
    url = 'https://api.yelp.com/v3/businesses/' + yelpId

    header = {'Authorization': 'Bearer eOCtSLcSjoo8DlufDEjkoF7Rjf9mHwrBRI_U6aPMluevSq_imUgoz13T-Au87od_4FmrsJ6iBChruHOxDXclMK5hbMixXZipfp1CuwPNdNDDC7NWypTros3P1Q4oY3Yx'}

    r = requests.get(url, headers=header)

    return r.json()

if __name__ == '__main__':
    app.run(debug=True)
