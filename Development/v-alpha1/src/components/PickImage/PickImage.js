import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

class PickImage extends Component {

    state = {
        pickedImage: null,
    }

    render () {
        return (
            <View style={styles.container}>
                <Image
                    source={this.state.pickedImage} 
                    style={styles.ImageContainer}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: '100%'
    },
    ImageContainer:{
        width: '100%',
        height: 300
    }
})


export default PickImage;