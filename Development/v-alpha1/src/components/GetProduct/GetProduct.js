import React, {Component} from 'react';
import { View, Button, StyleSheet} from 'react-native';

class GetProduct extends Component{

    render() {
        return (
            <View >
                <Button title="add" onPress={this.props.addProducts}/>
            </View>
        )
    }
}

const style = StyleSheet.create({

})

export default GetProduct;