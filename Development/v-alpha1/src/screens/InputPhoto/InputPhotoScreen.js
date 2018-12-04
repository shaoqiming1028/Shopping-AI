import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';

import GetProduct from '../../components/GetProduct/GetProduct';
import { getAllInfo, getImage, postImage } from '../../store/actions/index';

class InputPhotoScreen extends Component {
	photoHandler = () => {
		ImagePicker.showImagePicker(
			{
				title: 'Pick a image of a product',
				maxHeight: 500
			},
			(res) => {
				if (res.didCancel) {
					console.log('user cancelled');
				} else if (res.error) {
					console.log('Error', res.error);
				} else {
					this.props.onGetImage(res.uri);
					this.props.onPostImage(res.uri);
					//this.props.onGetInfo();
					this.props.navigator.push({
						screen: 'Shopping-Assistant.ListResultScreen',
						title: 'Retrieval Result'
					});
				}
			}
		);
	};

	render() {
		return (
			<View>
				<Text>Photo Input page</Text>
				<View style={styles.buttonContainer}>
					<Button title="Take a Photo" onPress={this.photoHandler} />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttonContainer: {
		marginVertical: 10
	}
});

const mapDispatchToProps = (dispatch) => {
	return {
		onGetInfo: () => dispatch(getAllInfo()),
		onGetImage: (image) => dispatch(getImage(image)),
		onPostImage: (image) => dispatch(postImage(image))
	};
};

export default connect(null, mapDispatchToProps)(InputPhotoScreen);
