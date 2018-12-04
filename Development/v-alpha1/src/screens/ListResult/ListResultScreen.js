import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import ListProduct from '../../components/ListProduct/ListProduct';

class ListResultScreen extends Component {
	productSelectedHandler = (productName) => {
		const selProduct = this.props.products.find((product) => {
			return product.productName === productName;
		});

		this.props.navigator.push({
			screen: 'Shopping-Assistant.ProductDetailScreen',
			title: selProduct.productName,
			passProps: {
				selectedProduct: selProduct
			}
		});
	};

	render() {
		const productsOutput = this.props.products.map((product, index) => (
			<ListProduct
				key={index}
				name={product.productName}
				price={product.sellerList[0].price}
				image={product.image}
				onProductPressed={() => this.productSelectedHandler(product.productName)}
			/>
		));

		return (
			<View style={styles.container}>
				{this.props.isFetchInfo ? (
					<View>
						<Image source={this.props.photoUri} style={styles.photoWaitContainer} />
						<View style={styles.waitContainer}>
							<ActivityIndicator size="large" color="#00ff00" />
							<Text style={styles.loadingText}>Loding, please wait...</Text>
						</View>
					</View>
				) : (
					<View>
						<Image source={this.props.photoUri} style={styles.photoContainer} />
						<ScrollView style={styles.productListContainer} horizontal={true}>
							{productsOutput}
						</ScrollView>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	photoContainer: {
		width: '100%',
		height: '43%'
	},
	photoWaitContainer: {
		width: '100%',
		height: '70%'
	},
	waitContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 45
	},
	loadingText: {
		color: '#4876FF',
		fontSize: 16
	},
	productListContainer: {
		width: '100%',
		flexDirection: 'row',
		// justifyContent: 'flex-start',
		height: '57%',
		backgroundColor: '#C1C1C1'
	}
});

const mapStateToProps = (state) => {
	return {
		products: state.products.products,
		photoUri: state.products.photoUri,
		isFetchInfo: state.products.isFetchInfo
	};
};

export default connect(mapStateToProps, null)(ListResultScreen);
