import React, { Component } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import Sidenav from "./Sidenav";
import spinner from "./spinner.svg";
import { Button, Card, CardTitle, CardText } from 'reactstrap';
import $ from "jquery";

class MyMap extends Component {
  constructor(props) {
    super(props);
    this.handleLoading = this.handleLoading.bind(this);
    this.onError = this.onError.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.state = {
      isLoading: false,
      visible: false
    }
  }

  componentDidMount() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWxleDMxNjUiLCJhIjoiY2o0MHp2cGtiMGFrajMycG5nbzBuY2pjaiJ9.QDApU0XH2v35viSwQuln5w";

    // Create an instance of the map.
    let map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v9",
      center: [78.35275, 21.673997],
      zoom: 3.8
    });
    this.setState({
      map:map
    })
    // Add Geocoder control to the map to search places.
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
      })
    );

    // Add zoom and rotation control to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // Add Geolocate control to find current location to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        enableHighAccuracy: true,
        trackUserLocation: true,
        timeout: 6000
      })
    );
    // Add Full screen control to the map.
    map.addControl(new mapboxgl.FullscreenControl());
}

  handleLoading(val){
    this.setState({
      isLoading:val
    })
  }
  onDismiss() {
    this.setState({ visible: false });
  }
  onError() {
      this.setState({visible: true});
  }

  render() {
{
this.state.isLoading
  ? ($("#spinnerdiv").removeClass("div-hidden").addClass("spinnerdiv-visible"))
  : ($("#spinnerdiv").removeClass("spinnerdiv-visible").addClass("div-hidden"));
}
{
  this.state.visible
  ? ($("#erroralertdiv").removeClass("div-hidden").addClass("erroralert-visible"))
  : ($("#erroralertdiv").removeClass("erroralert-visible").addClass("div-hidden"));
}
    return (
      <div className="container-fluid" id="sidenav-map">
        <div className="spinnerdiv-hidden" id="spinnerdiv">
           <img src={spinner} className="spinner" alt="spinner"/>
        </div>
        <div id="erroralertdiv" className="div-hidden">
         <Card id="erroralert">
          <CardTitle id="errortitle">Error</CardTitle>
          <CardText id="errortext">
            Couldn't find the address. Please try with area/city name.
          </CardText>
          <Button
                onClick={this.onDismiss}
                outline
                id="errorback-btn"
              >
                close
              </Button>
         </Card>
        </div>
         <Sidenav map={this.state.map} isLoading={this.handleLoading}  onError={this.onError}/>
         <div id="map" /> 
         <div id="footer">
            <p>Developed by <span id="devname">Whizzmap team</span>, powered by 
            &copy; <a href="https://www.mapbox.com" target="_blank">Mapbox</a>  &  <a href="https://www.hasura.io" target="_blank">Hasura</a></p>
          </div>         
      </div>
    );
  }
}

export default MyMap;
