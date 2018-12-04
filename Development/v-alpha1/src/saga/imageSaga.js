import { POST_IMAGE, RECEIVE_INFO } from '../store/actions/actionTypes';
import { reciveInfo } from '../store/actions/index';
import { put, takeEvery, fork, cancel, call, select } from 'redux-saga/effects';
import { fetchInfo } from '../server/Api';

function* fetchImage(actions) {
	console.log('fetchImage start');
	try {
		const image = actions.image;
		const infoDetail = yield call(fetchInfo, image);
		console.log(typeof infoDetail);
		yield put(reciveInfo(infoDetail));
	} catch (error) {
		console.log('detail error result', error.message);
	}
}

export function* watchFetchImage() {
	yield takeEvery(POST_IMAGE, fetchImage);
}
