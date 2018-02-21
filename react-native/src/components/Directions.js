import React from 'react';
import PropTypes from 'prop-types';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
//import MapboxClient from 'mapbox';
import axios from 'axios';
import Places from './Places';
import Constants from './../../util.js';

const styles = MapboxGL.StyleSheet.create({
  directionsLine: {
    lineWidth: 4,
    lineCap: MapboxGL.LineCap.Round,
    lineJoin: MapboxGL.LineJoin.Round
  }
});

class Directions extends React.Component {
  static propTypes = {
    /**
     * Mapbox access token
     */
    accessToken: PropTypes.string.isRequired,

    /**
     * Origin coordinate in [longitude, latitude] format
     */
    origin: PropTypes.arrayOf(PropTypes.number),

    /**
     * Destination coordinate in [longitude, latitude] format
     */
    destination: PropTypes.arrayOf(PropTypes.number),
    /**
     * Type of directions that are fetched from API. Possible choices are
     * walking, driving, cycling. Defaults to driving
     */
    type: PropTypes.oneOf([
      'driving',
      'walking',
      'cycling',
      
    ]),
    /**
    * Directions to display the route from source to destination
    */
    directions: PropTypes.object,  
    
    style: PropTypes.object,
  };

  constructor (props) {
    super(props);

    this.state = {
     // mapboxClient: null,
      directions: null,
      mapboxGL: null,
    };

    //this._mapboxClient = null;
    this.moveCameraToFitBounds = this.moveCameraToFitBounds.bind(this);
   
  }

  async componentDidMount () {
    console.log('Directions - didMount :'+this.props.accessToken);
    try{
        this.setState({ 
         // mapboxClient: new MapboxClient(this.props.accessToken),
          mapboxGL: new MapboxGL.MapView(Constants.mapboxAccessToken) 
         }, () => {
          this.setDirections(this.props.origin, this.props.destination, this.props.directions);
        });
    }catch(e){
      console.log(e);
    }
  }

  componentWillReceiveProps (nextProps) {
    const origin = this.props.origin;
    const dest = this.props.destination;
    const profType = this.props.type;
    

    if (this.state.directions && (!origin || !dest)) {
      this.setState({ directions: null });
      return;
    }

    const nextOrigin = nextProps.origin;
    const nextDest = nextProps.destination;
    const nextProfType = nextProps.type;
    const nextDirections = nextProps.directions;

    if (this.areCoordinatesEqual(origin, nextOrigin) && this.areCoordinatesEqual(dest, nextDest) && this.areProfileTypeEqual(profType,nextProfType)) {
      return;
    }

    if (nextOrigin && nextDest && nextProfType && nextDirections) {
      this.setDirections(nextOrigin, nextDest, nextDirections);
    }
  }

  componentDidUpdate(){
    console.log('Directions - didUpdate :');
    this.moveCameraToFitBounds();

  }

  areCoordinatesEqual (c1, c2) {
    if (!c1 || !c2) {
      return false;
    }
    const dLng = Math.abs(c1[0] - c2[0]);
    const dLat = Math.abs(c1[1] - c2[1]);
    return dLng <= 6e-6 && dLat <= 6e-6;
  }

  areProfileTypeEqual (p1, p2) {
    if (!p1 || !p2) {
      return false;
    }

    const compare = p1.localeCompare(p2);
    
    console.log('compare profiles :'+compare+' '+(compare == 0) );

    return  (compare == 0);
 
  }

  setDirections (origin, dest, directions) {
    
    console.log('directions - set : '+directions);
    if (!origin || !dest || !this.state.mapboxGL) {
          return;
    }

    if (!directions) {
      return;
    }

    this.setState({ directions: directions });

  } 
  
    //Map camera transitions to fit provided bounds
    moveCameraToFitBounds(){
      console.log('Directions - moveCamera');
      if (!this.props.origin || !this.props.destination || !this.state.mapboxGL) {
          return;
      }

      console.log('Directions - moveCamera');
      //this.state.mapboxGL.setVisibleCoordinateBounds();
      this.state.mapboxGL.fitBounds(this.props.origin, this.props.destination, 50);
  

  }


  render(){
      console.log('Directions -render');
      if (!this.state.directions) {
        return null;
      }
      
      return (
          <MapboxGL.ShapeSource id='mapbox-directions-source' shape={this.state.directions.geometry}>
            <MapboxGL.LineLayer
              id='mapbox-directions-line'
              belowLayerID={Places.UnselectedSymbolID}
              style={[styles.directionsLine, this.props.style]} />
          </MapboxGL.ShapeSource>
      );
  }
}

export default Directions;
