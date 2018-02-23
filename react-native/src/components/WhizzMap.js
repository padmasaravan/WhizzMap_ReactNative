import React, {Component} from 'react';
import  MapboxGL   from '@mapbox/react-native-mapbox-gl'; 
import {Text, View, StyleSheet, TextInput, Alert, Image } from 'react-native';
import axios from 'axios';
import ShowMap from './ShowMap';

import LocationInput from './LocationInput';
import Directions from './Directions';
import Instructions from './Instructions';
import Spinner from './Spinner';

import  Constants from './../../util.js';
import Footer from './Footer';


MapboxGL.setAccessToken(Constants.mapboxAccessToken);


export default class WhizzMap extends Component {

    constructor(props) {
    
        super(props);
      
        this.state =  {
            src: null,
            dest: null,
            profile: 'driving',
            srcLatLng: {
                 lat: Constants.INITIAL_SRC_LAT, lng: Constants.INITIAL_SRC_LNG
            },
            destLatLng: {
                 lat: Constants.INITIAL_DEST_LAT, lng: Constants.INITIAL_DEST_LNG
            },
            isFirst: true,
            directions: null,
            instructions: [],
            isInstFetched: false,
            distance: null,
            duration: null,
            loading: false,

        };

        this.updateInputs = this.updateInputs.bind(this);
        this.displayInstructions = this.displayInstructions.bind(this);
        this.convertDist = this.convertDist.bind(this);
        this.convertTime = this.convertTime.bind(this);
        this.convertCoordinates = this.convertCoordinates.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
        
    }
  
    async updateInputs(src, dest, pro){
        console.log('Whizmmap '+src+' '+dest+' '+pro);

        if(!src && !dest && !pro){ //Null value to clear all the state and route
            // Change all the state values to default values
            this.setState({
                srcLatLng: {
                    lat: Constants.INITIAL_SRC_LAT, lng: Constants.INITIAL_SRC_LNG
            },
            destLatLng: {
                    lat: Constants.INITIAL_DEST_LAT, lng: Constants.INITIAL_DEST_LNG
            },
                isFirst: true,
                src: null,
                dest: null,
                directions: null,
                instructions: [],
                isInstFetched: false,
                distance: null,
                duration: null,
                loading: false,
                profile: null,
            });
            
            return; 
        }

        const sLower = src.toLowerCase();
        const dLower = dest.toLowerCase();
        const tProfile = pro.toLowerCase();

        console.log('update locations : '+ sLower +' '+dLower+' '+tProfile);

        let srcCoord = null;
        let destCoord = null;
        let errLoc = null;
       
        //set state loading - true

        this.setState( {
            loading:true,
            directiions: null
        })

        // check error in location
        srcCoord =  await this.getCoordinates(sLower);
        destCoord = await this.getCoordinates(dLower);
        
        if (!srcCoord || !destCoord){ // Error in location
            
            if (!srcCoord){
                errLoc = 'Starting Place';
            }else{
                errLoc = 'Destination';
            }

            Alert.alert('Location Error',errLoc+' not found  !!!');
            console.log('no location');
            
            // Change all the state values to default values
            this.setState({
                srcLatLng: {
                    lat: Constants.INITIAL_SRC_LAT, lng: Constants.INITIAL_SRC_LNG
               },
               destLatLng: {
                    lat: Constants.INITIAL_DEST_LAT, lng: Constants.INITIAL_DEST_LNG
               },
                isFirst: true,
                src: null,
                dest: null,
                directions: null,
                instructions: [],
                isInstFetched: false,
                distance: null,
                duration: null,
                loading: false,
                
            });
            
            return;
        }
       
        // Sending request to Backend API endpoint - directions
        const endPointUrl = 'https://app.'+Constants.clusterName+'.hasura-app.io/directions'
        console.log(endPointUrl);
 
        // setting the Header
        const reqHeader = {
            'Content-Type': 'application/json'
        };
        
        // Request - as json object
        const reqBody = {
         start: sLower,
         end: dLower,
         profile: tProfile
       };
       console.log(reqBody);
 
        let resBackEnd = null;

        try{
             resBackEnd = await axios.post(endPointUrl, reqBody, reqHeader);
             
         }catch (e) {
             console.log(e); // eslint-disable-line
         }
 
         if (resBackEnd == null) { // No response 
             return;
         }
      
         const resData = resBackEnd.data;
                

         if (!(resData.routes) ) // No route found
         {
            
                Alert.alert('No Route Error','No route found for the given Inputs !!!');
                console.log('no route');
          
                // Change all the state values to default values
                this.setState({
                    srcLatLng: {
                        lat: Constants.INITIAL_SRC_LAT, lng: Constants.INITIAL_SRC_LNG
                   },
                   destLatLng: {
                        lat: Constants.INITIAL_DEST_LAT, lng: Constants.INITIAL_DEST_LNG
                   },
                    isFirst: true,
                    src: null,
                    dest: null,
                    directions: null,
                    instructions: [],
                    isInstFetched: false,
                    distance: null,
                    duration: null,
                    loading: false,
                    
                });
           
           
             return;
         }
        
         const resDirc = resData.routes[0]; // directions
         srcCoord= resData.origin.geometry.coordinates; // source coordinates
         destCoord= resData.destination.geometry.coordinates; //destinatiom coordinates
         const resDist= resData.routes[0].distance;  // distance in metres
         const resDurn= resData.routes[0].duration; // distance in seconds
         const resSteps= resData.routes[0].steps; // instructions
 
        srcCoord = this.convertCoordinates(srcCoord); // Convert to process extract lat, long
        destCoord = this.convertCoordinates(destCoord);
       
         
         //Instructions to travel from source to destination
 
         let instructions = [];
         resSteps.forEach(step => {
             instructions.push(step.maneuver.instruction);
         });
    
        // Convert Time  & Distance
        const convDist = this.convertDist(resDist); // Distance metres - kms
        const convDurn = this.convertTime(resDurn); // Duration secs - Day/Hour/Min

        // set state

        this.setState({
            srcLatLng: {
                lat: srcCoord.lat, lng: srcCoord.lng
            },
            destLatLng: {
                lat: destCoord.lat, lng: destCoord.lng
            },
            profile: tProfile,
            isFirst: false,
            src: sLower,
            dest: dLower,
            directions: resDirc,
            instructions: instructions,
            isInstFetched: true,
            distance: convDist,
            duration: convDurn,
            loading: false
        });
         
    }

    async getCoordinates(name){ //Helper method to check the locations are entered correctly
        
       
        const req = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+name+'.json?access_token='+Constants.mapboxAccessToken;
        
        console.log(req);

        let coord = null;
        let res = null;
        
         // axios.get
        try{
           res = await axios.get(req);
           //console.log( await res);
        }catch (e) {
            console.log(e); // eslint-disable-line
        }

        if (res == null) {
            return;
        }
        
        
        const place = res.data;

        console.log(place);
        if (!place.features.length){
            console.log('features : '+place.features);
            return ;
        }
        const latLng= place.features[0].geometry.coordinates;
 
        coord = { 'lat': latLng[1], 'lng':latLng[0] };

        return (coord);
    }
    
    convertCoordinates(coord){
  
        const convCoord = { 'lat': coord[1], 'lng':coord[0] };
        return (convCoord);

    }
 
    displayInstructions(){
        
        if (this.state.loading){
            return <Spinner/>
        }
        if (this.state.isInstFetched && this.state.distance && this.state.duration) {
             return ( 
                <Instructions  instructions={this.state.instructions}  
                                dist={this.state.distance.toString()} 
                                durn={this.state.duration.toString()} />
            );
        } else {
            
             return null;
        }

    }

    convertDist(dist){
        console.log(dist);
        
        let distKm = dist / 1000;
        distKm = distKm.toFixed(1);
        const newDistance = distKm > 0 ? distKm + ( distKm == 1?' km ':' kms '): '';
        return newDistance;

    }

    convertTime(durn){
        console.log(durn);
        const days = Math.floor(durn/86400); // 24*60*60
        const hours = Math.floor( (durn % 86400) / 3600); // 60*60
        const mins = Math.floor( (durn % 86400) % 60);
        
        const daysStr = days > 0 ? days + ( days == 1?' day, ':' days, '): '';
        const hoursStr = hours > 0 ? hours + ( hours == 1?' hr, ':' hrs, '): '';
        const minsStr = mins > 0 ? mins + ( mins == 1?' min ':' mins '): '';

        return (daysStr + hoursStr + minsStr);
    }
        
    render () {
       
        
        let sLat = parseFloat(this.state.srcLatLng.lat);
        let sLng = parseFloat(this.state.srcLatLng.lng);
        let dLat = parseFloat(this.state.destLatLng.lat);
        let dLng = parseFloat(this.state.destLatLng.lng);
        console.log('sLat '+sLat);
        console.log('sLng '+sLng);
        console.log('dLat '+dLat);
        console.log('dLng '+dLng);
        console.log('isFirst : '+this.state.isFirst);
        
        return (
            <View style={{ flex: 1}}>
                    <LocationInput updateInputs={(src,dest,pro) => this.updateInputs(src, dest,pro)}  /> 
                    <ShowMap src={[sLng,sLat]} dest={[dLng,dLat]} 
                                srcName={this.state.src} destName={this.state.dest} 
                                first={this.state.isFirst} proType={this.state.profile}
                                directions={this.state.directions}
                    />
                    { this.displayInstructions() }
                    <Footer />
                    
            </View>   
        );  
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
  },
  footerLogoContainer:{
      flexDirection: 'row',
    backgroundColor: '#424140',
    justifyContent: 'center',
        alignItems: 'center',
  },
  footerText: {
    color:'orange',
    fontSize: 15,
  },
});