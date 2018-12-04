import React from 'react';
import {View, TouchableHighlight, Text, StyleSheet} from 'react-native';

const customButton = (props) => (
    <View style={styles.buttonContianer}>
        <TouchableHighlight
            onPress={props.onClosePressed}
            style={styles.btnState}
            underlayColor='#ABABAB'
        >
            <Text style={styles.btnText}>Close</Text>
        </TouchableHighlight>
        <TouchableHighlight
            onPress={props.onSharePressed}
            style={styles.btnState}
            underlayColor='#ABABAB'
        >
            <Text style={styles.btnText}>Share</Text>
        </TouchableHighlight>
    </View>
)

const styles = StyleSheet.create({
    buttonContianer: {
        width: '100%',
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 50
    },
    btnState: {
        width: 100,
        backgroundColor: '#66CDAA',
        padding: 5,
        marginLeft: 30,
        borderRadius: 30
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
})

export default customButton;