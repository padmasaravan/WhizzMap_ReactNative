// Import libraries for making a component
import React from 'react';
import { Text, View, Platform } from 'react-native';

// Create a component

const Title = (props) => {
    const { textStyle, viewStyle } = styles;
    return (
     <View style={viewStyle}>
        <Text style={textStyle}>{props.titleText}</Text>
    </View>
    );
};
// Make the component available to other parts of the app

export default Title;

const styles = {
    viewStyle: {
        //backgroundColor: '#FFFFFF',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingTop: 5,
        ...Platform.select({
            ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.6
            },
            android: {
              elevation: 2
            }
          }),
        position: 'relative',
        borderColor: '#02A6FD',
        borderWidth: 1,
    },
    textStyle: {
        fontSize: 20,
        fontFamily: 'Arial',
        fontWeight: '500',
        color: 'white'
       
    }
};
