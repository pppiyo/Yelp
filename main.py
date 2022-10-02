# from os import sendfile

from flask import Flask, request, send_from_directory
import requests
from werkzeug.datastructures import ImmutableMultiDict

app = Flask(__name__)


# @app.route('/<path:path>')
# def homepage(path):
#     return app.send_static_file(path)

@app.route('/')
def homepage():
    return app.send_static_file("index.html")


# @app.route('/static/<path:path>')
# def send_report(path):
    # return send_from_directory(path)


@app.get('/form')
def cook_form_data():
    # https://api.yelp.com/v3/businesses/search?term=[KEYWORD]&latitude=[LAT]&longitude=[LONG]&cate gories=[CAT]&radius=[RAD]
    # data = ImmutableMultiDict(request.args)
    # print(data)

    url = 'https://api.yelp.com/v3/businesses/search'

    header = {'Authorization': 'Bearer eOCtSLcSjoo8DlufDEjkoF7Rjf9mHwrBRI_U6aPMluevSq_imUgoz13T-Au87od_4FmrsJ6iBChruHOxDXclMK5hbMixXZipfp1CuwPNdNDDC7NWypTros3P1Q4oY3Yx'}


    parameter = {'term': 'sushi', 'latitude': '34.0294',
                 'longitude': '-118.2871', 'categories': 'all', 'radius': '40000'}
    r = requests.get(url, headers=header, params=parameter)
    return r.json()


if __name__ == '__main__':
    app.run(debug=True)
