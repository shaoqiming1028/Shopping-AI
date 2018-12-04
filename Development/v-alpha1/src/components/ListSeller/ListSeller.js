import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const listSeller = (props) => (
	<View style={styles.sellerContainer}>
		<View style={styles.sellerName}>
			<Text style={styles.nameText}>{props.name}</Text>
		</View>
		<View style={styles.sellerLocation}>
			<Text style={styles.locationText}>{props.location}</Text>
		</View>
		<View style={styles.sellerPrice}>
			<Text style={styles.priceText}>{props.price}$</Text>
		</View>
	</View>
);

const styles = StyleSheet.create({
	sellerContainer: {
		width: '100%',
		flexDirection: 'row',
		backgroundColor: '#AAAAAA',
		marginTop: 2
	},
	sellerName: {
		marginHorizontal: 8,
		marginVertical: 2
	},
	nameText: {
		color: '#1A1A1A',
		fontSize: 16,
		fontWeight: '100'
	},
	sellerLocation: {
		marginLeft: 10,
		marginVertical: 2
	},
	locationText: {
		color: '#1C86EE',
		fontSize: 16
	},
	sellerPrice: {
		width: '50%',
		paddingLeft: '25%',
		marginVertical: 2
	},
	priceText: {
		fontSize: 16,
		color: '#CD3333'
	}
});

export default listSeller;
