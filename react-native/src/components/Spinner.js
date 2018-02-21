import React from 'react';
import {ActivityIndicator, View, Text } from 'react-native';
import Footer from './Footer';

const Spinner = (size) => {
    return(
        <View style={styles.spinnerStyle}>
            <ActivityIndicator size="large" color='orange'/>
          
        </View>
        
    );
};

export default Spinner;

const styles = {
    spinnerStyle: {
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderColor: '#0383FA',
        borderWidth: 0.20,
    }
};