import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import productsReducer from './reducers/products';
import rootSaga from '../saga/rootSaga';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
	products: productsReducer
});

let composeEnhancers = compose;

if (__DEV__) {
	composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

export default function configureStore() {
	const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
	sagaMiddleware.run(rootSaga);
	return store;
}
