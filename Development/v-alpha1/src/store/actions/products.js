import { GET_ALLINFO, GET_IMAGE, POST_IMAGE, RECEIVE_INFO } from './actionTypes';

export const getAllInfo = () => {
	return {
		type: GET_ALLINFO
	};
};

export const getImage = (image) => {
	return {
		type: GET_IMAGE,
		image: image
	};
};

export const postImage = (image) => {
	return {
		type: POST_IMAGE,
		image: image
	};
};

export const reciveInfo = (productInfo) => {
	console.log('reciveInfo start');
	console.log(productInfo);
	return {
		type: RECEIVE_INFO,
		productInfo: productInfo
	};
};
