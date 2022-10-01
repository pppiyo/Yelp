from flask import Flask
import requests

app = Flask(__name__)

@app.get('/')
def cook_form_data():
    # https://api.yelp.com/v3/businesses/search?term=[KEYWORD]&latitude=[LAT]&longitude=[LONG]&cate gories=[CAT]&radius=[RAD]

    url = 'https://api.yelp.com/v3/businesses/search'

    header = {'Authorization': 'Bearer eOCtSLcSjoo8DlufDEjkoF7Rjf9mHwrBRI_U6aPMluevSq_imUgoz13T-Au87od_4FmrsJ6iBChruHOxDXclMK5hbMixXZipfp1CuwPNdNDDC7NWypTros3P1Q4oY3Yx'}

    parameter = {'term': 'sushi', 'latitude': '34.0294',
                 'longitude': '-118.2871', 'categories': 'all', 'radius': '40000'}
    r = requests.get(url, headers=header, params=parameter)
    return r.json()



