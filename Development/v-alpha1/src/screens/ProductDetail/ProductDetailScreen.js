import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text, Image } from 'react-native';

import ListSeller from '../../components/ListSeller/ListSeller';

class ProductDetailScreen extends Component {
	render() {
		const sellerOutput = this.props.selectedProduct.sellerList.map((seller, index) => (
			<ListSeller key={index} name={seller.name} location={seller.location} price={seller.price} />
		));

		return (
			<View style={styles.productDetialContainer}>
				<View style={styles.nameContainer}>
					<Text style={styles.prodcutName}>{this.props.selectedProduct.productName}</Text>
				</View>
				<View>
					<Image source={{ uri: this.props.selectedProduct.image }} style={styles.productImage} />
				</View>
				<View style={styles.infoContainer}>
					<Text style={styles.productInfo}>{this.props.selectedProduct.productInfo}</Text>
				</View>
				<Text>Seller area</Text>
				<ScrollView style={styles.sellerContainer}>{sellerOutput}</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	productDetialContainer: {
		width: '100%',
		alignItems: 'center'
	},
	productImage: {
		width: 160,
		height: 160,
		marginTop: 5
	},
	nameContainer: {
		width: '80%',
		marginLeft: 30,
		marginTop: 20
	},
	prodcutName: {
		fontWeight: 'bold',
		fontSize: 20,
		color: '#121212',
		textAlign: 'center'
	},
	infoContainer: {
		marginTop: 5
	},
	productInfo: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#828282'
	},
	sellerContainer: {
		width: '100%',
		height: '25%',
		backgroundColor: '#8DB6CD'
	}
});

export default ProductDetailScreen;
