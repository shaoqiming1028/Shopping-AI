import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const listSimilarProduct = (props) => (
    <View style={styles.spContainer}>
        <View>
            <Image source={props.image} style={styles.productImage}/>
        </View>
        <View>
            <Text>{props.name}</Text>
        </View>
        <View>
            <Text>{props.price}</Text>
        </View>
    </View>
)

const styles = StyleSheet.create({
    spContainer: {
        flexDirection: 'column',
        backgroundColor: '#B0E2FF',
        marginTop: 5,
        marginLeft: 15,
        alignItems:'center',
        borderColor:'black'
    },
    productImage: {
        width: 100,
        height: 100,
    }
})

export default listSimilarProduct;