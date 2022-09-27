# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python38_app]
# [START gae_python3_app]
from google.cloud import datastore
import datetime

from flask import Flask, render_template

datastore_client = datastore.Client()

app = Flask(__name__)

@app.route('/')

def root():
    # Store the current access time in Datastore.
    store_time(datetime.datetime.now(tz=datetime.timezone.utc))

    # Fetch the most recent 10 access times from Datastore.
    times = fetch_times(10)

    return render_template(
        'index.html', times=times)


def store_time(dt):
    entity = datastore.Entity(key=datastore_client.key('visit'))
    entity.update({
        'timestamp': dt
    })

    datastore_client.put(entity)


def fetch_times(limit):
    query = datastore_client.query(kind='visit')
    query.order = ['-timestamp']

    times = query.fetch(limit=limit)

    return times

    # For the sake of example, use static information to inflate the template.
    # This will be replaced with real information in later steps.
    # dummy_times = [datetime.datetime(2018, 1, 1, 10, 0, 0),
    #                datetime.datetime(2018, 1, 2, 10, 30, 0),
    #                datetime.datetime(2018, 1, 3, 11, 0, 0),
    #                ]

    # return render_template('index.html', times=dummy_times)

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.

    # app.run(host='https://amylee-csci571-220906.wl.r.appspot.com', port=5900, debug=True)
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]


    # from waitress import serve
    # serve(app, host="0.0.0.0", port=8080)
