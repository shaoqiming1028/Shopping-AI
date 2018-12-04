//ImageURL
const image_URL = 'http://10.201.33.237:4000/mobile_upload';
const tmp_url = 'https://facebook.github.io/react-native/movies.json';

export function fetchInfo(image) {
	console.log('fetchInfo start');
	console.log(image);

	const photo = {
		uri: image,
		type: 'image/jpg',
		name: 'product.jpg'
	};

	/* globals FormData */
	const data = new FormData();
	data.append('photo', photo);

	// return new Promise((resolve, reject) => {
	// fetch(image_URL, {
	// 	method: 'POST',
	// 	headers: {
	// 		Accept: 'application/json',
	// 		'Content-Type': 'multipart/form-data',
	// 		'Accept-Charset': 'utf-8',
	// 		'User-Agent': 'Mozilla/5.0 (Linux; X11)'
	// 	},
	// 	body: data
	// })
	// 		.then((response) => {
	// 			console.log('repsonse: ');
	// 			console.log(response.json());
	// 			return response.json();
	// 		})
	// 		.catch((error) => {
	// 			reject(error);
	// 		})
	// 		.then((responseData) => {
	// 			console.log('repsonse data: ');
	// 			console.log(responseData);
	// 			if (!responseData) {
	// 				reject(new Error('fetchJSON:responseData is null'));
	// 				return;
	// 			}
	// 			resolve(responseData);
	// 		})
	// 		.done();
	// });
	return fetch(image_URL, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
			'Accept-Charset': 'utf-8',
			'User-Agent': 'Mozilla/5.0 (Linux; X11)'
		},
		body: data
	})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);
			return responseJson;
		})
		.catch((error) => {
			console.error(error);
		});
}
