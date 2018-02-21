import React, {Component} from 'react';
import {View, StyleSheet, MapView } from 'react-native';
import MapboxGL  from '@mapbox/react-native-mapbox-gl'; 
import PropTypes from 'prop-types';
import Constants from './../../util.js'
import Directions from './Directions';



export default class ShowMap extends Component {
    static propTypes = {
            
        /**
         * Origin coordinate in [longitude, latitude] format
         */
        src: PropTypes.arrayOf(PropTypes.number),
    
        /**
         * Destination coordinate in [longitude, latitude] format
         */
        dest: PropTypes.arrayOf(PropTypes.number),
        /**
         * Origin place
         */

        srcName: PropTypes.string,
        /**
         * Destination place
         */
        destName: PropTypes.string,
        /**
         *  Value to indicate whether the Map is to be rendered for the first time or not
         * 
         */
        first: PropTypes.bool,
        /**
        * Type of directions that are fetched from API. Possible choices are
        * walking, driving, cycling. Defaults to driving
        */
        proType: PropTypes.string,
         /**
         * Directions to display the route from source to destination
         */
       
        directions: PropTypes.object  
      };

    constructor(props){
        super(props);

        this.state = {
            mapboxGL: null,
        };
        

    }
    
   componentDidMount () {
        console.log('ShowMap - didMount :');

        this.setState({ mapboxGL: new MapboxGL.MapView(Constants.mapboxAccessToken) });
    }

    displayDirections(){
        if (!this.props.directions){
            return null;
        }
        return ( <Directions 
            accessToken={Constants.mapboxAccessToken} 
            origin={this.props.src} destination={this.props.dest} sourceName={this.props.srcName} destnName={this.props.destName}
            type={this.props.proType} 
            directions={this.props.directions}
        /> );
    }
   
    render(){

    const {src, dest, srcName, destName, first, proType, directions} = this.props;
  
    console.log('ShowMap : '+src+' '+' '+dest+' '+first+' '+proType);
        if(first == true ) {
            return(
                <MapboxGL.MapView
                    ref={(c) => this._map = c}
                    style={styles.container}
                    minZoomLevel = {1}
                    maxZoomLevel={24}
                    zoomLevel={3}
                    zoomEnabled ={true}
                    scrollEnabled= {true}
                    centerCoordinate={src}
                    styleURL = {MapboxGL.StyleURL.Street}
                    
               />
            );
        }
        else
        {   
            return (
                <MapboxGL.MapView
                    ref={(c) => this._map = c}
                    style={styles.container}
                    minZoomLevel = {1}
                    maxZoomLevel={24}
                    zoomLevel={3}
                    zoomEnabled ={true}
                    scrollEnabled= {true}
                    centerCoordinate={src}
                    styleURL = {MapboxGL.StyleURL.Street}
                    
                    //OnMapChangedListener={this.moveCameraToFitBounds}
                    >
                     
                        <MapboxGL.PointAnnotation
                            key='SourceAnnotation'
                            id='SourceAnnotation'
                            coordinate={src}>

                          <MapboxGL.Callout title={srcName.toUpperCase()} />

                        </MapboxGL.PointAnnotation>
                        <MapboxGL.PointAnnotation
                            key='DestinationAnnotation'
                            id='DestinationAnnotation'
                            coordinate={dest}>
                            
                            <MapboxGL.Callout title={destName.toUpperCase()} />
                        </MapboxGL.PointAnnotation>
                       {this.displayDirections()}
                        
                                                        
                </MapboxGL.MapView>
                
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: null
      }
  });
  
  