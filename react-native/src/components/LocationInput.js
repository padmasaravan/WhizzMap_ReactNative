import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Keyboard, TouchableOpacity  } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import Card from './Card';
import CardSection from './CardSection';

const source = null;
const destination = null;
const pData = [{
    value: 'Driving',
  }, {
    value: 'Cycling',
  }, {
    value: 'Walking',
  }];

let profile = 'driving';


class LocationInput extends Component{
    constructor(props){
        super(props);

        this.updateInputs = this.updateInputs.bind(this);
        
    }
    
    updateInputs(){
         
        source = this.refs.sText._lastNativeText;
        destination = this.refs.dText._lastNativeText;
        if (source && destination){
            Keyboard.dismiss();
  
            profile = this.refs.proDDown.value();
            console.log('Location : profile '+profile);
            
            
            this.props.updateInputs(source, destination, profile);
        }   
     }

     
    render(){
        const { textLabel, textboxStyle, buttonStyle, dDownButtonContainerStyle, dDownStyle,buttonTxt} = styles;
        
        Keyboard.dismiss();
        return(
            <Card>
                <CardSection >
                    <Text style={textLabel}>Source</Text>
                    <TextInput 
                        ref="sText"
                        style= {textboxStyle}
                        placeholderTextColor = "black"
                        autoCapitalize = "none"
                        underlineColorAndroid = 'transparent'
                        />
                    
                </CardSection>
                <CardSection>
                    <Text style={textLabel}>Destination</Text>
                    <TextInput 
                        ref="dText"
                        style= {textboxStyle}
                        placeholderTextColor = "black"
                        autoCapitalize = "none"
                        underlineColorAndroid = 'transparent'
                        />
                    
                    
                </CardSection>
                <View style={dDownButtonContainerStyle}>
                    <View style={dDownStyle}>
                        <Dropdown 
                            ref="proDDown"
                            data={pData}
                            label='Mode'
                            value= 'Driving'
                            textColor="#6F0117"
                            labelHeight= {20}
                            labelFontSize= {16}
                            dropdownPosition= {1}
                            onChangeText={this.updateInputs}
                            />
                    </View>
                    <View>
                            <TouchableOpacity onPress={this.updateInputs} style={buttonStyle}>
                                <Text style={buttonTxt}>Show Route</Text>
                            </TouchableOpacity>
                    </View>
                </View>
        </Card>
        );
    }
}

export default LocationInput;

const styles = StyleSheet.create({
    textLabel: {
        fontSize: 16,
        fontFamily: 'Times New Roman',
        color: '#6F0117'
        
    },
    textboxStyle: {
        width: 200,
        height: 40,
        marginLeft : 15,
        fontSize: 16,
        fontFamily: 'Times New Roman',
        
    },
    buttonStyle: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'black',
        width :200,
        height: 30
    },
    buttonTxt: {
        fontSize: 16,
        fontFamily: 'Times New Roman',
        textAlign: 'center',
        color: '#6F0117',
    },
    dDownButtonContainerStyle: {
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#E4F5FC',
    },
    dDownStyle: {
        flex : 1,
        }
 })