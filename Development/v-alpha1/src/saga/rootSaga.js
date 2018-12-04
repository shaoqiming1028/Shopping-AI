import { all, fork } from 'redux-saga/effects';

import { watchFetchImage } from './imageSaga';

const rootSaga = function* root() {
	console.log('rootsaga start');
	yield fork(watchFetchImage);
};

export default rootSaga;
