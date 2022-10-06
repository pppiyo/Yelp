# from os import sendfile

import json
import urllib
from crypt import methods
from xml.dom.minidom import TypeInfo
from flask import Flask, request, send_from_directory
import requests
# from werkzeug.datastructures import ImmutableMultiDict

app = Flask(__name__)

# @app.route('/<path:path>')
# def homepage(path):
#     return app.send_static_file(path)

@app.route('/')
def homepage():
    return app.send_static_file("index.html")

@app.get('/cook')
def cook_form_data():

    print(request.args)
    # decode(request.data)
    # parsed_json = json.loads(request.data)   
    # print(json.dumps(parsed_json, indent=4, sort_keys=True))


    # query = request
    # query = request.args[8:]
    # print(query)

    # print(request.get_data)

    # json.dumps(urllib.parse(request))

    # print(query + "------")
    # term = request.args.get('keyword', '')
    # print(term)

    # https://api.yelp.com/v3/businesses/search?term=[KEYWORD]&latitude=[LAT]&longitude=[LONG]&categories=[CAT]&radius=[RAD]
    # data = ImmutableMultiDict(request.args)
    # print(data)

    url = 'https://api.yelp.com/v3/businesses/search'

    header = {'Authorization': 'Bearer eOCtSLcSjoo8DlufDEjkoF7Rjf9mHwrBRI_U6aPMluevSq_imUgoz13T-Au87od_4FmrsJ6iBChruHOxDXclMK5hbMixXZipfp1CuwPNdNDDC7NWypTros3P1Q4oY3Yx'}

    # term = request.get_json()
    # print(term)

    payload = {'term': 'sushi', 'latitude': '34.0294',
                 'longitude': '-118.2871', 'categories': 'all', 'radius': '40000'}
    r = requests.get(url, headers=header, params=payload)
    return r.json()


if __name__ == '__main__':
    app.run(debug=True)
