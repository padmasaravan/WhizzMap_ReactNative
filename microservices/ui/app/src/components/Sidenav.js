import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardSubtitle
} from "reactstrap";
import $ from "jquery";
import mapboxgl from 'mapbox-gl'

//this component renders the side navigation form and adds direction layers to the map.

export default class Sidenav extends Component {
  constructor(props) {
    super(props);
    this.preventSpace = this.preventSpace.bind(this);
    this.getSourceSuggetions = this.getSourceSuggetions.bind(this);
    this.getDestSuggestions = this.getDestSuggestions.bind(this);
    this.getDirections = this.getDirections.bind(this);
    this.fetchUpdatesState = this.fetchUpdatesState.bind(this);
    this.setMapLayers = this.setMapLayers.bind(this);
    this.backColor = this.backColor.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.removeMapLayers = this.removeMapLayers.bind(this);
    this.showInstruct = this.showInstruct.bind(this);
    this.state = {
      layersAdded:false,
      duration: "",
      startcoords:[],
      endcoords:[],
      route:{},
      steps: []
    };
  }

  componentDidMount() {
   setTimeout(() => {
    this.setState({
      map: this.props.map
    })
   }, 2000);
  }
  //prevent user from inputing space as first character.
    preventSpace(e) {
      if (e.which === 32 && e.target.selectionStart === 0) {
        e.preventDefault();
      }
    }
    //get suggestions for source input.
    getSourceSuggetions() {
      let userInput = $("#source-place").val();
      let places;
  
      if (userInput.length >= 3) {
        let places = [];
        let count;
        //make api calls to server to fetch the geocoding suggestions.
        $.ajax({
          method: "GET",
          url:
            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
            userInput +
            ".json?access_token=pk.eyJ1Ijoic2F0aHlhcmVkZHkiLCJhIjoiY2pjM2wxYnVqMHc0NzMzbXdhd29idmhzNyJ9.fcgsB7jfhQM3_oQz0XrOvg"
        }).done(function(data) {
          let features = data.features;
          count = features.length;
          //set array to empty for every request to save new data
          places.splice(0);
          //remove the list items on each call to show new values
          $("ul#source-ul li").remove();
          for (let i = 0; i < count; i++) {
            //push the suggestion names to array
            places.push(features[i].place_name);
            //append li's to suggestions ul and do some css
            $("ul#source-ul")
              .addClass("show-sug-ul")
              .removeClass("hide-sug-ul")
              .append("<li>" + places[i] + "</li>");
          }
          //grab the value of selected suggestion and do some css.
          $("ul#source-ul li").click(function() {
            let selectedLi = $(this).html();
            $("#source-place").val(selectedLi);
            $("ul#source-ul").addClass("hide-sug-ul");
          });
        });
      } else {
        //hide the suggestions list when input characters are less than 3
        $("ul#source-ul").addClass("hide-sug-ul");
      }
    }
    //get suggestions for destination input.
    getDestSuggestions() {
      let userInput = $("#destination-place").val();
      let places;
  
      if (userInput.length >= 3) {
        let places = [];
        let count;
        //make api calls to server to fetch the geocoding suggestions.
        $.ajax({
          method: "GET",
          url:
            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
            userInput +
            ".json?access_token=pk.eyJ1Ijoic2F0aHlhcmVkZHkiLCJhIjoiY2pjM2wxYnVqMHc0NzMzbXdhd29idmhzNyJ9.fcgsB7jfhQM3_oQz0XrOvg"
        }).done(function(data) {
          let features = data.features;
          count = features.length;
          //set array to empty for every request to save new data
          places.splice(0);
          //remove the list items on each call to show new values
          $("ul#dest-ul li").remove();
          for (let i = 0; i < count; i++) {
            //push the suggestion names to array
            places.push(features[i].place_name);
            //append li's to suggestions ul and do some css
            $("ul#dest-ul")
              .addClass("show-sug-ul")
              .removeClass("hide-sug-ul")
              .append("<li>" + places[i] + "</li>");
          }
          //grab the value of selected suggestion and do some css.
          $("ul#dest-ul li").click(function() {
            let selectedLi = $(this).html();
            $("#destination-place").val(selectedLi);
            $("ul#dest-ul").addClass("hide-sug-ul");
          });
        });
      } else {
        //hide the suggestions list when input characters are less than 3
        $("ul#dest-ul").addClass("hide-sug-ul");
      }
    }
  

  //this extracts user inputs, get's directions object and adds routes to the map.

  getDirections(e) {
    e.preventDefault();
    this.props.isLoading(true);
    let start = $("#source-place").val();
    let destination = $("#destination-place").val();
    let profile =  $("#profile-mode").val();

    let inputs = JSON.stringify({
      "start": start,
      "end": destination,
      "profile": profile
    });
    //
    if(start.length > 2) {
    $.ajax({
      type:"POST",
      url:"https://app.filling69.hasura-app.io/directions",
      headers:{
        'Content-Type': 'application/json'
      },
      data: inputs, 
    }).done(data => {
      this.props.isLoading(false);
      let parsedData = JSON.parse(data);
      this.fetchUpdatesState(parsedData);
    }).fail(error => {
      this.props.isLoading(false);
      this.props.onError();
    })
  }
}
  fetchUpdatesState(data) {
    let route = data.routes[0].geometry;
    let duration = Math.ceil((data.routes[0].duration)/60); 
    let coordLength = route.coordinates.length;
    let startcoords = route.coordinates[0];
    let endcoords = route.coordinates[coordLength - 1];
    let steps = data.routes[0].steps;
    this.showInstruct();
    //remove map layers if already exist
    if(this.state.layersAdded) {
     this.removeMapLayers()
    }
    if(duration < 60) {
      duration = duration + " Min";
    }else {
      let hr = Math.ceil(duration/60);
      let min = duration%60;
      duration = hr + " hr " + min + " mins";
    }

    if(steps !== undefined || duration !== undefined){
    this.setState({
      layersAdded:true,
      duration: duration,
      steps: steps,
      startcoords: startcoords,
      endcoords: endcoords,
      route: route
    });
  }  
  this.setMapLayers(route,startcoords,endcoords);
}

setMapLayers(route,startcoords,endcoords) {    
  let map = this.state.map;
  
  map.addLayer({
    id: "route",
    type: "line",
    source: {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: route
      }
    },
    paint: {
      "line-width": 3,
      "line-color": "#05D353"
    }
  });
  map.addLayer({
    id: "start",
    type: "circle",
    source: {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: startcoords
        }
      }
    }
  });
  map.addLayer({
    id: "end",
    type: "circle",
    source: {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: endcoords
        }
      }
    }
  });
  map.flyTo({center: startcoords, zoom: 12});
  // create the popup
  let popupA = new mapboxgl.Popup()
  .setText('This is the starting point of your journey.');
  // create DOM element for the marker
  let elA = document.createElement('div');
  elA.id = 'markerA';
  let markerA = new mapboxgl.Marker()
  .setLngLat(startcoords)
  .setPopup(popupA) 
  .addTo(map);

  let popupB = new mapboxgl.Popup()
  .setText('This is the destination point of your journey.');
  let elB = document.createElement('div');
  elB.id = 'markerB';
  let markerB = new mapboxgl.Marker()
  .setLngLat(endcoords)
  .setPopup(popupB) 
  .addTo(map);

  this.setState({
    markerA,
    markerB
  })
}

  removeMapLayers() {
    let map = this.state.map;
    map.removeLayer("route");
    map.removeLayer("start");
    map.removeLayer("end");
    map.removeSource("route");
    map.removeSource("start");
    map.removeSource("end");
    this.state.markerA.remove();
    this.state.markerB.remove();
    this.setState({
      layersAdded: false
    })
  }

  backColor(e) {
  e.preventDefault();
  let count = 0;
  let ele = $(e.currentTarget);
  count = ele[0].value.length
    if(count === 0) {
      ele[0].style.backgroundColor = "white";
    } else if(count < 3){
      ele[0].style.backgroundColor = "#FF4F4F";
    } else {
      ele[0].style.backgroundColor = "white";
    }
  }
//This function resets form data
  resetForm() {
    //extract values from form and set them to default
    let nodes = this.refs.formBody.childNodes[0].childNodes;
    nodes[0].childNodes[1].value = "";
    nodes[1].childNodes[1].value = "";
    nodes[2].childNodes[1].value = "driving";
    //hide instructions div
    let instructdiv = document.getElementById("instructions-div").classList;
    instructdiv.remove("instructions-visible");
    instructdiv.add("instructions-hidden");
    $("ul#dest-ul").addClass("hide-sug-ul");
    $("ul#source-ul").addClass("hide-sug-ul");
    if(this.state.markerA) {
      this.removeMapLayers();
    }
  }
  //show Instructions div
  showInstruct() {
    let instructdiv = document.getElementById("instructions-div").classList;
    instructdiv.remove("instructions-hidden");
    instructdiv.add("instructions-visible");
  }

  render() {
    let { duration, steps } = this.state;
    return (
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-6 col-sm-4 col-md-3"
            id="form-instructions-div"
            ref="formBody"
          >
            <Form>
              <FormGroup>
                <Label for="from" className="form-label">
                  From
                </Label>
                <Input
                  type="text"
                  name="source"
                  id="source-place"
                  onKeyDown={this.preventSpace}
                  onKeyUp={this.getSourceSuggetions}
                  onChange={this.backColor}
                  placeholder="Starting Place"
                />
                <ul id="source-ul" />
              </FormGroup>
              <FormGroup>
                <Label for="to" className="form-label">
                  To
                </Label>
                <Input
                  type="text"
                  name="destination"
                  onKeyDown={this.preventSpace}
                  onKeyUp={this.getDestSuggestions}
                  onChange={this.backColor}
                  id="destination-place"
                  placeholder="Destination Place"
                />
                 <ul id="dest-ul" />
              </FormGroup>
              <FormGroup>
                <Label for="profile" className="form-label">
                  Select
                </Label>
                <Input type="select" name="profile" id="profile-mode">
                  <option>driving</option>
                  <option>cycling</option>
                  <option>walking</option>
                </Input>
              </FormGroup>
              <Button
                onClick={this.getDirections}
                type="submit"
                outline
                id="form-submit-btn"
              >
                Let's Go
              </Button>
              <Button onClick={this.resetForm} outline id="form-clear-btn">
                Clear
              </Button>
            </Form>
            <div id="instructions-div" className="instructions-hidden">
              <Card>
                <CardBody>
                  <CardSubtitle id="duration-label">Duration: {duration}</CardSubtitle>
                  <div id="instructions-div-inner">
                    {
                       steps.map((item,index) => {
                         return  <div key={index}>{item.maneuver.instruction}</div>
                      })
                    }             
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
