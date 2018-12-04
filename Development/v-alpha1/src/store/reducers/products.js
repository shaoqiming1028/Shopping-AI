import { GET_ALLINFO, GET_IMAGE, POST_IMAGE, RECEIVE_INFO } from '../actions/actionTypes';

import modi_apple from '../../assets/modi_apple.jpg';

const initialState = {
	products: [],
	photoUri: modi_apple,
	isFetchInfo: false
};

const productsReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_ALLINFO:
			return {
				...state,
				products: state.products.concat(
					{
						key: Math.random(),
						productName: 'Lady Apple',
						productInfo: 'full of VC and VA',
						sellerList: [
							{
								sellerName: 'Coles',
								location: 'rundle mall',
								price: '$5/kg'
							},
							{
								sellerName: 'WoolWorth',
								location: 'rundle mall',
								price: '$5.5/kg'
							},
							{
								sellerName: 'Fresh Fruit',
								location: 'Central Market',
								price: '$6/kg'
							}
						],
						similarProductList: [ 'Fuji Apple', 'Jazz Apple', 'Dev Apple' ],
						image: {
							uri: 'https://shop.coles.com.au/wcsstore/Coles-CAS/images/5/8/9/5899409-th.jpg'
						}
					},
					{
						key: Math.random(),
						productName: 'Gala Apple',
						productInfo: 'full of VC and VA',
						sellerList: [
							{
								sellerName: 'Coles',
								location: 'rundle mall',
								price: '$3.4/kg'
							},
							{
								sellerName: 'WoolWorth',
								location: 'rundle mall',
								price: '$4/kg'
							},
							{
								sellerName: 'Fresh Fruit',
								location: 'Central Market',
								price: '$4.5/kg'
							}
						],
						similarProductList: [ 'Lady Apple', 'Jazz Apple', 'Dev Apple' ],
						image: {
							uri: 'https://shop.coles.com.au/wcsstore/Coles-CAS/images/5/2/2/5226000-th.jpg'
						}
					},
					{
						key: Math.random(),
						productName: 'Jazz Apple',
						productInfo: 'full of VC and VA',
						sellerList: [
							{
								sellerName: 'WoolWorth',
								location: 'rundle mall',
								price: '$5/kg'
							},
							{
								sellerName: 'Coles',
								location: 'rundle mall',
								price: '$5.5/kg'
							},
							{
								sellerName: 'Fresh Fruit',
								location: 'Central Market',
								price: '$6/kg'
							}
						],
						similarProductList: [ 'Lady Apple', 'Fuji Apple', 'Dev Apple' ],
						image: {
							uri: 'https://shop.coles.com.au/wcsstore/Coles-CAS/images/6/4/2/6427471-th.jpg'
						}
					}
				)
			};
		case GET_IMAGE:
			return {
				...state,
				photoUri: {
					uri: action.image
				}
			};
		case POST_IMAGE:
			return {
				...state,
				isFetchInfo: true
			};
		case RECEIVE_INFO:
			console.log('RECEIVE_INFO');
			console.log(action.productInfo);
			return {
				...state,
				products: action.productInfo,
				isFetchInfo: false
			};
		default:
			return state;
	}
};

export default productsReducer;
