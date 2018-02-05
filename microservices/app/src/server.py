import os
from flask import Flask,render_template,request,make_response,abort
from urllib.request import urlopen
import json
import logging
from mapbox import Directions
from mapbox import DirectionsMatrix
from mapbox import Geocoder
from pprint import pprint



app = Flask(__name__)

@app.route('/')
def home():
        return render_template("form.html")

@app.route('/geocoding' , methods=['POST','GET'])
def geocode():
    if  request.method ==  'POST' or request.method == 'GET':
        place=request.form['place']
        MAPBOX_ACCESS_TOKEN='pk.eyJ1IjoidmluaXRoYS1zaHJlZSIsImEiOiJjamJ0ZW1yc24xMzB2Mnp1ZnVhazB6MnVzIn0.ynemM-bZ9mc4C9PuasnVow'
        geocoder = Geocoder(access_token=MAPBOX_ACCESS_TOKEN)
        #geocoder.session.params['access_token'] =='pk.eyJ1IjoidmluaXRoYS1zaHJlZSIsImEiOiJjamJ0ZW1yc24xMzB2Mnp1ZnVhazB6MnVzIn0.ynemM-bZ9mc4C9PuasnVow'
        geocode1 = geocoder.forward(place)
        print(geocode1.status_code)
        geocode = geocode1.json()
        sorted(geocode.keys())
        print(geocode)
        return json.dumps(geocode)
    return "bad request"

@app.route('/directions' , methods=['POST','GET'])
def directionRoute():
        if  request.method ==  'POST' or request.method == 'GET':
                src=request.form['src']
                dest=request.form['dest']
                pro=request.form['pro']
                Profile='mapbox/'+pro
                PRofile='mapbox.'+pro         
                MAPBOX_ACCESS_TOKEN='pk.eyJ1IjoidmluaXRoYS1zaHJlZSIsImEiOiJjamJ0ZW1yc24xMzB2Mnp1ZnVhazB6MnVzIn0.ynemM-bZ9mc4C9PuasnVow'
                geocoder = Geocoder(access_token=MAPBOX_ACCESS_TOKEN)
                #geocoder.session.params['access_token'] == 'sk.eyJ1IjoidmluaXRoYS1zaHJlZSIsImEiOiJjamNjMjkzZ3MwbTc0MndvMndtM2Ewb3lxIn0.cm3yhsou3E8UD0pm1GPKlA'
                geocode1 = geocoder.forward(src)
                src_geocode = geocode1.json()
                src1_geocode = json.loads(src_geocode)
                #geocode2 = geocoder.forward(dest)
                #dest_geocode = geocode2.json()
                src_latlng = src1_geocode["features"]
                #dest_latlng= dest_geocode['features'][0]['geometry']['coordinates']
                print(src_latlng)
                return "hii"
                '''origin = {'type': 'Feature','properties': {'name': 'dummy'},'geometry': {'type': 'Point','coordinates': [0,0]}}
                origin['properties']['name']=src
                origin['geometry']['coordinates'] = src_latlng
                destination = {'type': 'Feature','properties': {'name': 'dummy'},'geometry': {'type': 'Point','coordinates': [0,0]}}
                destination['properties']['name']=dest
                destination['geometry']['coordinates']=dest_latlng
                service = DirectionsMatrix(access_token='sk.eyJ1IjoidmluaXRoYS1zaHJlZSIsImEiOiJjamNjMjkzZ3MwbTc0MndvMndtM2Ewb3lxIn0.cm3yhsou3E8UD0pm1GPKlA')
                response = service.matrix([origin, destination],profile=Profile)
                services = Directions(access_token=MAPBOX_ACCESS_TOKEN)
                responses = services.directions([origin, destination],PRofile)
                directionMatrixStatus=response.status_code
                directionMatrixType=response.headers['Content-Type']
                directions_status=responses.status_code
                directions_type=responses.headers['Content-Type']
                duration_json=response.json()
                directionResponse_json=responses.json()
                print(directionResponse_json)
                return json.dumps(directionResponse_json)'''
        return "works bad"



if __name__=='__main__':
	app.run(debug=True)
