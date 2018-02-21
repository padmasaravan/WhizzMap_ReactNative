import React from 'react';
import { View, Text, Image } from 'react-native';

const Footer = () => {
    return(
        <View style={styles.footerLogoContainer}>
                <Image source={require('../../assets/hasura_horn.png')} /><Text style={styles.footerText}>  Powered by Hasura</Text>
        </View>
    );
}

export default Footer;

const styles = {
    footerLogoContainer:{
        flexDirection: 'row',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#02A6FD',
        borderWidth: 0.4,
    },
    footerText: {
        color:'orange',
        fontSize: 15,
    },
};