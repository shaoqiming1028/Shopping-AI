import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

const listProduct = (props) => (
	<View style={styles.productContainer}>
		<View style={styles.textContainer}>
			<Text style={styles.productText}>{props.name}</Text>
			<Text style={styles.productText}>{props.price}$</Text>
		</View>
		<TouchableOpacity onPress={props.onProductPressed} style={styles.touchView}>
			<Image source={{ uri: props.image }} style={styles.productImg} />
		</TouchableOpacity>
	</View>
);

const styles = StyleSheet.create({
	productContainer: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: 10,
		backgroundColor: '#eee',
		width: 255,
		height: 330
	},
	textContainer: {
		justifyContent: 'center',
		width: 220,
		height: 70
		//backgroundColor: '#EEEE00'
	},
	productText: {
		fontWeight: 'bold',
		fontSize: 14,
		color: '#121212',
		textAlign: 'center'
	},
	touchView: {
		width: 170,
		height: 170,
		borderRadius: 85,
		borderColor: '#5E5E5E',
		backgroundColor: '#fff',
		marginTop: 5
	},
	productImg: {
		marginTop: 25,
		marginLeft: 25,
		width: 120,
		height: 120
		//borderRadius: 85
		// backgroundColor: '#C4C4C4'
	}
});

export default listProduct;
