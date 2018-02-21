import React, {Component}  from 'react';
import { View, Text, StyleSheet, Modal, ListView, TouchableOpacity } from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import PropTypes from 'prop-types';
import ActionSheetCustom from 'react-native-actionsheet/lib/ActionSheetCustom';

const title = <Text style={{color: '#000', fontSize: 18}}>Directions - Turn by Turn Navigation</Text>

class Instructions extends Component{

    static propTypes = {
                 
        /**
         * Instructions to navigate from source to destination
         */
        instructions: PropTypes.arrayOf(PropTypes.string),
        /**
         * Distance between source and destination
         */
        dist: PropTypes.string,
        /**
         * Time taken to travel from source to destination
         */
        durn: PropTypes.string
      };

    constructor(props){
        super(props);

        this.state = {
            instructions: []
        }

        this.showInstrActionSheet = this.showInstrActionSheet.bind(this);
    }


    componentDidMount () {
        console.log('Instructions - didMount :');
        this.setState({ instructions: this.props.instructions});
    }
    
    showInstrActionSheet(){
        this.ActionSheet.show();
    }

    render(){
        
        const { instructions, dist, durn } = this.props;
        
        let  optionsInstrc = ['Show Map'];
        optionsInstrc.push(...instructions); // ... spread operator ES6
       
        const instLen = optionsInstrc.length;
        return(
            <View>
                <TouchableOpacity onPress={this.showInstrActionSheet} style={styles.distDurnContainer}>
                        <Text style={styles.durnTextStyle}>{durn}</Text>
                        <Text style={styles.distTextStyle}>( {dist} )</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.showInstrActionSheet} style={styles.dircContainer}>
                       <Text style={styles.buttonTextStyle}>Show Directions</Text>
                </TouchableOpacity>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={title}
                    options={optionsInstrc}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={instLen+1}
                />
               
            </View>
        );
    }
}

export default Instructions;

const styles = {
    distDurnContainer:{
        flexDirection: 'row',borderColor: '#02A6FD',borderWidth: 0.20
    },
    dircContainer:{
        borderColor: '#02A6FD',borderWidth: 0.20
    },
    durnTextStyle:{
        color: '#FC1B08',
        fontSize: 15,
        fontWeight: '500',
        paddingTop: 10,
        paddingBottom: 10,
        height: 40,
        marginLeft: 15,
        marginRight: 5
    },
    distTextStyle:{
        //color: '#666565',
        color: 'green',
        fontSize: 15,
        fontWeight: '500',
        paddingTop: 10,
        paddingBottom: 10,
        height: 40,
        marginLeft: 5,
        marginRight: 10
    },
    buttonTextStyle: {
           
            color: '#007aff',
            fontSize: 16,
            fontWeight: '600',
            paddingTop: 6,
            paddingBottom: 10,
            height: 35,
            marginLeft: 15,
            justifyContent: 'center',
           
    },
    
};

   